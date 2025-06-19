const net = require('net');
const readline = require('readline');
const Node = require('./node');

class BFTConsensusEngine {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    this.port = process.argv[2] || 6000;
    this.node = new Node(this.port);
    this.server = null;
    
    this.displayWelcome();
    this.setupServer();
    this.setupCLI();
  }

  displayWelcome() {
    console.log('\n🎯 ================================================');
    console.log('🎯 BFT CONSENSUS ENGINE - EDUCATIONAL TOOL');
    console.log('🎯 ================================================');
    console.log(`🎯 Running on port: ${this.port}`);
    console.log('🎯 Type "help" to see available commands');
    console.log('🎯 ================================================\n');
  }

  setupServer() {
    this.server = net.createServer(socket => {
      console.log(`🔌 New peer connected from ${socket.remoteAddress}:${socket.remotePort}`);
      this.node.peers.push(socket);
      this.node.updateConsensusThreshold();
      
      socket.on('data', data => {
        try {
          const message = JSON.parse(data);
          if (message.type === 'VOTE') {
            this.node.receiveVote(message.blockHash, message.voterNodeId);
          }
        } catch (error) {
          console.log(`❌ Error parsing message: ${error.message}`);
        }
      });

      socket.on('error', (error) => {
        console.log(`❌ Socket error: ${error.message}`);
      });

      socket.on('close', () => {
        console.log('🔌 Peer disconnected');
        this.node.peers = this.node.peers.filter(p => p !== socket);
        this.node.updateConsensusThreshold();
      });
    });

    this.server.listen(this.port, () => {
      console.log(`🌐 Server listening on port ${this.port}`);
      this.promptUser();
    });
  }

  setupCLI() {
    this.rl.on('line', (input) => {
      this.handleCommand(input.trim());
    });

    this.rl.on('close', () => {
      console.log('\n👋 Goodbye! BFT Engine shutting down...');
      process.exit(0);
    });
  }

  handleCommand(input) {
    const [command, ...args] = input.split(' ');
    
    switch (command.toLowerCase()) {
      case 'help':
        this.showHelp();
        break;
      
      case 'propose':
        if (args.length === 0) {
          console.log('❌ Please provide data for the block. Usage: propose <data>');
        } else {
          const data = args.join(' ');
          this.node.proposeBlock(data);
        }
        break;
      
      case 'connect':
        if (args.length === 0) {
          console.log('❌ Please provide a port to connect to. Usage: connect <port>');
        } else {
          const peerPort = parseInt(args[0]);
          if (isNaN(peerPort)) {
            console.log('❌ Invalid port number');
          } else if (peerPort === this.port) {
            console.log('❌ Cannot connect to yourself!');
          } else {
            this.node.connectToPeer(peerPort);
          }
        }
        break;
      
      case 'status':
        this.node.displayStatus();
        break;
      
      case 'blockchain':
      case 'chain':
        this.node.displayBlockchain();
        break;
      
      case 'validate':
        this.node.validateBlockchain();
        break;
      
      case 'explain':
        this.explainConcepts();
        break;
      
      case 'demo':
        this.showDemo();
        break;
      
      case 'clear':
        console.clear();
        this.displayWelcome();
        break;
      
      case 'exit':
      case 'quit':
        this.rl.close();
        break;
      
      default:
        if (input) {
          console.log(`❌ Unknown command: "${command}". Type "help" for available commands.`);
        }
        break;
    }
    
    this.promptUser();
  }

  showHelp() {
    console.log('\n📖 AVAILABLE COMMANDS:');
    console.log('   📝 propose <data>     - Propose a new block with given data');
    console.log('   🔗 connect <port>     - Connect to another node on specified port');
    console.log('   📊 status             - Show current node status');
    console.log('   ⛓️  blockchain (chain) - Display the current blockchain');
    console.log('   ✅ validate           - Validate the entire blockchain');
    console.log('   📚 explain            - Explain BFT concepts in detail');
    console.log('   🎬 demo               - Show demo scenario instructions');
    console.log('   🧹 clear              - Clear screen and show welcome');
    console.log('   ❓ help               - Show this help message');
    console.log('   🚪 exit (quit)        - Exit the application');
  }

  explainConcepts() {
    console.log('\n📚 DETAILED BFT CONSENSUS EXPLANATION:');
    console.log('\n🏛️  BYZANTINE FAULT TOLERANCE:');
    console.log('   • Named after the Byzantine Generals Problem');
    console.log('   • Handles nodes that may act maliciously or fail unpredictably');
    console.log('   • Requires >2/3 honest nodes to guarantee safety');
    console.log('   • Can tolerate up to 1/3 Byzantine (faulty) nodes');
    
    console.log('\n🔄 CONSENSUS PROCESS:');
    console.log('   1. PROPOSE: A node proposes a new block');
    console.log('   2. MINE: The block is "mined" (proof-of-work simulation)');
    console.log('   3. VOTE: Nodes vote on the proposed block');
    console.log('   4. DECIDE: If >2/3 votes received, block is added');
    
    console.log('\n🔒 SECURITY GUARANTEES:');
    console.log('   • Safety: No two honest nodes will accept conflicting blocks');
    console.log('   • Liveness: Progress will be made if >2/3 nodes are honest');
    console.log('   • Agreement: All honest nodes agree on the same blockchain');
    
    console.log('\n⚡ KEY FEATURES:');
    console.log('   • Immediate finality (no rollbacks)');
    console.log('   • Deterministic consensus');
    console.log('   • Network partition tolerance');
  }

  showDemo() {
    console.log('\n🎬 DEMO SCENARIOS:');
    console.log('\n🔰 SINGLE NODE DEMO:');
    console.log('   1. Start this node: node index.js 6001');
    console.log('   2. Propose a block: propose "Hello BFT World"');
    console.log('   3. View blockchain: blockchain');
    
    console.log('\n🌐 MULTI-NODE DEMO:');
    console.log('   Terminal 1: npm run node1  (or node index.js 6001)');
    console.log('   Terminal 2: npm run node2  (or node index.js 6002)');
    console.log('   Terminal 3: npm run node3  (or node index.js 6003)');
    console.log('   \n   In Terminal 2: connect 6001');
    console.log('   In Terminal 3: connect 6001');
    console.log('   In Terminal 1: propose "Multi-node consensus test"');
    console.log('   Watch consensus happen across all nodes!');
    
    console.log('\n🧪 EXPERIMENT IDEAS:');
    console.log('   • Test with different numbers of nodes');
    console.log('   • Disconnect nodes during consensus');
    console.log('   • Propose blocks from different nodes');
    console.log('   • Validate blockchain integrity');
  }

  promptUser() {
    this.rl.setPrompt(`${this.node.nodeId}> `);
    this.rl.prompt();
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Received SIGINT. Shutting down gracefully...');
  process.exit(0);
});

// Start the BFT Consensus Engine
new BFTConsensusEngine();