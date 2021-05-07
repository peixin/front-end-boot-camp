
# Defining JavaScript lexical and syntax with production

```
InputElement ::= WhiteSpace | LineTerminator | Comment | Token

WhiteSpace ::= " " | "　" | <NBSP> | <ZWNBSP> | <USP> ...
LineTerminator ::= "\n" | "\r" ...

Comment ::= SingleLineComment | MultiLineComment
SingleLineComment ::= "//" {<any>}
MultiLineComment ::= "/*" {[^*] | *[^/]} "*/"

Token ::= Literal | Keywords | Identifier | Punctuator

Literal ::= NumberLiteral | BooleanLiteral | StringLiteral | NullLiteral
KeyWords ::= "if" | "else" | "for" | "function" ...
Punctuator ::= "+" | "-" | "*" | "/" | "{" | "}" | "(" | ")" | "=>" ... 

Identifier ::= IdentifierStart | Identifier IdentifierPart
IdentifierStart ::= "$" | "_" | UnicodeIDStart
IdentifierPart ::= UnicodeIDContinue
```