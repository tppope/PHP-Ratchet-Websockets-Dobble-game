const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');

const server = https.createServer({
    cert: fs.readFileSync( "/etc/letsencrypt/live/wt122.fei.stuba.sk/fullchain.pem"),
    key: fs.readFileSync('/etc/letsencrypt/live/wt122.fei.stuba.sk/privkey.pem')
})

server.listen(9000)
const wss = new WebSocket.Server({server});
let pictures = [
["image087", "image018", "image082", "image078", "image074", "image106", "image009", "image039"],
["image087", "image002", "image066", "image090", "image055", "image064", "image030", "image059"],
["image087", "image034", "image062", "image049", "image021", "image029", "image073", "image015"],
["image087", "image043", "image031", "image027", "image068", "image047", "image007", "image013"],
["image087", "image012", "image023", "image008", "image022", "image017", "image028", "image035"],
["image087", "image024", "image093", "image048", "image016", "image033", "image036", "image040"],
["image087", "image045", "image019", "image001", "image044", "image099", "image072", "image051"],
["image087", "image070", "image038", "image085", "image004", "image084", "image020", "image088"],
["image018", "image002", "image034", "image043", "image012", "image024", "image045", "image070"],
["image018", "image066", "image062", "image031", "image023", "image093", "image019", "image038"],
["image018", "image090", "image049", "image027", "image008", "image048", "image001", "image085"],
["image018", "image055", "image021", "image068", "image022", "image016", "image044", "image004"],
["image018", "image064", "image029", "image047", "image017", "image033", "image099", "image084"],
["image018", "image030", "image073", "image007", "image028", "image036", "image072", "image020"],
["image018", "image059", "image015", "image013", "image035", "image040", "image051", "image088"],
["image082", "image002", "image062", "image027", "image022", "image033", "image072", "image088"],
["image082", "image066", "image049", "image068", "image017", "image036", "image051", "image070"],
["image082", "image090", "image021", "image047", "image028", "image040", "image045", "image038"],
["image082", "image055", "image029", "image007", "image035", "image024", "image019", "image085"],
["image082", "image064", "image073", "image013", "image012", "image093", "image001", "image004"],
["image082", "image030", "image015", "image043", "image023", "image048", "image044", "image084"],
["image082", "image059", "image034", "image031", "image008", "image016", "image099", "image020"],
["image078", "image002", "image049", "image047", "image035", "image093", "image044", "image020"],
["image078", "image066", "image021", "image007", "image012", "image048", "image099", "image088"],
["image078", "image090", "image029", "image013", "image023", "image016", "image072", "image070"],
["image078", "image055", "image073", "image043", "image008", "image033", "image051", "image038"],
["image078", "image064", "image015", "image031", "image022", "image036", "image045", "image085"],
["image078", "image030", "image034", "image027", "image017", "image040", "image019", "image004"],
["image078", "image059", "image062", "image068", "image028", "image024", "image001", "image084"],
["image074", "image002", "image021", "image013", "image008", "image036", "image019", "image084"],
["image074", "image066", "image029", "image043", "image022", "image040", "image001", "image020"],
["image074", "image090", "image073", "image031", "image017", "image024", "image044", "image088"],
["image074", "image055", "image015", "image027", "image028", "image093", "image099", "image070"],
["image074", "image064", "image034", "image068", "image035", "image048", "image072", "image038"],
["image074", "image030", "image062", "image047", "image012", "image016", "image051", "image085"],
["image074", "image059", "image049", "image007", "image023", "image033", "image045", "image004"],
["image106", "image002", "image029", "image031", "image028", "image048", "image051", "image004"],
["image106", "image066", "image073", "image027", "image035", "image016", "image045", "image084"],
["image106", "image090", "image015", "image068", "image012", "image033", "image019", "image020"],
["image106", "image055", "image034", "image047", "image023", "image036", "image001", "image088"],
["image106", "image064", "image062", "image007", "image008", "image040", "image044", "image070"],
["image106", "image030", "image049", "image013", "image022", "image024", "image099", "image038"],
["image106", "image059", "image021", "image043", "image017", "image093", "image072", "image085"],
["image009", "image002", "image073", "image068", "image023", "image040", "image099", "image085"],
["image009", "image066", "image015", "image047", "image008", "image024", "image072", "image004"],
["image009", "image090", "image034", "image007", "image022", "image093", "image051", "image084"],
["image009", "image055", "image062", "image013", "image017", "image048", "image045", "image020"],
["image009", "image064", "image049", "image043", "image028", "image016", "image019", "image088"],
["image009", "image030", "image021", "image031", "image035", "image033", "image001", "image070"],
["image009", "image059", "image029", "image027", "image012", "image036", "image044", "image038"],
["image039", "image002", "image015", "image007", "image017", "image016", "image001", "image038"],
["image039", "image066", "image034", "image013", "image028", "image033", "image044", "image085"],
["image039", "image090", "image062", "image043", "image035", "image036", "image099", "image004"],
["image039", "image055", "image049", "image031", "image012", "image040", "image072", "image084"],
["image039", "image064", "image021", "image027", "image023", "image024", "image051", "image020"],
["image039", "image030", "image029", "image068", "image008", "image093", "image045", "image088"],
["image039", "image059", "image073", "image047", "image022", "image048", "image019", "image070"] ];


wss.on('connection', (socket, req) => {
    console.log('Connection from', req.connection.remoteAddress);
    socket.on('message', (message) => {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

console.log('The capitalization server is running...');
