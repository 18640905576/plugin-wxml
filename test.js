const { parsers, printers } = require("./index.js");
const htmlParser = require("./parse.js");

// 'wxml-ast': { print: [Function: genericPrint], embed: [Function: embed] }
// console.log(parsers, printers);
const parse = parsers["wxml"];
const { print, embed } = printers["wxml-ast"];

console.log(htmlParser);
