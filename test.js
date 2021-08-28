const fs = require("fs");
const prettier = require("prettier");
const filePath = "./test/source.wxml";
const plugin = require(".");

const text = fs.readFileSync(filePath, "utf8");
console.log(text);

const formatted = prettier.format(text, {
  parser: "wxml",
  plugins: [plugin],
  trailingComma: "none",
  // axmlBracketSpacing: true,
});
console.log(formatted);
