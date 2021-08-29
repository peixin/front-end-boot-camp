# Week 1
## How the browser works

### Finite State Machine
[Finite State Machine](https://en.wikipedia.org/wiki/Finite-state_machine)

#### 每一个状态都是一个机器
- 在每一个机器里，我们可以做计算、存储、输出......
- 所有的这些机器接受的输入是一致的
- 状态机的每一个机器本身没有状态，如果我们用函数来表示的话，它应

#### 该是纯函数(无副作用)
- 每一个机器知道下一个状态
- 每个机器都有确定的下一个状态(Moore)
- 每个机器根据输入决定下一个状态(Mealy)

### Toy Browser
Flow:


> URL ➡️ (HTTP) ➡️ HTML ➡️ (parse) ➡️ DOM ➡️ (css computing) ➡️ DOM with CSS ➡️ (layout) ➡️ DOM with position ➡️ (render) ➡️ Bitmap

#### HTTP Protocol

##### Request
```
POST / HTTP/1.1
Host: 127.0.0.1
Content-Type: application/x-www-form-urlencoded

foo=bar&code=1
```

Format:

```
request line
headers...
blank line
body...
```

Line break is: `\r\n`

##### Response 
```
HTTP/1.1 200 OK
Content-Type: text/plain
Foo: bar
Date: Sat, 24 Apr 2021 03:18:48 GMT
Connection: keep-alive\r\nTransfer-Encoding: chunked

14
<html>
.....
</html>
0

```

Format:
```
status line
headers...
blank line
body...
0

```

body chunked format:
```
hex chunk length
text....
0

```


Line break is: `\r\n`

#### Target:

> URL ➡️ (HTTP) ➡️ HTML


# Week 2

## Target
HTML ➡️ (parse) ➡️ DOM ➡️ (css computing) ➡️ DOM with CSS

[Last week](https://github.com/peixin/geektime-front-end-boot-camp/tree/master/01-how-the-browser-works) to see the past steps

---
### HTML ➡️ (parse) ➡️ DOM
- use finite state machine parse html tag
- use finite state machine process attribute
- build dom tree
- add text node to dom tree


### DOM ➡️ (css computing) ➡️ DOM with CSS
- use `css` lib parse style to css ast
- collection css rules
- compute css when start tag
- selector match node
- generate computed style
- css specificity



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
