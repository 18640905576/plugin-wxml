const fs = require("fs");
const prettier = require("prettier");
const filePath = "./test/source.wxml";
const outputPath = "./test/output.wxml";
const plugin = require(".");

const text = fs.readFileSync(filePath, "utf8");

const formatted = prettier.format(text, {
  parser: "wxml",
  plugins: [plugin],
  trailingComma: "none",
  wxmlBracketSpacing: true,
});
fs.writeFileSync(outputPath, formatted);
console.log("格式化结果在 test/output.wxml 中");
