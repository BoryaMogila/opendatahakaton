const rtsp = require('rtsp-ffmpeg'),
      uri = 'rtsp://r3---sn-5hn7su7k.c.youtube.com/CiILENy73wIaGQkcfGRribM88BMYDSANFEgGUgZ2aWRlb3MM/0/0/0/video.3gp',
      stream = new rtsp.FFMpeg({input: uri});

stream.on('data', pipeStream);
socket.on('disconnect', function() {
stream.removeListener('data', pipeStream);
});