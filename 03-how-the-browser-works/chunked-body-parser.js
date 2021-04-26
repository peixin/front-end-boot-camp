module.exports = class ChunkedBodyParser {
  constructor() {
    this.length = 0;
    this.content = [];
    this.currentState = this.waitingLength;
  }

  receiveChar(char) {
    this.currentState = this.currentState(char);
  }

  get isFinished() {
    return this.currentState === this.finished;
  }

  waitingLength(char) {
    if (char === "0") {
      return this.finished;
    } else if (char === "\r") {
      return this.WaitingLengthLineEnd;
    } else {
      this.length *= 16;
      this.length += parseInt(char, 16);
      return this.waitingLength;
    }
  }

  WaitingLengthLineEnd(char) {
    if (char === "\n") {
      if (this.length) {
        return this.readingTrunk;
      } else {
        return this.waitingNewLine;
      }
    }
    return this.WaitingLengthLineEnd;
  }

  readingTrunk(char) {
    this.content.push(char);
    this.length--;
    if (this.length === 0) {
      return this.waitingNewLine;
    }
    return this.readingTrunk;
  }

  waitingNewLine(char) {
    if (char === "\r") {
      return this.waitingNewLineEnd;
    }
    return this.waitingNewLine;
  }

  waitingNewLineEnd(char) {
    if (char === "\n") {
      return this.waitingLength;
    }
    return this.waitingNewLineEnd;
  }

  finished() {
    return this.finished;
  }
};
