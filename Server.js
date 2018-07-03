const net = require('net')
const readline = require('readline')

// Options for creating the reader interface
const READER_INTERFACE_OPTIONS = {
    input: process.stdin,
    output: process.stdout,
    terminal: true,
    prompt: '> '
}

const serverSocket = net.createServer(socket => {
    // Create a reader for user input from the terminal
    const reader = readline.createInterface(READER_INTERFACE_OPTIONS)
    
    // When the user inputs a command -> send it to the client
    reader.on('line', userInput => socket.write(userInput))
    
    // Let the user know that a connection has been established
    reader.write(`New client connected ${socket.address()}`)

    // Set the on close listener to log the close to the user and destroy the socket
    socket.on('close', () => {
        reader.write(`Connection to client closed ${socket.address()}`)
        if (!socket.destroyed) { socket.destroy() }
    })

    // Set the on error listener to inform the user of any error
    socket.on('error', error => {
        reader.write(`Error: ${error}\n\n ${socket.address()}`)
        if (!socket.destroyed) { socket.destroy() }
    })

    // Set the data listener to inform the user of the client responses
    socket.on('data', data => {
        reader.write(String(data))
        reader.prompt()
    })
})

// Only deal with one connection at a time
serverSocket.maxConnections = 1
serverSocket.listen(8080, () => console.log(`Server listening on port ${serverSocket.address().port}`))