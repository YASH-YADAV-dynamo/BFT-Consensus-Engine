const Block = require('../blockchain/Block');
const Blockchain = require('../blockchain/Blockchain');
const VotingManager = require('./VotingManager');
const NetworkManager = require('../network/NetworkManager');

/**
 * BFTNode Class - Main node implementation for BFT consensus
 * 
 * Features:
 * - Block proposal and mining
 * - BFT consensus voting
 * - Network communication
 * - Educational explanations
 */
class BFTNode {
  constructor(port) {
    this.port = port;
    this.nodeId = `Node-${port}`;
    this.status = 'IDLE';
    this.miningDifficulty = 2;
    
    // Initialize components
    this.blockchain = new Blockchain();
    this.votingManager = new VotingManager(0.67); // 2/3 majority
    this.networkManager = new NetworkManager(port, this.handleMessage.bind(this));
    
    console.log(`🚀 Initializing ${this.nodeId}...`);
    this.explainBFT();
  }

  /**
   * Start the node
   * @param {Function} onReady - Callback when node is ready
   */
  start(onReady) {
    this.networkManager.startServer(() => {
      if (onReady) onReady();
    });
  }

  /**
   * Explain BFT concepts
   */
  explainBFT() {
    console.log('\n📚 BYZANTINE FAULT TOLERANCE (BFT) EXPLANATION:');
    console.log('   BFT consensus allows a network to reach agreement even when some nodes are faulty or malicious.');
    console.log('   This implementation requires 2/3 majority votes to add a block to the blockchain.');
    console.log('   This ensures safety as long as less than 1/3 of nodes are Byzantine (faulty).');
    console.log('   Learn more: https://en.wikipedia.org/wiki/Byzantine_fault');
  }

  /**
   * Propose a new block
   * @param {*} data - Data to include in the block
   */
  proposeBlock(data) {
    console.log(`\n🔄 ${this.nodeId} PROPOSING NEW BLOCK:`);
    console.log(`   Data: "${data}"`);
    
    this.status = 'PROPOSING';
    const previousBlock = this.blockchain.getLatestBlock();
    const newBlock = new Block(previousBlock.index + 1, previousBlock.hash, data);
    
    // Simulate mining
    console.log('\n⛏️  MINING PHASE:');
    newBlock.mineBlock(this.miningDifficulty);
    
    // Initialize voting
    const totalNodes = this.networkManager.getTotalNodes();
    this.votingManager.initializeVoting(newBlock, this.nodeId, totalNodes);
    
    // Broadcast vote to peers
    this.broadcastVote(newBlock);
    newBlock.displayInfo();
  }

  /**
   * Broadcast a vote for a block
   * @param {Block} block - The block to vote for
   */
  broadcastVote(block) {
    const vote = { 
      type: 'VOTE', 
      blockHash: block.hash, 
      voterNodeId: this.nodeId,
      blockIndex: block.index
    };
    
    const sentCount = this.networkManager.broadcast(vote);
    console.log(`📡 Vote broadcast complete (sent to ${sentCount} peers)`);
  }

  /**
   * Handle incoming network messages
   * @param {Object} message - The received message
   * @param {Object} socket - The socket that sent the message
   */
  handleMessage(message, socket) {
    if (message.type === 'VOTE') {
      const result = this.votingManager.receiveVote(message.blockHash, message.voterNodeId);
      
      if (result.success && result.consensusReached) {
        this.reachConsensus(message.blockHash, result.votingData);
      }
    }
  }

  /**
   * Handle consensus being reached for a block
   * @param {string} blockHash - Hash of the block
   * @param {Object} votingData - Voting data
   */
  reachConsensus(blockHash, votingData) {
    const block = votingData.block;
    
    console.log(`\n🎉 CONSENSUS REACHED!`);
    console.log(`   Block ${block.index} has been accepted by the network!`);
    console.log(`   Final votes: ${votingData.votes}/${this.networkManager.getTotalNodes()}`);
    
    // Add block to blockchain
    const success = this.blockchain.addBlock(block);
    if (success) {
      // Enhanced success message
      console.log(`\n🏆 SUCCESS! NEW BLOCK OFFICIALLY ADDED TO BLOCKCHAIN!`);
      console.log(`   📊 Block Index: ${block.index}`);
      console.log(`   🔗 Block Hash: ${block.hash}`);
      console.log(`   📝 Block Data: ${JSON.stringify(block.data)}`);
      console.log(`   🗳️  Consensus Votes: ${votingData.votes} out of ${this.networkManager.getTotalNodes()} nodes`);
      console.log(`   ⏰ Added at: ${new Date().toLocaleString()}`);
      console.log(`   📈 Blockchain Length: ${this.blockchain.getLength()} blocks`);
      console.log(`\n🎊 All connected nodes now have this block in their blockchain!`);
      
      block.displayInfo();
      this.blockchain.display();
    }
    
    this.votingManager.clearVoting(blockHash);
    this.status = 'IDLE';
  }

  /**
   * Connect to a peer node
   * @param {number} peerPort - Port of the peer to connect to
   */
  async connectToPeer(peerPort) {
    try {
      await this.networkManager.connectToPeer(peerPort);
      this.votingManager.updateConsensusThreshold(this.networkManager.getTotalNodes());
    } catch (error) {
      console.log(`❌ Failed to connect to peer on port ${peerPort}: ${error.message}`);
    }
  }

  /**
   * Display node status
   */
  displayStatus() {
    console.log(`\n📊 ${this.nodeId} STATUS:`);
    console.log(`   Status: ${this.status}`);
    console.log(`   Blockchain length: ${this.blockchain.getLength()}`);
    
    const pendingVotes = this.votingManager.getPendingVotes();
    console.log(`   Pending votes: ${Object.keys(pendingVotes).length}`);
    
    if (Object.keys(pendingVotes).length > 0) {
      console.log('   📋 Pending consensus:');
      Object.entries(pendingVotes).forEach(([hash, data]) => {
        console.log(`      Block ${data.block.index}: ${data.votes}/${data.requiredVotes} votes`);
      });
    }
  }

  /**
   * Display network status
   */
  displayNetworkStatus() {
    this.networkManager.displayStatus();
  }

  /**
   * Display the blockchain
   */
  displayBlockchain() {
    this.blockchain.display();
  }

  /**
   * Validate the blockchain
   */
  validateBlockchain() {
    return this.blockchain.isChainValid();
  }

  /**
   * Shutdown the node
   */
  shutdown() {
    console.log(`\n👋 Shutting down ${this.nodeId}...`);
    this.networkManager.shutdown();
  }
}

module.exports = BFTNode; 