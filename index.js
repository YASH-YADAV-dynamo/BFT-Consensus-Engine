const readline = require('readline');
const BFTNode = require('./src/consensus/BFTNode');
const CommandHandler = require('./src/cli/CommandHandler');

class BFTConsensusEngine {
  constructor() {
    // Initialize CLI
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    // Get port from command line arguments
    this.port = parseInt(process.argv[2]) || 6000;
    
    // Initialize node and command handler
    this.node = new BFTNode(this.port);
    this.commandHandler = new CommandHandler(this.node);
    
    this.setupEventHandlers();
    this.start();
  }

  /**
   * Setup event handlers for CLI and graceful shutdown
   */
  setupEventHandlers() {
    // Handle CLI input
    this.rl.on('line', (input) => {
      const shouldContinue = this.commandHandler.handleCommand(input.trim());
      if (!shouldContinue) {
        this.shutdown();
        return;
      }
      this.promptUser();
    });

    // Handle CLI close
    this.rl.on('close', () => {
      this.shutdown();
    });

    // Handle graceful shutdown on SIGINT (Ctrl+C)
    process.on('SIGINT', () => {
      console.log('\n👋 Received SIGINT. Shutting down gracefully...');
      this.shutdown();
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('\n❌ Uncaught Exception:', error.message);
      this.shutdown();
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('\n❌ Unhandled Rejection:', reason);
      this.shutdown();
    });
  }

  /**
   * Start the BFT consensus engine
   */
  start() {
    this.commandHandler.displayWelcome();
    
    // Start the node
    this.node.start(() => {
      this.promptUser();
    });
  }

  /**
   * Display the command prompt
   */
  promptUser() {
    this.rl.setPrompt(`${this.node.nodeId}> `);
    this.rl.prompt();
  }

  /**
   * Gracefully shutdown the application
   */
  shutdown() {
    console.log('\n👋 Goodbye! BFT Engine shutting down...');
    
    // Close CLI
    if (this.rl) {
      this.rl.close();
    }
    
    // Shutdown node
    if (this.node) {
      this.node.shutdown();
    }
    
    // Exit process
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }
}

// Start the BFT Consensus Engine
console.log('🎯 Starting BFT Consensus Engine...');
new BFTConsensusEngine(); 