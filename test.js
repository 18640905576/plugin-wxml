const { parsers, printers } = require("./index.js");
const { parseDOM } = require("htmlparser2");
const parser = require("angular-html-parser");
// import { Node } from "domhandler";
// const parse3 = require("wxml");

function parse1(text) {
  const dom = parseDOM(text, {
    xmlMode: true,
    withStartIndices: true,
    withEndIndices: true,
  });
  return dom;
}

// 'wxml-ast': { print: [Function: genericPrint], embed: [Function: embed] }
// console.log(parsers, printers);
// const parse = parsers["wxml"];
// const { print, embed } = printers["wxml-ast"];
const string =
  '<view class="address-container"><block wx:for="{{ fields}}" wx:key="key">999</block></view>';

let { rootNodes, errors } = parser.parse(string, {
  canSelfClose: true,
  // allowHtmComponentClosingTags: true,
  // isTagNameCaseSensitive: true,
  // getTagContentType: true,
});

console.log(rootNodes, 555)
console.log(parse1(string))


