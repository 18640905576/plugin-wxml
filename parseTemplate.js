/**
 * A parser parses mustache style templates(`text{{expression}}`) but without
 * mustache's syntatic tags(`{{!comments}}`, `{{#sectionBegin}}`, `{{/sectionEnd}}` etc),
 * 'cause we only need to disguise things outside `{{}}` and inside.
 */
import { TemplateTokens } from "./types";

// TODO: 多层{{{}}}有问题
const openingTagRe = /\{\{/;
const closingTagRe = /\}\}/;
// Credit: https://github.com/janl/mustache.js/blob/master/mustache.js
function parseTemplate(template) {
  if (!template) return [];
  const scanner = new Scanner(template);
  const tokens = []; // Buffer to hold the tokens
  let start, value;
  while (!scanner.eos()) {
    start = scanner.pos;
    // Match any text between tags.
    value = scanner.scanUntil(openingTagRe);
    if (value) {
      tokens.push(["text", value, start, start + value.length]);
      start += value.length;
    }
    // Match the opening tag.
    if (!scanner.scan(openingTagRe)) break;
    // Get the tag value.
    value = scanner.scanUntil(closingTagRe);
    // Match the closing tag.
    if (!scanner.scan(closingTagRe))
      throw new Error("Unclosed tag at " + scanner.pos);
    tokens.push(["expression", value, start, scanner.pos]);
  }
  return tokens;
}

// Credit: https://github.com/janl/mustache.js/blob/master/mustache.js
class Scanner {
  pos;
  string;
  tail;
  constructor(str) {
    this.string = str;
    this.tail = str;
    this.pos = 0;
  }
  eos() {
    return this.tail === "";
  }
  scan(reg) {
    const match = this.tail.match(reg);
    if (!match || match.index !== 0) return "";
    const string = match[0];
    this.tail = this.tail.substring(string.length);
    this.pos += string.length;
    return string;
  }
  scanUntil(reg) {
    const index = this.tail.search(reg);
    let match;
    switch (index) {
      case -1:
        match = this.tail;
        this.tail = "";
        break;
      case 0:
        match = "";
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }
    this.pos += match.length;
    return match;
  }
}

export default parseTemplate;
