const app = require('express')();
const demo = require('http').Server(app);
const io = require('socket.io')(demo);
const getPoints = require('../getPoints');
const {Image, createCanvas} = require('canvas');

demo.listen(8082);

let busy;

io.on('connection', function (socket) {
    console.log('connection');

    socket.on('disconnect', function () {
        // stream.removeListener('data', pipeStream);
    });
    socket.on('image', function (data) {
        busy = busy || getPoints(data, true)
            .then((points)=> {
                let img = new Image();
                img.src = data;
                const canvas = createCanvas(img.width,img.height);
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img,0,0);
                for(let keypoints of points ) {
                    keypoints.forEach(([x, y]) => {
                        ctx.beginPath();
                        ctx.arc(x, y, 5, 0, 2 * Math.PI);
                        ctx.fillStyle = 'red';
                        ctx.fill();
                    })
                }
                socket.emit('data', canvas.toDataURL('image/png'));
            })
            .catch(()=> {})
            .then(()=> { busy = undefined})

        return busy;
    });
});
app.get('/', function (req, res) {
    console.log('location /')
    res.sendFile(__dirname + '/index.html');
});