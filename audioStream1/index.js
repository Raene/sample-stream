const fs = require(`fs`);
const Throttle = require(`throttle`);
const path = require(`path`);
const filename = `12-de_la_soul_feat_little_dragon-drawn-ade57ca6.mp3`;
const filePath = path.join(__dirname, `music`, filename);
const http = require(`http`);

var server = http.createServer(function(req, res) {
    const readable = fs.createReadStream(filePath);
    const stat = fs.statSync(filePath);
    const rangeRequest = readRangeHeader(req.headers[`range`], stat.size);
    // const throttle = new Throttle(320000 / 8);
    //const t = readable.pipe(throttle);
 
    // If 'Range' header exists, we will parse it with Regular Expression.
    if (rangeRequest == null) {
        res.setHeader(`Content-Type`, `audio/mp3`);
        res.setHeader(`Content-Length`, stat.size);  // File size.
        res.setHeader(`Accept-Ranges`, `bytes`);

        readable.pipe(res);
        return null;
    }

    const start = rangeRequest.Start;
    const end = rangeRequest.End;
    // If the range can't be fulfilled.
    if (start >= stat.size || end >= stat.size) {
        // Indicate the acceptable range.
        res.setHeader(`Content-Range`, `bytes */${stat.size}`);

        // Return the 416 'Requested Range Not Satisfiable'.
        res.writeHead(416);
        return null;
    }

    res.setHeader(`Content-Type`, `audio/mp3`);
    res.setHeader(`Content-Length`, stat.size);
    res.setHeader(`Content-Range`, `bytes ${start}-${end}/${stat.size}`);
    res.setHeader(`Accept-Ranges`, `bytes`);
    res.setHeader(`Cache-Control`, `no-cache`);
    readable.pipe(res);

    // t.on('data', (chunk)=>{
    //     res.write(chunk);
    //     res.writeHead(206, responseHeaders);
    // });

    // t.on('error', (err) => {
    //     console.error(err);
    //     res.end();
    //   });

    // t.on('end', () => {
    //     res.end();
    //   });

});


function readRangeHeader(range, totalLength) {
    /*
     * Example of the method 'split' with regular expression.
     * 
     * Input: bytes=100-200
     * Output: [null, 100, 200, null]
     * 
     * Input: bytes=-200
     * Output: [null, null, 200, null]
     */

if (range == null || range.length == 0)
    return null;

var array = range.split(/bytes=([0-9]*)-([0-9]*)/);
var start = parseInt(array[1]);
var end = parseInt(array[2]);
var result = {
    Start: isNaN(start) ? 0 : start,
    End: isNaN(end) ? (totalLength - 1) : end
};

if (!isNaN(start) && isNaN(end)) {
    result.Start = start;
    result.End = totalLength - 1;
}

if (isNaN(start) && !isNaN(end)) {
    result.Start = totalLength - end;
    result.End = totalLength - 1;
}

return result;
}
server.listen(8000);