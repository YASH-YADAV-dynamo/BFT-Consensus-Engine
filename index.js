const net = require('net');
const readline = require('readline');
const Node = require('./node');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const port = process.argv[2] || 6000;
const node = new Node(port);

const server = net.createServer(socket => {
  node.peers.push(socket);
  socket.on('data', data => {
    const message = JSON.parse(data);
    if (message.type === 'VOTE') {
      node.receiveVote(message.blockHash);
    }
  });
});

server.listen(port, () => {
  console.log(`Node listening on port ${port}`);
  rl.on('line', input => {
    if (input.startsWith('propose ')) {
      const data = input.slice(8);
      node.proposeBlock(data);
      console.log('Block proposal initiated.');
    } else if (input.startsWith('connect ')) {
      const peerPort = input.slice(8);
      node.connectToPeer(peerPort);
      console.log(`Connected to peer on port ${peerPort}`);
    }
  });
});