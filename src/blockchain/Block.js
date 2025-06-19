const crypto = require('crypto');

/**
 * Block Class - Represents a single block in the blockchain
 * 
 * Features:
 * - Hash calculation with SHA-256
 * - Mining simulation with proof-of-work
 * - Block validation
 * - Educational display methods
 */
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

  /**
   * Calculate SHA-256 hash of the block
   * @returns {string} The calculated hash
   */
  calculateHash() {
    return crypto.createHash('sha256').update(
      this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce
    ).digest('hex');
  }

  /**
   * Simulate mining process with proof-of-work
   * @param {number} difficulty - Mining difficulty (number of leading zeros)
   * @returns {string} The mined hash
   */
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

  /**
   * Display detailed block information for educational purposes
   */
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

  /**
   * Validate block structure and integrity
   * @param {Block} previousBlock - The previous block in the chain
   * @returns {Object} Validation result with valid boolean and reason
   */
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