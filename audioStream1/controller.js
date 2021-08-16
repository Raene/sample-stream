const fs = require(`fs`);
const Throttle = require(`throttle`);
const path = require(`path`);
const url = require('url');
const {readRangeHeader,streamFile} = require(`./helpers`)

async function serveStream(req, res) {
    const queryObject = url.parse(req.url,true).query;
    const filename = queryObject.file
    const filePath = path.join(__dirname, `music`, filename);
    const readable = fs.createReadStream(filePath);
    const stat = fs.statSync(filePath);

    if (!fs.existsSync(filePath)) {
        res.writeHead(404,"File does not exist");
        return null;
    }

    const rangeRequest = await readRangeHeader(req.headers[`range`], stat.size);
 
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


    await streamFile(res,start,end,stat,readable);
}

module.exports = {
    serveStream
}