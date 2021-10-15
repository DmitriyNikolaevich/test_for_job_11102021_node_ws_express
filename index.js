const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app).listen(443);
const io = require('socket.io')(server);
const port = process.env.PORT || 3500;
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

const routes = require('./settings/routes');
const chatHistory = [
    {
        message: 'message',
        userName: 'User 1'
    },
    {
        message: 'message',
        userName: 'User 2'
    },
    {
        message: 'message',
        userName: 'User 3'
    }
];
routes(app);

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
};

app.listen(port, () => {
    console.log(`Server listen on port ${port}`)
});

io.on('connection', (socket) => {
    console.log(`WS start`)

    socket.emit('chatHistory', chatHistory);

    socket.on('newMessage', (data) => {
        socket.broadcast.emit('newMessage', data);
        chatHistory.push(data)
    });

    socket.on('disconnect', (data) => {
        console.log(`WS stop`)
    });

});