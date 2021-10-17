const express = require('express');
const PORT = process.env.PORT || 3500;
const app = express();
const path = require('path');
const server = require('http').Server(app)
    .use(cors({
        'allowedHeaders': ['sessionId', 'Content-Type'],
        'exposedHeaders': ['sessionId'],
        'origin': '*',
        'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        'preflightContinue': false
    }))
    .use((req, res) => res.sendFile('/index.html', { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}));
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
    app.use(express.static(path.join(__dirname, 'build')));

    // app.get('*', function (req, res) {
    //     res.sendFile(path.join(__dirname, 'build', 'index.html'));
    // });
};

app.listen(PORT, () => {
    console.log(`Server listen on port ${PORT}`)
});

io.on('connection', (socket) => {
    console.log('open')
    socket.emit('chatHistory', chatHistory);

    socket.on('connectedUser', data => {
        socket.broadcast.emit('connectedUser', data)
    })

    socket.on('newMessage', (data) => {
        socket.broadcast.emit('newMessage', data);
        chatHistory.push(data)
    });

    socket.on('disconect', () => {
        console.log('close')
    })
});