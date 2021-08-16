const { parsers, printers } = require("./index.js");
const htmlParser = require("./parse.js");
const { parseDOM } = require("htmlparser2");
// import { Node } from "domhandler";

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
const parse = parsers["wxml"];
const { print, embed } = printers["wxml-ast"];
const string =
  '<view class="address-container"><block wx:for="{{ fields}}" wx:key="key">999</block></view>';
console.log(htmlParser.parse("666"));
console.log("<-------parse------->");
// console.log(parse.parse(string));
// console.log("<-------parse1------->");
// console.log(parse1(string));
