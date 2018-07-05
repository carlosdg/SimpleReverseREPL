/**
 * Client that provides a Node REPL to the server
 *
 * @author Carlos Domínguez García
 */

const net = require('net');
const repl = require('repl');

// Port to connect to. Defaults to 8080
const PORT = process.env.PORT || 8080;

// Host to connect to. Defaults to localhost
const HOST = process.env.HOST || 'localhost';

// Create a TCP socket client
const socket = net.createConnection(PORT, HOST);

// Print any error on client console for debugging
socket.on('error', error => process.stderr.write(JSON.stringify(error, null, '\t')));

// Create a Node REPL instance and bind the input and output to the socket
repl.start({
  input: socket,
  output: socket,
});
