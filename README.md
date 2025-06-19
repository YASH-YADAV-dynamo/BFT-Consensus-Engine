# 🎯 BFT Consensus Engine

An interactive educational tool to learn and understand Byzantine Fault Tolerant (BFT) consensus algorithms in distributed systems and blockchain networks.

## 🌟 Features

- **Interactive CLI Interface**: User-friendly command-line interface with help system
- **Educational Output**: Detailed explanations of each step in the consensus process
- **Mining Simulation**: Proof-of-work mining simulation with visual feedback
- **Multi-Node Support**: Connect multiple nodes to form a distributed network
- **Real-Time Consensus**: Watch BFT consensus happen in real-time across nodes
- **Blockchain Validation**: Built-in blockchain integrity validation
- **Visual Status Tracking**: Colorful emojis and clear status messages

## 🏛️ What is Byzantine Fault Tolerance?

Byzantine Fault Tolerance (BFT) is a property of distributed systems that allows them to reach consensus even when some nodes are faulty, malicious, or unreliable. Named after the Byzantine Generals Problem, BFT consensus ensures:

- **Safety**: No two honest nodes will accept conflicting blocks
- **Liveness**: Progress will be made if more than 2/3 of nodes are honest
- **Agreement**: All honest nodes agree on the same blockchain state

### 🔄 Consensus Process

1. **PROPOSE**: A node proposes a new block with data
2. **MINE**: The block undergoes proof-of-work mining (simulated)
3. **VOTE**: All connected nodes vote on the proposed block
4. **DECIDE**: If ≥2/3 majority votes are received, the block is added to the blockchain

## 🚀 Getting Started

### Prerequisites

- Node.js (v12 or higher)
- npm

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Quick Start

#### Single Node Demo
```bash
# Or specify a port
node index.js 6000
```

Then use these commands:
```
propose "Hello BFT World"
blockchain
status
```

#### Multi-Node Network Demo

**Terminal 1 (Node 1):**
```bash
npm run node1
# or: node index.js 6001
```

**Terminal 2 (Node 2):**
```bash
npm run node2
# or: node index.js 6002
```

**Terminal 3 (Node 3):**
```bash
npm run node3
# or: node index.js 6003
```

**Connect the nodes:**
In Terminal 2: `connect 6001`
In Terminal 3: `connect 6001`

**Test consensus:**
In Terminal 1: `propose "Multi-node consensus test"`

Watch the consensus process happen across all terminals! 🎉

## 📖 Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `help` | Show all available commands | `help` |
| `propose <data>` | Propose a new block with data | `propose "My transaction"` |
| `connect <port>` | Connect to another node | `connect 6002` |
| `status` | Show current node status | `status` |
| `blockchain` | Display the blockchain | `blockchain` |
| `validate` | Validate blockchain integrity | `validate` |
| `explain` | Detailed BFT explanation | `explain` |
| `demo` | Show demo scenarios | `demo` |
| `clear` | Clear screen | `clear` |
| `exit` | Exit the application | `exit` |

## 🧪 Educational Experiments

### Experiment 1: Consensus with Different Network Sizes
- Try with 2, 3, 4, or 5 nodes
- Observe how consensus threshold changes
- Note: With 2 nodes, both must agree (100% consensus needed)

### Experiment 2: Network Partitions
- Start 3 nodes, connect them all
- Disconnect one node during consensus
- Observe how the remaining 2 nodes still reach consensus

### Experiment 3: Concurrent Proposals
- Have multiple nodes propose blocks simultaneously
- See how the network handles competing proposals
- Only one block will achieve consensus based on timing and votes

### Experiment 4: Blockchain Validation
- Create several blocks in sequence
- Use the `validate` command to check blockchain integrity
- Try manually modifying a block and see validation fail

## 🔧 Technical Details

### Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Node 6001     │    │   Node 6002     │    │   Node 6003     │
│                 │◄──►│                 │◄──►│                 │
│  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │
│  │Blockchain │  │    │  │Blockchain │  │    │  │Blockchain │  │
│  └───────────┘  │    │  └───────────┘  │    │  └───────────┘  │
│  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │
│  │Consensus  │  │    │  │Consensus  │  │    │  │Consensus  │  │
│  │Engine     │  │    │  │Engine     │  │    │  │Engine     │  │
│  └───────────┘  │    │  └───────────┘  │    │  └───────────┘  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Components

- **Block**: Represents a block in the blockchain with hash, data, and metadata
- **Node**: Manages consensus, networking, and blockchain state
- **BFTConsensusEngine**: Main CLI interface and server management

### Consensus Algorithm

This implementation uses a simplified BFT consensus:

1. **Proposal Phase**: Any node can propose a block
2. **Mining Phase**: Simulated proof-of-work (configurable difficulty)
3. **Voting Phase**: All nodes vote on the proposed block
4. **Decision Phase**: Block is accepted if it receives ≥⌈2n/3⌉ votes where n is total nodes

### Network Protocol

Simple JSON message protocol over TCP:
```json
{
  "type": "VOTE",
  "blockHash": "abc123...",
  "voterNodeId": "Node-6001",
  "blockIndex": 1
}
```

## 🎓 Learning Objectives

After using this tool, you should understand:

- How Byzantine Fault Tolerance works in distributed systems
- Why 2/3 majority is required for BFT consensus
- The role of mining/proof-of-work in blockchain systems
- How nodes communicate and vote in a distributed network
- Blockchain validation and integrity checking
- The challenges of achieving consensus in distributed systems

## 🔍 Understanding the Output

### Mining Output
```
🔨 Mining block 1...
📊 Target: Hash must start with 00
⚡ Mining attempt 10000: a7f3d2e1...
✅ Block mined! Nonce: 15847, Hash: 00a7f3d2...
```

### Consensus Output
```
🗳️  CONSENSUS PHASE:
   Required votes: 2 out of 3 nodes
   Current votes: 1 (self-vote)
📡 Broadcasting vote for block 1 to 2 peers...

🗳️  VOTE RECEIVED:
   From: Node-6002
   Block: 00a7f3d2e1b5c8f9...
   Current votes: 2/2

🎉 CONSENSUS REACHED!
   Block 1 has been accepted by the network!
   Final votes: 2/3
```

## 🤝 Contributing

This is an educational tool! Feel free to:

- Add new features or consensus algorithms
- Improve the educational explanations
- Add visualization features
- Enhance the CLI interface
- Add more comprehensive examples