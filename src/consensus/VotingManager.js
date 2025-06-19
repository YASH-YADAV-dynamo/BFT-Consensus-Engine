/**
 * VotingManager Class - Handles voting and consensus logic
 * 
 * Features:
 * - Vote tracking and management
 * - Consensus threshold calculation
 * - Vote validation
 * - Educational voting process display
 */
class VotingManager {
  constructor(consensusThreshold = 0.67) {
    this.pendingVotes = {};
    this.consensusThreshold = consensusThreshold; // 2/3 majority
  }

  /**
   * Initialize voting for a new block
   * @param {Block} block - The block to vote on
   * @param {string} proposerNodeId - ID of the proposing node
   * @param {number} totalNodes - Total number of nodes in the network
   */
  initializeVoting(block, proposerNodeId, totalNodes) {
    const requiredVotes = Math.ceil(totalNodes * this.consensusThreshold);
    
    this.pendingVotes[block.hash] = {
      votes: 1, // Self-vote from proposer
      block: block,
      proposer: proposerNodeId,
      requiredVotes: requiredVotes,
      voters: [proposerNodeId] // Track who voted
    };

    console.log(`\n🗳️  CONSENSUS PHASE:`);
    console.log(`   Required votes: ${requiredVotes} out of ${totalNodes} nodes`);
    console.log(`   Current votes: 1 (self-vote)`);
    console.log(`   Consensus threshold: ${Math.round(this.consensusThreshold * 100)}%`);
  }

  /**
   * Process a received vote
   * @param {string} blockHash - Hash of the block being voted on
   * @param {string} voterNodeId - ID of the voting node
   * @returns {Object} Vote processing result
   */
  receiveVote(blockHash, voterNodeId) {
    if (!this.pendingVotes[blockHash]) {
      console.log(`⚠️  Received vote for unknown block: ${blockHash.substring(0, 16)}...`);
      return { success: false, reason: 'Unknown block' };
    }

    const votingData = this.pendingVotes[blockHash];
    
    // Check if this node already voted
    if (votingData.voters.includes(voterNodeId)) {
      console.log(`⚠️  Duplicate vote from ${voterNodeId} ignored`);
      return { success: false, reason: 'Duplicate vote' };
    }

    // Add the vote
    votingData.votes += 1;
    votingData.voters.push(voterNodeId);
    votingData.block.votes = votingData.votes;
    
    console.log(`\n🗳️  VOTE RECEIVED:`);
    console.log(`   From: ${voterNodeId || 'Unknown Node'}`);
    console.log(`   Block: ${blockHash.substring(0, 16)}...`);
    console.log(`   Current votes: ${votingData.votes}/${votingData.requiredVotes}`);
    console.log(`   Voters: ${votingData.voters.join(', ')}`);
    
    // Check if consensus is reached
    if (votingData.votes >= votingData.requiredVotes) {
      console.log(`   🚨 MAJORITY REACHED! Proceeding to consensus...`);
      return { 
        success: true, 
        consensusReached: true, 
        votingData: votingData 
      };
    } else {
      const remaining = votingData.requiredVotes - votingData.votes;
      console.log(`   📊 Need ${remaining} more vote${remaining > 1 ? 's' : ''} for consensus`);
      console.log(`   ⏳ Waiting for more nodes to vote...`);
      return { 
        success: true, 
        consensusReached: false, 
        votingData: votingData 
      };
    }
  }

  /**
   * Check if consensus has been reached for a block
   * @param {string} blockHash - Hash of the block
   * @returns {boolean} True if consensus reached
   */
  hasConsensus(blockHash) {
    const votingData = this.pendingVotes[blockHash];
    return votingData && votingData.votes >= votingData.requiredVotes;
  }

  /**
   * Get voting data for a block
   * @param {string} blockHash - Hash of the block
   * @returns {Object|null} Voting data or null if not found
   */
  getVotingData(blockHash) {
    return this.pendingVotes[blockHash] || null;
  }

  /**
   * Clean up voting data after consensus is reached
   * @param {string} blockHash - Hash of the block
   */
  clearVoting(blockHash) {
    delete this.pendingVotes[blockHash];
  }

  /**
   * Get all pending votes
   * @returns {Object} All pending voting data
   */
  getPendingVotes() {
    return this.pendingVotes;
  }

  /**
   * Update consensus threshold for network changes
   * @param {number} totalNodes - New total number of nodes
   */
  updateConsensusThreshold(totalNodes) {
    const requiredVotes = Math.ceil(totalNodes * this.consensusThreshold);
    console.log(`📊 Network updated: ${totalNodes} total nodes`);
    console.log(`   Consensus threshold: ${requiredVotes} votes required (${Math.round(this.consensusThreshold * 100)}%)`);
  }
}

module.exports = VotingManager; 