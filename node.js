const net = require('net');
const Block = require('./block');

class Node {
  constructor(port) {
    this.port = port;
    this.nodeId = `Node-${port}`;
    this.peers = [];
    this.blockchain = [this.createGenesisBlock()];
    this.pendingVotes = {};
    this.status = 'IDLE';
    this.consensusThreshold = 0.67; // 2/3 majority
    this.miningDifficulty = 2;
    
    console.log(`🚀 Initializing ${this.nodeId}...`);
    this.explainBFT();
  }

  createGenesisBlock() {
    const genesis = new Block(0, '0', 'Genesis Block - The First Block');
    console.log('🌱 Genesis block created!');
    genesis.displayInfo();
    return genesis;
  }

  explainBFT() {
    console.log('\n📚 BYZANTINE FAULT TOLERANCE (BFT) EXPLANATION:');
    console.log('   BFT consensus allows a network to reach agreement even when some nodes are faulty or malicious.');
    console.log('   This implementation requires 2/3 majority votes to add a block to the blockchain.');
    console.log('   This ensures safety as long as less than 1/3 of nodes are Byzantine (faulty).');
    console.log('   Learn more: https://en.wikipedia.org/wiki/Byzantine_fault');
  }

  proposeBlock(data) {
    console.log(`\n🔄 ${this.nodeId} PROPOSING NEW BLOCK:`);
    console.log(`   Data: "${data}"`);
    
    this.status = 'PROPOSING';
    const previousBlock = this.blockchain[this.blockchain.length - 1];
    const newBlock = new Block(previousBlock.index + 1, previousBlock.hash, data);
    
    // Simulate mining
    console.log('\n⛏️  MINING PHASE:');
    newBlock.mineBlock(this.miningDifficulty);
    
    // Initialize voting
    this.pendingVotes[newBlock.hash] = { 
      votes: 1, 
      block: newBlock, 
      proposer: this.nodeId,
      requiredVotes: Math.ceil((this.peers.length + 1) * this.consensusThreshold)
    };
    
    console.log(`\n🗳️  CONSENSUS PHASE:`);
    console.log(`   Required votes: ${this.pendingVotes[newBlock.hash].requiredVotes} out of ${this.peers.length + 1} nodes`);
    console.log(`   Current votes: 1 (self-vote)`);
    
    this.broadcastVote(newBlock);
    newBlock.displayInfo();
  }

  broadcastVote(block) {
    const vote = { 
      type: 'VOTE', 
      blockHash: block.hash, 
      voterNodeId: this.nodeId,
      blockIndex: block.index
    };
    
    console.log(`📡 Broadcasting vote for block ${block.index} to ${this.peers.length} peers...`);
    
    this.peers.forEach((peer, index) => {
      try {
        peer.write(JSON.stringify(vote));
        console.log(`   ✓ Vote sent to peer ${index + 1}`);
      } catch (error) {
        console.log(`   ✗ Failed to send vote to peer ${index + 1}: ${error.message}`);
      }
    });
  }

  receiveVote(blockHash, voterNodeId) {
    if (!this.pendingVotes[blockHash]) {
      console.log(`⚠️  Received vote for unknown block: ${blockHash.substring(0, 16)}...`);
      return;
    }

    const votingData = this.pendingVotes[blockHash];
    votingData.votes += 1;
    votingData.block.votes = votingData.votes;
    
    console.log(`\n🗳️  VOTE RECEIVED:`);
    console.log(`   From: ${voterNodeId || 'Unknown Node'}`);
    console.log(`   Block: ${blockHash.substring(0, 16)}...`);
    console.log(`   Current votes: ${votingData.votes}/${votingData.requiredVotes}`);
    
    // Check if consensus is reached
    if (votingData.votes >= votingData.requiredVotes) {
      console.log(`   🚨 MAJORITY REACHED! Proceeding to consensus...`);
      this.reachConsensus(blockHash);
    } else {
      const remaining = votingData.requiredVotes - votingData.votes;
      console.log(`   📊 Need ${remaining} more vote${remaining > 1 ? 's' : ''} for consensus`);
      console.log(`   ⏳ Waiting for more nodes to vote...`);
    }
  }

  reachConsensus(blockHash) {
    const votingData = this.pendingVotes[blockHash];
    const block = votingData.block;
    
    console.log(`\n🎉 CONSENSUS REACHED!`);
    console.log(`   Block ${block.index} has been accepted by the network!`);
    console.log(`   Final votes: ${votingData.votes}/${this.peers.length + 1}`);
    
    // Validate block before adding
    const validation = block.isValid(this.blockchain[this.blockchain.length - 1]);
    if (validation.valid) {
      this.blockchain.push(block);
      console.log(`   ✅ Block added to blockchain (Total blocks: ${this.blockchain.length})`);
      
      // Enhanced success message
      console.log(`\n🏆 SUCCESS! NEW BLOCK OFFICIALLY ADDED TO BLOCKCHAIN!`);
      console.log(`   📊 Block Index: ${block.index}`);
      console.log(`   🔗 Block Hash: ${block.hash}`);
      console.log(`   📝 Block Data: ${JSON.stringify(block.data)}`);
      console.log(`   🗳️  Consensus Votes: ${votingData.votes} out of ${this.peers.length + 1} nodes`);
      console.log(`   ⏰ Added at: ${new Date().toLocaleString()}`);
      console.log(`   📈 Blockchain Length: ${this.blockchain.length} blocks`);
      console.log(`\n🎊 All connected nodes now have this block in their blockchain!`);
      
      block.displayInfo();
      this.displayBlockchain();
    } else {
      console.log(`   ❌ Block validation failed: ${validation.reason}`);
    }
    
    delete this.pendingVotes[blockHash];
    this.status = 'IDLE';
  }

  connectToPeer(port) {
    const peer = net.connect(port, () => {
      console.log(`🔗 Connected to peer on port ${port}`);
      this.peers.push(peer);
      this.updateConsensusThreshold();
    });
    
    peer.on('data', data => {
      try {
        const message = JSON.parse(data);
        if (message.type === 'VOTE') {
          this.receiveVote(message.blockHash, message.voterNodeId);
        }
      } catch (error) {
        console.log(`❌ Error parsing message from peer: ${error.message}`);
      }
    });
    
    peer.on('error', (error) => {
      console.log(`❌ Peer connection error: ${error.message}`);
    });
    
    peer.on('close', () => {
      console.log(`🔌 Peer on port ${port} disconnected`);
      this.peers = this.peers.filter(p => p !== peer);
      this.updateConsensusThreshold();
    });
  }

  updateConsensusThreshold() {
    const totalNodes = this.peers.length + 1;
    console.log(`📊 Network updated: ${totalNodes} total nodes`);
    console.log(`   Consensus threshold: ${Math.ceil(totalNodes * this.consensusThreshold)} votes required`);
  }

  displayBlockchain() {
    console.log('\n⛓️  CURRENT BLOCKCHAIN:');
    this.blockchain.forEach((block, index) => {
      console.log(`   Block ${index}: ${block.hash.substring(0, 16)}... | Data: ${JSON.stringify(block.data)}`);
    });
    console.log(`   📏 Chain length: ${this.blockchain.length} blocks`);
  }

  displayStatus() {
    console.log(`\n📊 ${this.nodeId} STATUS:`);
    console.log(`   Status: ${this.status}`);
    console.log(`   Connected peers: ${this.peers.length}`);
    console.log(`   Blockchain length: ${this.blockchain.length}`);
    console.log(`   Pending votes: ${Object.keys(this.pendingVotes).length}`);
    
    if (Object.keys(this.pendingVotes).length > 0) {
      console.log('   📋 Pending consensus:');
      Object.entries(this.pendingVotes).forEach(([hash, data]) => {
        console.log(`      Block ${data.block.index}: ${data.votes}/${data.requiredVotes} votes`);
      });
    }
  }

  validateBlockchain() {
    console.log('\n🔍 VALIDATING BLOCKCHAIN:');
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const previousBlock = this.blockchain[i - 1];
      const validation = currentBlock.isValid(previousBlock);
      
      if (!validation.valid) {
        console.log(`❌ Block ${i} is invalid: ${validation.reason}`);
        return false;
      }
    }
    console.log('✅ Blockchain is valid!');
    return true;
  }
}

module.exports = Node;