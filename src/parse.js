// const parser = require("angular-html-parser");

// module.exports = parser.parse;

// parse.ts

const { parseDocument } = require("htmlparser2");

function parse(text) {
  const dom = parseDocument(text, {
    xmlMode: true,
    withStartIndices: true,
    withEndIndices: true,
  });
  return dom;
}
module.exports = parse;
