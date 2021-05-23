import { scan } from "./lexer-parser.js";
/**
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
 */

const syntax = {
  Program: [["StatementList", "EOF"]],
  StatementList: [["Statement"], ["StatementList", "Statement"]],
  Statement: [
    ["ExpressionStatement"],
    ["IfStatement"],
    ["VariableDeclaration"],
    ["FunctionDeclaration"],
    // ["Block"],
  ],
  ExpressionStatement: [["Expression", ";"]],
  Expression: [["AdditiveExpression"]],
  AdditiveExpression: [["MultiplicativeExpression"], ["AdditiveExpression"]],
  AdditiveExpression: [
    ["MultiplicativeExpression"],
    ["AdditiveExpression", "+", "MultiplicativeExpression"],
    ["AdditiveExpression", "-", "MultiplicativeExpression"],
  ],
  MultiplicativeExpression: [
    ["PrimaryExpression"],
    ["MultiplicativeExpression", "*", "PrimaryExpression"],
    ["MultiplicativeExpression", "/", "PrimaryExpression"],
  ],
  PrimaryExpression: [["(", "Expression", ")"], ["Literal"], ["Identifier"]],
  IfStatement: [["if", "(", "Expression", ")", "Statement"]],
  // Block: [["{", "StatementList", "}"]],
  VariableDeclaration: [
    ["const", "Identifier", ";"],
    ["let", "Identifier", ";"],
    ["var", "Identifier", ";"],
  ],
  FunctionDeclaration: [
    ["function", "Identifier", "(", ")", "{", "StatementList", "}"],
  ],
  Literal: [["Number"]],
};

const hash = {};

function closure(state) {
  hash[JSON.stringify(state)] = state;
  const queue = [];

  for (let symbol in state) {
    if (symbol.match(/^\$/)) {
      return;
    }
    queue.push(symbol);
  }

  while (queue.length) {
    const symbol = queue.shift();

    if (syntax[symbol]) {
      for (let rule of syntax[symbol]) {
        // console.log(rule[0]);
        if (!state[rule[0]]) {
          queue.push(rule[0]);
        }

        let current = state;
        for (let part of rule) {
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
        current.$reduceType = symbol;
        current.$reduceLength = rule.length;
      }
    }
  }

  for (let symbol in state) {
    // console.log(symbol, state[symbol]);
    if (symbol.match(/^\$/)) {
      continue;
    }
    if (hash[JSON.stringify(state[symbol])]) {
      state[symbol] = hash[JSON.stringify(state[symbol])];
    } else {
      closure(state[symbol]);
    }
  }
}

const end = { $isEnd: true };
const start = { Program: end };

closure(start);
// console.log(JSON.stringify(start, null, 2));

function parse(source) {
  const stack = [start];

  function reduce() {
    const state = stack[stack.length - 1];

    if (state.$reduceType) {
      const children = [];

      for (let i = 0; i < state.$reduceLength; i++) {
        children.push(stack.pop());
      }

      // create a non-terminal symbol and shift it
      shift({
        type: stack.$reduceType,
        children: children.reverse(),
      });
    }
  }

  function shift(symbol) {
    const state = stack[stack.length - 1];

    if (symbol.type in state) {
      stack.push(symbol);
    } else {
      // reduce to no-terminal symbols
      reduce();
      shift(symbol);
    }
  }

  for (let symbol of scan(source)) {
    // terminal symbols
    shift(symbol);
  }
}

const source = `
  var a;
`;
parse(source);
