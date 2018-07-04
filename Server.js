const net = require('net');
const readline = require('readline');

const SERVER_PORT = process.env.PORT || 8080;

const serverSocket = net.createServer((socketToClient) => {
  // Information about the client. Used in information messages
  const clientInfo = JSON.stringify(socketToClient.address(), null, '\t');

  // Create a reader for user input from the terminal
  const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
    prompt: '',
  });

  // Let the user know that a connection has been established
  process.stdout.write(`New client connected ${clientInfo}\n`);

  // Now setting listeners...
  // When the user inputs a command -> send it to the client
  reader.on('line', userInput => socketToClient.write(`${userInput}\n`));

  // Set the on close listener to log the close to the user and destroy the socket
  socketToClient.on('close', () => {
    process.stdout.write(`Connection to client closed ${clientInfo}\n`);
    if (!socketToClient.destroyed) { socketToClient.destroy(); }
    reader.close();
  });

  // Set the on error listener to inform the user of any error
  socketToClient.on('error', (error) => {
    process.stderr.write(`Error: ${error}\n\n ${clientInfo}\n`);
    if (!socketToClient.destroyed) { socketToClient.destroy(); }
    reader.close();
  });

  // Set the data listener to inform the user of the client responses
  socketToClient.on('data', data => process.stdout.write(String(data)));
});

// Only deal with one connection at a time
serverSocket.maxConnections = 1;

serverSocket.listen(SERVER_PORT, () => console.log(`Server listening on port ${serverSocket.address().port}`));
