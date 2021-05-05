# Week 3

## Target
DOM with CSS ➡️ (layout) ➡️ DOM with position ➡️ (render) ➡️ Bitmap

[Last week](https://github.com/peixin/geektime-front-end-boot-camp/tree/master/02-how-the-browser-works) to see the past steps

---

### CSS Layout
- [Introduction to CSS layout](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Introduction)
  * Normal flow
  * Flex
  * Grid
  * CSS Houdini
## Flex Layout Basics
### Documents
- [MDN CSS Flexible Box Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)

- [MDN Flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox)

- [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

- [Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
- [Flex 布局教程：实例篇](https://www.ruanyifeng.com/blog/2015/07/flex-examples.html)

### Summary
- Main axis
- Cross axis

**flex-direction: row**

> Main: width, x, left, right 
> 
> Cross: height, y, top, bottom

**flex-direction: column**

> Main: height, y, top, bottom
>
> Cross: width, x, left, right

---

### Start layout, prepare flex property 
- layout when emit end tag
- style set default property

### Collect elements into "Line"
- calculate mainSpace, crossSpace element by element
- mainSpace can not contain element, then new line

### calculate main axis
> e.g. flexDirection is row
- if `itemStyle.flex` has value, calculate `width` (mainSize) from `mainSpace`
- else calculate based on `containerStyle.justifyContent`
- calculate `width`, `left`, `right`
  * single line
  * multiline

### calculate cross axis
> e.g. flexDirection is row
- calculate container `height`
- calculate item `height`, `top`, `bottom` from `alignContent` and (`alignSelf` or `alignItems`)

### draw single element
- use npm library `images`
- DIY every style property e.g. `background-color`

### draw DOM tree
- recurrence call render for dom's children
