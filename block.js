const crypto = require('crypto');

class Block {
  constructor(index, previousHash, data, timestamp = Date.now()) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.nonce = 0; // For mining simulation
    this.hash = this.calculateHash();
    this.votes = 0; // Track votes received
  }

  calculateHash() {
    return crypto.createHash('sha256').update(
      this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce
    ).digest('hex');
  }

  // Simulate mining process for educational purposes
  mineBlock(difficulty = 2) {
    const target = Array(difficulty + 1).join('0');
    
    console.log(`🔨 Mining block ${this.index}...`);
    console.log(`📊 Target: Hash must start with ${target}`);
    
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
      
      // Show mining progress every 10000 attempts
      if (this.nonce % 10000 === 0) {
        console.log(`⚡ Mining attempt ${this.nonce}: ${this.hash}`);
      }
    }

    console.log(`✅ Block mined! Nonce: ${this.nonce}, Hash: ${this.hash}`);
    return this.hash;
  }

  // Educational method to display block information
  displayInfo() {
    console.log('\n📦 BLOCK INFORMATION:');
    console.log(`   Index: ${this.index}`);
    console.log(`   Previous Hash: ${this.previousHash}`);
    console.log(`   Timestamp: ${new Date(this.timestamp).toLocaleString()}`);
    console.log(`   Data: ${JSON.stringify(this.data)}`);
    console.log(`   Nonce: ${this.nonce}`);
    console.log(`   Hash: ${this.hash}`);
    console.log(`   Votes: ${this.votes}`);
  }

  // Validate block structure
  isValid(previousBlock) {
    if (this.hash !== this.calculateHash()) {
      return { valid: false, reason: 'Hash is invalid' };
    }
    
    if (previousBlock && this.previousHash !== previousBlock.hash) {
      return { valid: false, reason: 'Previous hash does not match' };
    }
    
    if (previousBlock && this.index !== previousBlock.index + 1) {
      return { valid: false, reason: 'Index is not sequential' };
    }
    
    return { valid: true, reason: 'Block is valid' };
  }
}

module.exports = Block;