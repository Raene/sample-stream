`use strict`;
const http = require(`http`);
const server = http.createServer();
const {serveStream} = require(`./controller`);

server.on('request',catchErrors(serveStream))

function catchErrors(fn) {
    return function (req, res) {
      return fn(req, res).catch((err)=> console.error(err));
    };
}
server.listen(8000,()=>{
  console.log("Server is listening on port 8000")
});