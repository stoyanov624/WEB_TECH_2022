const net = require('net');
const prompt = require('prompt-sync')({ sigint: true });
const PORT = 8080;
const HOST = '192.168.1.113';

const client = new net.Socket();
client.connect({ port: PORT, host: HOST });

client.on('data', serverData => {
    console.log('TCP connection established with the server.');
    console.log(serverData.toString());
    let command = prompt("Enter command: ");
    client.write(command);
});

client.on('end', function() {
    console.log('Requested an end to the TCP connection');
});
