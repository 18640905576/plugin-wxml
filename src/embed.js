const { doc } = require("prettier");
const parser = require("@babel/parser");
const parseTemplate = require("./parseTemplate");

const { fill, line, group, indent, softline, hardline, join } = doc.builders;

const embed = (path, print, textToDoc, options) => {
  const node = path.getValue();
  if (!node || !node.type) return null;
  switch (node.type) {
    case "text":
      const text = node.data;
      return parseAndPrintJSExpression(textToDoc, print, options)(text);
    case "tag":
      return printTags(textToDoc, print, options)(path);
    default:
      return null;
  }
};

/**
 * 处理标签tag 处理排序 处理标签中的插值
 * @param {*} textToDoc
 * @param {*} print
 * @param {*} options
 */
function printTags(textToDoc, print, options) {
  return (path) => {
    const node = path.getValue();
    const hasParent = !!(node.parent && node.parent.type !== "root");
    const hasChildren = node.children.length > 0;
    // 处理后代
    const children = [];
    path.each((childPath) => {
      const child = childPath.getValue();
      if (
        child.type !== "text" ||
        (child.type === "text" && child.data.trim() !== "")
      ) {
        children.push(softline);
      }
      children.push(childPath.call(print));
    }, "children");
    // 处理属性
    const attributeKeys = getSortAttributeKeys(Object.keys(node.attribs));

    const attributeTexts = attributeKeys.map((attributeKey) => {
      const value = node.attribs[attributeKey];
      const parts = [line, attributeKey];
      // 也许是裸js对象
      const canbeNakedJSObject =
        (node.name === "template" && attributeKey === "data") ||
        (attributeKey === "style" &&
          typeof value === "string" &&
          value.trim().startsWith("{{"));

      if (value !== true) {
        parts.push(
          '="',
          // JS 表达式
          parseAndPrintJSExpression(textToDoc, print, options)(
            value,
            canbeNakedJSObject,
            true
          ),
          '"'
        );
      }
      return parts;
    });
    const attributes =
      attributeKeys.length > 0
        ? group([
            indent(attributeTexts),
            options.axmlBracketSameLine ? "" : hasChildren ? softline : "",
          ])
        : "";
    const openingTagEnd = hasChildren ? ">" : [line, "/>"];
    return group([
      "<",
      node.name,
      attributes,
      openingTagEnd,
      indent(children),
      hasChildren ? [softline, "</", node.name, ">"] : "",
      hasParent ? "" : softline,
    ]);
  };
}

/**
 * 给 wxml 属性排序
 * @param {*} attrs []
 */
function getSortAttributeKeys(attrs) {
  // wxml属性的顺序要求
  // 1. 条件类型：wx:if 、wx:else
  // 2. 样式类型：style、class
  // 3. 组件基础属性
  // 4. 事件类型 bind catch
  const SORT = {
    "wx:if": 0,
    "wx:else": 1,
    "wx:for": 2,
    "wx:index": 3,
    class: 4,
    style: 5,
  };
  let attrBefore = [];
  let attrMiddle = [];
  let attrAfter = [];
  attrs.forEach((key, index) => {
    if (Object.keys(SORT).includes(key)) {
      attrBefore.push(key);
    } else if (/^bind/.test(key) || /^catch/.test(key)) {
      attrAfter.push(key);
    } else {
      attrMiddle.push(key);
    }
  });
  // attrBefore 排序
  attrBefore.sort((a, b) => {
    return SORT[a] - SORT[b];
  });
  return [].concat(attrBefore, attrMiddle, attrAfter);
}

/**
 * 处理text中的插值
 * @param {*} textToDoc
 * @param {*} _print
 * @param {*} options
 */
function parseAndPrintJSExpression(textToDoc, _print, options) {
  return (text, isForceNakedJSObject = false, isAttribute = false) => {
    let tokens = [["text", text, 0, text.length]];
    // 提取模板字符串
    try {
      tokens = parseTemplate(text);
    } catch {}
    // 去除空白和无效模板
    const tokensLen = tokens.length;
    if (!tokensLen || (tokensLen === 1 && !tokens[0][1].replace(" ", ""))) {
      return [""];
    }

    // 组装
    return group(
      tokens.map((token, index) => {
        const [type, data] = token;
        let str = data;
        // 普通字符串
        if (type === "text") {
          // 保持属性文本中的空格相同
          if (isAttribute) return str.replace(/(\s)+/g, " ");

          // 多个换行符保留一个
          if (
            str.trim().length === 0 &&
            str.split("").filter((char) => char === "\n").length > 1
          ) {
            return hardline;
          }

          // 替换分隔符
          str = str.replace(/(\s)+/g, " ");

          // 跳过空白
          if (str === " ") {
            return "";
          }

          // 删除 Element 的第一个文本子项的前导空格。
          if (index === 0) {
            str = str.trimStart();
          }
          // 删除 Element 的最后一个文本子项的尾随空格。
          if (index === tokensLen - 1) {
            str = str.trimEnd();
          }

          let segmentArr = str.split(" ");
          let fillDoc = [];
          // 奇数索引的元素必须是换行符
          segmentArr.forEach((segment, index) => {
            if (index === 0) {
              fillDoc.push(segment);
            } else {
              fillDoc.push(line);
              fillDoc.push(segment);
            }
          });

          // 组装
          return fill(fillDoc);
        }
        // JS 表达式（或“裸”对象表达式）
        else if (type === "expression") {
          // isNakedJSObject 检查属性，作为性能提升
          const forceNaked =
            isForceNakedJSObject && isAttribute && isNakedJSObject(str);

          // 换行\间距
          const spacing = options.wxmlBracketSpacing ? line : softline;

          // 组装 Doc
          return group([
            "{{ ",
            indent([
              spacing,
              forceNaked
                ? printNakedJSObject(str.trim(), textToDoc, options)
                : printJSExpression(str.trim(), textToDoc, options),
            ]),
            spacing,
            " }}",
          ]);
        } else {
          return text;
        }
      })
    );
  };
}

/**
 * js 表达式到 Doc
 * @param {*} text
 * @param {*} textToDoc
 * @param {*} options
 */
function printJSExpression(text, textToDoc, options) {
  if (!text) return text;
  let doc = text;
  let comments = "";
  let expr;

  try {
    expr = parser.parseExpression(text);
  } catch (error) {}
  if (!expr) return [doc];
  if (expr.type === "StringLiteral") {
    if (options.wxmlBracketSpacing) {
      return ` ${text.trim()} `;
    }
    return text.trim();
  }
  if (expr.leadingComments) {
    const leadingCommentsEnd =
      expr.leadingComments[expr.leadingComments.length - 1].end;
    // 也让评论更漂亮一点
    comments = text
      .slice(0, leadingCommentsEnd)
      .trim()
      .split("\n")
      .map((s) => [s.trim(), hardline]);
    // 删除前导注释，使删除前缀 semi 更容易
    text = text.slice(leadingCommentsEnd + 1).trimStart();
  }

  doc = textToDoc(text, {
    parser: "__js_expression",
    semi: false,
    trailingComma: "none",
    bracketSpacing: options.wxmlBracketSpacing,
  });

  if (comments) {
    doc = [comments, doc];
  }
  return doc;
}

// 裸 js 对象到 Doc
function printNakedJSObject(text, textToDoc, options) {
  if (!text) return text;
  const doc = printJSExpression(`{${text}}`, textToDoc, options);
  return doc;
}

// 基本上`{{}}`内的所有东西都可以是“裸”的JS对象..
// 判断 裸 js 对象
function isNakedJSObject(text) {
  let node;
  try {
    node = parser.parseExpression(`({${text}})`);
  } catch {}
  return node ? node.type === "ObjectExpression" : false;
}

module.exports = embed;
