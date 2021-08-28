// const parseWxml = require("wxml");

// module.exports = parseWxml.parse;

// parse.ts

import { parseDocument } from "htmlparser2";

export default function parse(text) {
  const dom = parseDocument(text, {
    xmlMode: true,
    withStartIndices: true,
    withEndIndices: true,
  });
  return dom;
}
