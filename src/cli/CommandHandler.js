/**
 * CommandHandler Class - Handles CLI commands and user interactions
 * 
 * Features:
 * - Command parsing and execution
 * - Help system
 * - Educational explanations
 * - Demo scenarios
 */
class CommandHandler {
  constructor(node) {
    this.node = node;
  }

  /**
   * Handle a user command
   * @param {string} input - User input command
   */
  handleCommand(input) {
    const [command, ...args] = input.split(' ');
    
    switch (command.toLowerCase()) {
      case 'help':
        this.showHelp();
        break;
      
      case 'propose':
        this.handlePropose(args);
        break;
      
      case 'connect':
        this.handleConnect(args);
        break;
      
      case 'status':
        this.handleStatus();
        break;
      
      case 'blockchain':
      case 'chain':
        this.handleBlockchain();
        break;
      
      case 'validate':
        this.handleValidate();
        break;
      
      case 'explain':
        this.explainConcepts();
        break;
      
      case 'demo':
        this.showDemo();
        break;
      
      case 'network':
        this.handleNetwork();
        break;
      
      case 'clear':
        this.handleClear();
        break;
      
      case 'exit':
      case 'quit':
        return false; // Signal to exit
      
      default:
        if (input.trim()) {
          console.log(`❌ Unknown command: "${command}". Type "help" for available commands.`);
        }
        break;
    }
    
    return true; // Continue running
  }

  /**
   * Handle the propose command
   * @param {string[]} args - Command arguments
   */
  handlePropose(args) {
    if (args.length === 0) {
      console.log('❌ Please provide data for the block. Usage: propose <data>');
      console.log('   Example: propose "My first transaction"');
    } else {
      const data = args.join(' ');
      this.node.proposeBlock(data);
    }
  }

  /**
   * Handle the connect command
   * @param {string[]} args - Command arguments
   */
  handleConnect(args) {
    if (args.length === 0) {
      console.log('❌ Please provide a port to connect to. Usage: connect <port>');
      console.log('   Example: connect 6002');
    } else {
      const peerPort = parseInt(args[0]);
      if (isNaN(peerPort)) {
        console.log('❌ Invalid port number');
      } else if (peerPort === this.node.port) {
        console.log('❌ Cannot connect to yourself!');
      } else {
        this.node.connectToPeer(peerPort);
      }
    }
  }

  /**
   * Handle the status command
   */
  handleStatus() {
    this.node.displayStatus();
  }

  /**
   * Handle the blockchain command
   */
  handleBlockchain() {
    this.node.displayBlockchain();
  }

  /**
   * Handle the validate command
   */
  handleValidate() {
    this.node.validateBlockchain();
  }

  /**
   * Handle the network command
   */
  handleNetwork() {
    this.node.displayNetworkStatus();
  }

  /**
   * Handle the clear command
   */
  handleClear() {
    console.clear();
    this.displayWelcome();
  }

  /**
   * Display welcome message
   */
  displayWelcome() {
    console.log('\n🎯 ================================================');
    console.log('🎯 BFT CONSENSUS ENGINE - EDUCATIONAL TOOL');
    console.log('🎯 ================================================');
    console.log(`🎯 Running on port: ${this.node.port}`);
    console.log('🎯 Type "help" to see available commands');
    console.log('🎯 ================================================\n');
  }

  /**
   * Show help information
   */
  showHelp() {
    console.log('\n📖 AVAILABLE COMMANDS:');
    console.log('   📝 propose <data>     - Propose a new block with given data');
    console.log('   🔗 connect <port>     - Connect to another node on specified port');
    console.log('   📊 status             - Show current node status');
    console.log('   ⛓️  blockchain (chain) - Display the current blockchain');
    console.log('   🌐 network            - Show network connection status');
    console.log('   ✅ validate           - Validate the entire blockchain');
    console.log('   📚 explain            - Explain BFT concepts in detail');
    console.log('   🎬 demo               - Show demo scenario instructions');
    console.log('   🧹 clear              - Clear screen and show welcome');
    console.log('   ❓ help               - Show this help message');
    console.log('   🚪 exit (quit)        - Exit the application');
  }

  /**
   * Explain BFT concepts in detail
   */
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

  /**
   * Show demo scenarios
   */
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
    console.log('   • Use the "network" command to monitor connections');
  }
}

module.exports = CommandHandler; 