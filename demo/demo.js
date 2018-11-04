const app = require('express')();
const demo = require('http').Server(app);
const io = require('socket.io')(demo);

demo.listen(8082);

io.on('connection', function (socket) {
    console.log('connection');

    socket.on('disconnect', function () {
        // stream.removeListener('data', pipeStream);
    });
    socket.on('image', function (data) {
        console.log("image", data);
        socket.emit('data', data);
    });
});
app.get('/', function (req, res) {
    console.log('location /')
    res.sendFile(__dirname + '/index.html');
});