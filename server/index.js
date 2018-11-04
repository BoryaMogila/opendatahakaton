const app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    rtsp = require('rtsp-ffmpeg');
server.listen(6147);
var uri = 'rtsp://Oleksii:eLtGk4Cb@31.42.173.15:8074/defaultPrimary?streamType=u',
    stream = new rtsp.FFMpeg({input: uri});
let img = undefined;
io.on('connection', function(socket) {
    var pipeStream = function(data) {
        img = data;
    };
    stream.on('data', pipeStream);
    setInterval(() => {
      if (img) {
        socket.emit('data', img.toString('base64'));
      }
    }, 5000);
    socket.on('disconnect', function() {
        stream.removeListener('data', pipeStream);
    });
});
app.get('/', function (req, res) {
    console.log('===)')
    res.sendFile(__dirname + '/index.html');
});

