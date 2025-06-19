const net = require('net');

/**
 * NetworkManager Class - Handles peer-to-peer network connections
 * 
 * Features:
 * - Server management for incoming connections
 * - Peer connection management
 * - Message broadcasting
 * - Network status tracking
 */
class NetworkManager {
  constructor(port, messageHandler) {
    this.port = port;
    this.peers = [];
    this.server = null;
    this.messageHandler = messageHandler;
  }

  /**
   * Start the network server
   * @param {Function} onServerReady - Callback when server is ready
   */
  startServer(onServerReady) {
    this.server = net.createServer(socket => {
      console.log(`🔌 New peer connected from ${socket.remoteAddress}:${socket.remotePort}`);
      this.peers.push(socket);
      
      socket.on('data', data => {
        try {
          const message = JSON.parse(data);
          if (this.messageHandler) {
            this.messageHandler(message, socket);
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
        this.peers = this.peers.filter(p => p !== socket);
      });
    });

    this.server.listen(this.port, () => {
      console.log(`🌐 Server listening on port ${this.port}`);
      if (onServerReady) onServerReady();
    });
  }

  /**
   * Connect to a peer node
   * @param {number} peerPort - Port of the peer to connect to
   * @returns {Promise} Connection promise
   */
  connectToPeer(peerPort) {
    return new Promise((resolve, reject) => {
      const peer = net.connect(peerPort, () => {
        console.log(`🔗 Connected to peer on port ${peerPort}`);
        this.peers.push(peer);
        resolve(peer);
      });
      
      peer.on('data', data => {
        try {
          const message = JSON.parse(data);
          if (this.messageHandler) {
            this.messageHandler(message, peer);
          }
        } catch (error) {
          console.log(`❌ Error parsing message from peer: ${error.message}`);
        }
      });
      
      peer.on('error', (error) => {
        console.log(`❌ Peer connection error: ${error.message}`);
        reject(error);
      });
      
      peer.on('close', () => {
        console.log(`🔌 Peer on port ${peerPort} disconnected`);
        this.peers = this.peers.filter(p => p !== peer);
      });
    });
  }

  /**
   * Broadcast a message to all connected peers
   * @param {Object} message - Message to broadcast
   * @returns {number} Number of peers the message was sent to
   */
  broadcast(message) {
    const messageStr = JSON.stringify(message);
    let successCount = 0;
    
    console.log(`📡 Broadcasting message to ${this.peers.length} peers...`);
    
    this.peers.forEach((peer, index) => {
      try {
        peer.write(messageStr);
        console.log(`   ✓ Message sent to peer ${index + 1}`);
        successCount++;
      } catch (error) {
        console.log(`   ✗ Failed to send message to peer ${index + 1}: ${error.message}`);
      }
    });
    
    return successCount;
  }

  /**
   * Get the number of connected peers
   * @returns {number} Number of connected peers
   */
  getPeerCount() {
    return this.peers.length;
  }

  /**
   * Get total number of nodes in the network (including self)
   * @returns {number} Total nodes
   */
  getTotalNodes() {
    return this.peers.length + 1;
  }

  /**
   * Check if connected to any peers
   * @returns {boolean} True if connected to at least one peer
   */
  hasConnections() {
    return this.peers.length > 0;
  }

  /**
   * Display network status
   */
  displayStatus() {
    console.log(`\n🌐 NETWORK STATUS:`);
    console.log(`   Server port: ${this.port}`);
    console.log(`   Connected peers: ${this.peers.length}`);
    console.log(`   Total network nodes: ${this.getTotalNodes()}`);
    
    if (this.peers.length > 0) {
      console.log(`   🔗 Active connections:`);
      this.peers.forEach((peer, index) => {
        console.log(`      Peer ${index + 1}: ${peer.remoteAddress}:${peer.remotePort}`);
      });
    } else {
      console.log(`   📡 No peer connections (running in single-node mode)`);
    }
  }

  /**
   * Close all connections and stop the server
   */
  shutdown() {
    console.log(`🔌 Shutting down network...`);
    
    // Close all peer connections
    this.peers.forEach(peer => {
      try {
        peer.end();
      } catch (error) {
        console.log(`Warning: Error closing peer connection: ${error.message}`);
      }
    });
    
    // Close server
    if (this.server) {
      this.server.close(() => {
        console.log(`🌐 Server on port ${this.port} shut down`);
      });
    }
  }
}

module.exports = NetworkManager; 