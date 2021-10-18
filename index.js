const express = require('express');
const app = express();
const server = require('http').Server(app).listen(443);
const io = require('socket.io')(server);
const port = process.env.PORT || 3600;
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
routes(app);

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use(express.static(path.join(__dirname, 'client/build')));
};

app.listen(port, () => {
    console.log(`Server listen on port ${port}`)
});

io.on('connection', (socket) => {
    console.log('open');

    socket.on('connectedUser', data => {
        socket.broadcast.emit('connectedUser', data)
    })

    socket.on('newMessage', (data) => {
        socket.broadcast.emit('newMessage', data);
    });

    socket.on('disconect', () => {
        console.log('close')
    });
});