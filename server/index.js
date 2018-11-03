const app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    rtsp = require('rtsp-ffmpeg');
server.listen(6147);
var uri = 'rtsp://Oleksii:eLtGk4Cb@31.42.173.15:8074/defaultPrimary?streamType=u',
    stream = new rtsp.FFMpeg({input: uri});
io.on('connection', function(socket) {
    var pipeStream = function(data) {
        socket.emit('data', data.toString('base64'));
    };
    stream.on('data', pipeStream);
    socket.on('disconnect', function() {
        stream.removeListener('data', pipeStream);
    });
});
app.get('/', function (req, res) {
    console.log('===)')
    res.sendFile(__dirname + '/index.html');
});