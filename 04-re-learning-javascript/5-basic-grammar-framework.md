InputElement ::= WhiteSpace | LineTerminator | Comment | Token

WhiteSpae ::= " "

LineTerminator ::= "\n" | "\r"

Comment ::= SingleLineComment | MultiLineComment
SingleLineComment :: = "//".*LineTerminator
MultiLineComment :: = "/*"([^\*] | *[^\/])*"*/"

Token ::= Literal | Keywords | Identifier | Punctuator
Literal ::= NumberLiteral | BooleanLiteral | StringLiteral | NullLiteral
Keywords ::= "if" | "else" | "for" | "function" ...
Punctuator ::= "+" | "-" | "*" | "/" | "{" | "}" | "(" | ")" | "=>" ... 


Program ::= Statement+ 
Statement ::= ExpressionStatement | IfStatement | ForStatement | WhileStatement 
              | VariableDeclaration | FunctionDeclaration | ClassDeclaration
              | BreakStatement | ContinueStatement | ReturnStatement | ThrowStatement
              | TryStatement | Block

ExpressionStatement ::= Expression ";"
Expression ::= MultiplicativeExpression | AdditiveExpression ("+" | "-") MultiplicativeExpression
MultiplicativeExpression ::= UnaryExpression | MultiplicativeExpression ("*" | "/") UnaryExpression
UnaryExpression ::= PrimaryExpression | ("+" | "-") PrimaryExpression

PrimaryExpression ::= "(" Expression ")" | Literal | Identifier

IfStatement ::= "if" "(" Expression ")" Statement
Block ::= "{" Statement "}"
