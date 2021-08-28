// const printer = require("./print.js");
// const { parsers } = require("prettier/parser-html");
// const parse = require("./parse.js");
// const embed = require("./embed.js");

// const htmlParser = parsers.html;

// function locStart(node) {
//   return node.startIndex;
// }

// function locEnd(node) {
//   return node.endIndex;
// }

// // 支持的语言列表
// const languages = [
//   {
//     name: "wxml",
//     parsers: ["wxml"], // (a.1)
//     extensions: [".wxml"], // (a.2)
//   },
// ];

// const wxmlParsers = {
//   // 注意此处的 key 必须要与 languages 的 parsers 对应
//   wxml: {
//     ...htmlParser, // 默认使用prettier的html解析器，在此基础上做修改
//     locStart,
//     locEnd,

//     astFormat: "wxml-ast", // 为 ast 格式命个名，后面会用到
//     parse, // wxml的解析
//   },
// };

// // 核心的格式化逻辑
// const printers = {
//   "wxml-ast": {
//     print, // 目标语言源代码本身的格式化逻辑
//     embed, // 内嵌的其他语言的格式化
//   },
// };

// // 可选，插件的自定义配置项，此处 PluginOptions 需自行定义
// // export const options: Record<keyof PluginOptions, SupportOption>;

// // 可选，默认配置项
// // export const defaultOptions: Partial<ParserOptions>;

// module.exports = {
//   languages,
//   printers,
//   parsers: wxmlParsers,
// };
const prettier = require("prettier");
const embed = require("./embed");
const parse = require("./parse");
const print = require("./print");

function locStart(node) {
  return node.startIndex;
}

function locEnd(node) {
  return node.endIndex;
}

const options = {
  wxmlBracketSameLine: {
    name: "wxmlBracketSameLine",
    category: "Global",
    type: "boolean",
    default: false,
    description: "Put the `>` of a multiline AXML element on a new line",
    since: "1.0.0",
  },
  wxmlBracketSpacing: {
    name: "wxmlBracketSpacing",
    category: "Global",
    type: "boolean",
    default: false,
    description: "Print spaces between brackets(`{{}}`) in AXML expressions",
    since: "1.0.0",
  },
};

// We're going to be using the bracketSameLine option, but since it wasn't
// introduced until prettier 2.4.0, we need to add it to our list of options if
// it's not present so that it gets respected.
if (
  !prettier
    .getSupportInfo()
    .options.some((opt) => opt.name === "bracketSameLine")
) {
  options.bracketSameLine = {
    type: "boolean",
    category: "Global",
    default: false,
    description:
      "Put > of opening tags on the last line instead of on a new line.",
    since: "1.0.0",
  };
}

const plugin = {
  // options,
  languages: [
    {
      name: "wxml",
      parsers: ["wxml"],
      extensions: [".wxml"],
      vscodeLanguageIds: ["xml", "wxml"],
    },
  ],
  parsers: {
    wxml: {
      parse,
      locStart,
      locEnd,
      astFormat: "wxml-ast",
    },
  },
  printers: {
    "wxml-ast": {
      print,
      embed,
    },
  },
};

module.exports = plugin;
