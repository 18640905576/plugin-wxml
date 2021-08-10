// index.ts
// index.ts

import {
  SupportLanguage,
  Parser,
  Printer,
  SupportOption,
  ParserOptions,
} from "prettier";
import parse from "./parse";

// prettier 指定 `node` 参数为 any，因为不同 parser 返回的 node 类型不尽相同
function locStart(node: any): number {
  return node.startIndex;
}

function locEnd(node: any): number {
  return node.endIndex;
}

// 支持的语言列表
export const languages: Partial<SupportLanguage>[] = [
  {
    name: "wxml",
    parsers: ["wxml"], // (a.1)
    extensions: [".wxml"], // (a.2)
  },
];

export const parsers: Record<string, Parser> = {
  // 注意此处的 key 必须要与 languages 的 parsers 对应
  axml: {
    parse, // (b.1)
    locStart,
    locEnd,
    // 为 ast 格式命个名，后面会用到
    astFormat: "wxml-ast",
  },
};

// 核心的格式化逻辑
export const printers: Record<string, Printer>;

// 可选，插件的自定义配置项，此处 PluginOptions 需自行定义
// export const options: Record<keyof PluginOptions, SupportOption>;

// 可选，默认配置项
// export const defaultOptions: Partial<ParserOptions>;
