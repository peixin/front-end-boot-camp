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