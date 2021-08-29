# prettier-plugin-wxml

prettier 插件，提供微信小程序 wxml 文件的格式化能力

## 环境搭建

> npm install --save-dev prettier prettier-plugin-wxml

## 使用示例

> ./node_modules/.bin/prettier --write '\*_/_.wxml'

## 效果展示

### input

```html
<view
  bindtap="onClick"
  catchtap="onCatchClick"
  class="cart-container"
  wx:if="true"
  style="height: 100vh"
/>
```

### output

```html
<view
  wx:if="true"
  class="cart-container"
  style="height: 100vh"
  bindtap="onClick"
  catchtap="onCatchClick"
/>
```

## 联系作者

[github](https://github.com/18640905576)
