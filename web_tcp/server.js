const PORT = 8080;
const COMMANDS = {
    DATE_KEYWORD: "date",
    HELP_KEYWORD: "help",
    BYE_KEYWORD: "bye",
    CLIENTS_KEYWORD: "clients"
}
const net = require("net");
let clientsCount = 0;

const executeCommand = (socket, clientCommand) => {
    if (!clientCommand.toLocaleLowerCase().trim().localeCompare(COMMANDS.DATE_KEYWORD)) {
        socket.write(`The date is: ${new Date()}\n`);
    } else if (!clientCommand.toLocaleLowerCase().trim().localeCompare(COMMANDS.HELP_KEYWORD)) {
        socket.write(`This is a small tcp server that understands few commands like: "help", "date", "bye", "clients"\n`);
    } else if (!clientCommand.toLocaleLowerCase().trim().localeCompare(COMMANDS.BYE_KEYWORD)) {
        socket.end();
    } else if (!clientCommand.toLocaleLowerCase().trim().localeCompare(COMMANDS.CLIENTS_KEYWORD)) {
        socket.write(`Total count of connected clients: ${clientsCount}\n`);
    } else {
        socket.write(`ERROR! INVALID COMMAND! Type "help" to learn the commands!\n`);
    }
}

const TCP_SERVER = net.createServer(socket => {
    socket.write(`Hello, there! Client ${++clientsCount}\n`);
    socket.on("data", clientData => {
        const clientCommand = clientData.toString();
        executeCommand(socket, clientCommand);
    })

    socket.on("end", () => {
        console.log(`Closing connection with client ${clientsCount}`)
    })

    socket.on('error', () => {
        socket.end();
    })
})

const CONNECTION = TCP_SERVER.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}...`);
});

