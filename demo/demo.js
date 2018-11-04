const app = require('express')(),
    demo = require('http').Server(app),
    io = require('socket.io')(demo),
    rtsp = require('rtsp-ffmpeg');
demo.listen(8082);

io.on('connection', function(socket) {
    console.log('connection');

    // socket.on("st", function(blob) {
    //     console.log("st", blob);
    //     var uri = blob,
    //     stream = new rtsp.FFMpeg({input: uri});
    //     stream.on('data', pipeStream);
    // });
    //
    // var pipeStream = function(data) {
    //     console.log('stream');
    //     socket.emit('data', data);
    // };
    // stream.on('data', pipeStream);
    socket.on('disconnect', function() {
        // stream.removeListener('data', pipeStream);
    });
    //
    socket.on('image',  function(data) {
        console.log("image", data);
        socket.emit('data', data);
    });
});
app.get('/', function (req, res) {
    console.log('location /')
    res.sendFile(__dirname + '/index.html');
});