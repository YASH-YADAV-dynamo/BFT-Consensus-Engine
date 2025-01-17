const crypto = require('crypto');

class Block {
  constructor(index, previousHash, data, timestamp = Date.now()) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto.createHash('sha256').update(
      this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)
    ).digest('hex');
  }
}

module.exports = Block;