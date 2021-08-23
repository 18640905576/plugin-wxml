const { parsers, printers } = require("./index.js");
const { parseDOM } = require("htmlparser2");
var WXMLParser = require("@leejim/wxml-parser");
// import { Node } from "domhandler";
const parse3 = require("wxml");

function parse1(text) {
  const dom = parseDOM(text, {
    xmlMode: true,
    withStartIndices: true,
    withEndIndices: true,
  });
  return dom;
}

var parser2 = new WXMLParser({
  onopentag(tagname, attrs) {},
  onclosetag(tagname) {},
  ontext(text) {},
  oncomment(cmt) {},
  ontemplate(tmp) {},
});

// 'wxml-ast': { print: [Function: genericPrint], embed: [Function: embed] }
// console.log(parsers, printers);
const parse = parsers["wxml"];
const { print, embed } = printers["wxml-ast"];
const string =
  '<view class="address-container"><block wx:for="{{ fields}}" wx:key="key">999</block></view>';
