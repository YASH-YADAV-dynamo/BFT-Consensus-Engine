const net = require('net');
const Block = require('./block');

class Node {
  constructor(port) {
    this.port = port;
    this.peers = [];
    this.blockchain = [this.createGenesisBlock()];
    this.pendingVotes = {};
  }

  createGenesisBlock() {
    return new Block(0, '0', 'Genesis Block');
  }

  proposeBlock(data) {
    const previousBlock = this.blockchain[this.blockchain.length - 1];
    const newBlock = new Block(previousBlock.index + 1, previousBlock.hash, data);
    this.pendingVotes[newBlock.hash] = { votes: 1, block: newBlock };
    this.broadcastVote(newBlock);
  }

  broadcastVote(block) {
    const vote = { type: 'VOTE', blockHash: block.hash };
    this.peers.forEach(peer => peer.write(JSON.stringify(vote)));
  }

  receiveVote(blockHash) {
    if (this.pendingVotes[blockHash]) {
      this.pendingVotes[blockHash].votes += 1;
      if (this.pendingVotes[blockHash].votes > (this.peers.length + 1) * 2 / 3) {
        this.blockchain.push(this.pendingVotes[blockHash].block);
        console.log('Consensus reached! Block added:', this.pendingVotes[blockHash].block);
        delete this.pendingVotes[blockHash];
      }
    }
  }

  connectToPeer(port) {
    const peer = net.connect(port, () => {
      this.peers.push(peer);
    });
    peer.on('data', data => {
      const message = JSON.parse(data);
      if (message.type === 'VOTE') {
        this.receiveVote(message.blockHash);
      }
    });
  }
}

module.exports = Node;