# Application of production in programming languages

## Chomsky hierarchy

> [乔姆斯基谱系](https://zh.wikipedia.org/wiki/%E4%B9%94%E5%A7%86%E6%96%AF%E5%9F%BA%E8%B0%B1%E7%B3%BB)：是计算机科学中刻画形式文法表达能力的一个分类谱系，是由诺姆·乔姆斯基于 1956 年提出的。它包括四个层次：
> 
> 0- 型文法（无限制文法或短语结构文法）包括所有的文法。
> 
> 1- 型文法（上下文相关文法）生成上下文相关语言。
> 
> 2- 型文法（上下文无关文法）生成上下文无关语言。
> 
> 3- 型文法（正规文法）生成正则语言。

#### III. Regular
> `<A> ::= <A>?`
* 左边只允许有一个非终结符
* 递归只允许左递归 

####  II. Context-free II
> `<A> ::= ?`

#### I. Context-sensitive I
> `?<A>¿ ::= ?<B>¿`

#### 0. Recursively enumerable 0
> `? ::= ?`


## Lexical & Syntax
### lexical:Regular Grammar (III)
- White Space
- Line Terminator
- Comment
- Token

### Syntax: Context-free (II)
- Syntax Tree


#### Grammar
+ 文法 grammar
  - 词法 lexical ➡️ Regular Grammar (III) ➡️ [lexer](https://en.wikipedia.org/wiki/Lexical_analysis)(lexical analysis) ➡️ token
  - 语法 syntax ➡️ Context-free (II) ➡️ [parsing](https://en.wikipedia.org/wiki/Parsing)(syntax analysis) ➡️ syntax tree


**非严谨场合 grammar ≈ syntax**



## `:)`
- [WhiteSpace](https://github.com/Romejanic/Whitespace)
- [BrainFuck](https://github.com/moky/BrainFuck)