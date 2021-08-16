`use strict`;

const express = require(`express`);
const app = express();
const PORT = 3000;
const https = require('https');

app.use(express.json());
app.use(express.urlencoded());

function logErrors(err, req, res, next){
    console.error(err)
    next(err)
}

/**
 * @param url
 * @example /stream/?url={url}
 */
app.get('/stream',(req,res)=>{
    const {url} = req.query;
    https.get(url, (stream) => {
        stream.pipe(res);
    });
});

app.use(logErrors);
app.listen(PORT, ()=>{
    console.log(`Streaming Service is listening on ${PORT}`)
});