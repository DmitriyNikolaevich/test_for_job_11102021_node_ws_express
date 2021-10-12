const express = require('express');
const app = express();
const port = process.env.PORT || 3500;
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

const routes = require('./settings/routes');
const chatHistory = [];
routes(app);

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
};

app.listen(port, () => {
    console.log(`Server listen on port ${port}`)
});

io.on('connection', (socket) => {

    socket.emit('chat history', chatHistory);

    socket.on('new user enter', (userName) => {
        socket.broadcast.emit('new user enter', {
          username: userName
        });
        socket.username = userName;
    });

    socket.on('typing', () => {
        socket.broadcast.emit('typing', {
          username: socket.username
        });
    });
    
    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing', {
          username: socket.username
        });
    });

    socket.on('new message', (data) => {
        socket.broadcast.emit('new message', {
          username: socket.username,
          message: data
        });
        chatHistory.push({
            username: socket.username,
            message: data
          })
    });

    socket.on('disconnect', (data) => {
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
          });
    });

});