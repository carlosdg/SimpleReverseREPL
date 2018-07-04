const net = require('net');
const readline = require('readline');

// Options for creating the reader interface
const READER_INTERFACE_OPTIONS = {
  input: process.stdin,
  output: process.stdout,
  terminal: true,
  prompt: '> ',
};

const serverSocket = net.createServer((socket) => {
  // Create a reader for user input from the terminal
  const reader = readline.createInterface(READER_INTERFACE_OPTIONS);

  // When the user inputs a command -> send it to the client
  reader.on('line', userInput => socket.write(userInput));

  // Let the user know that a connection has been established
  console.log(`New client connected ${JSON.stringify(socket.address(), null, '\t')}\n`);

  // Set the on close listener to log the close to the user and destroy the socket
  socket.on('close', () => {
    console.log(`Connection to client closed ${JSON.stringify(socket.address(), null, '\t')}\n`);
    if (!socket.destroyed) { socket.destroy(); }
  });

  // Set the on error listener to inform the user of any error
  socket.on('error', (error) => {
    console.error(`Error: ${error}\n\n ${JSON.stringify(socket.address(), null, '\t')}\n`);
    if (!socket.destroyed) { socket.destroy(); }
  });

  // Set the data listener to inform the user of the client responses
  socket.on('data', (data) => {
    console.log(String(data));
    reader.prompt();
  });

  socket.write('ls -la');
});

// Only deal with one connection at a time
serverSocket.maxConnections = 1;
serverSocket.listen(8080, () => console.log(`Server listening on port ${serverSocket.address().port}`));
