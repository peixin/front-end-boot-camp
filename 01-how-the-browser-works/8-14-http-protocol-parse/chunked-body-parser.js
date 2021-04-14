module.exports = class ChunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;

    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.currentState = this.WAITING_LENGTH;
  }
  receiveChar(char) {
    if (this.currentState === this.WAITING_LENGTH) {
      if (char === "0") {
        this.isFinished = true;
      } else if (char === "\r") {
        this.currentState = this.WAITING_LENGTH_LINE_END;
      } else {
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
    } else if (this.currentState === this.WAITING_LENGTH_LINE_END) {
      if (char === "\n") {
        if (this.length) {
          this.currentState = this.READING_TRUNK;
        } else {
          this.currentState = this.WAITING_NEW_LINE;
        }
      }
    } else if (this.currentState === this.READING_TRUNK) {
      this.content.push(char);
      this.length--;
      if (this.length === 0) {
        this.currentState = this.WAITING_NEW_LINE;
      }
    } else if (this.currentState === this.WAITING_NEW_LINE) {
      if (char === "\r") {
        this.currentState = this.WAITING_NEW_LINE_END;
      }
    } else if (this.currentState === this.WAITING_NEW_LINE_END) {
      if (char === "\n") {
        this.currentState = this.WAITING_LENGTH;
      }
    }
  }
};
