const Block = require('./Block');

/**
 * Blockchain Class - Manages the chain of blocks
 * 
 * Features:
 * - Chain initialization with genesis block
 * - Block addition and validation
 * - Chain integrity validation
 * - Educational display methods
 */
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  /**
   * Create the first block in the blockchain
   * @returns {Block} The genesis block
   */
  createGenesisBlock() {
    const genesis = new Block(0, '0', 'Genesis Block - The First Block');
    console.log('🌱 Genesis block created!');
    genesis.displayInfo();
    return genesis;
  }

  /**
   * Get the latest block in the chain
   * @returns {Block} The last block in the chain
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Add a new block to the chain
   * @param {Block} block - The block to add
   * @returns {boolean} True if block was added successfully
   */
  addBlock(block) {
    const validation = block.isValid(this.getLatestBlock());
    if (validation.valid) {
      this.chain.push(block);
      console.log(`   ✅ Block added to blockchain (Total blocks: ${this.chain.length})`);
      return true;
    } else {
      console.log(`   ❌ Block validation failed: ${validation.reason}`);
      return false;
    }
  }

  /**
   * Display the entire blockchain
   */
  display() {
    console.log('\n⛓️  CURRENT BLOCKCHAIN:');
    this.chain.forEach((block, index) => {
      console.log(`   Block ${index}: ${block.hash.substring(0, 16)}... | Data: ${JSON.stringify(block.data)}`);
    });
    console.log(`   📏 Chain length: ${this.chain.length} blocks`);
  }

  /**
   * Validate the entire blockchain
   * @returns {boolean} True if the blockchain is valid
   */
  isChainValid() {
    console.log('\n🔍 VALIDATING BLOCKCHAIN:');
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      const validation = currentBlock.isValid(previousBlock);
      
      if (!validation.valid) {
        console.log(`❌ Block ${i} is invalid: ${validation.reason}`);
        return false;
      }
    }
    console.log('✅ Blockchain is valid!');
    return true;
  }

  /**
   * Get the length of the blockchain
   * @returns {number} Number of blocks in the chain
   */
  getLength() {
    return this.chain.length;
  }

  /**
   * Get a specific block by index
   * @param {number} index - The index of the block
   * @returns {Block|null} The block at the specified index or null
   */
  getBlock(index) {
    return this.chain[index] || null;
  }
}

module.exports = Blockchain; 