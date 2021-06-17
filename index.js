const express = require('express');
const app = express();
const favicon = require('serve-favicon');
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 8000;
const users = {};

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static'));
app.use(express.urlencoded());

// SERVE FAVICON
app.use(favicon(path.join(__dirname, 'src', 'icon.ico')));

// ENDPOINTS
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/static/CSS/style.css', (req, res) => {
    res.sendFile(__dirname + "/" + "/static/CSS/style.css");
});

app.get('/static/JavaScript/client.js', (req, res) => {
    res.sendFile(__dirname + "/" + "/static/JavaScript/client.js");
});

app.get('/src/logo.svg', (req, res) => {
    res.sendFile(__dirname + "/" + "/src/logo.svg");
});

app.get('/src/send.svg', (req, res) => {
    res.sendFile(__dirname + "/" + "/src/send.svg");
});

app.get('/src/ting.mp3', (req, res) => {
    res.sendFile(__dirname + "/" + "/src/ting.mp3");
});

io.on('connection', socket =>{
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {name: users[socket.id], message: message});
    });

    // If someone leaves the chat, let others know 
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

// START THE SERVER
server.listen(port, ()=> {
    console.log(`The Application is running successfully on port ${port}`);
});