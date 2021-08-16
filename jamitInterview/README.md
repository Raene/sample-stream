# Url Streaming Service

A simple service to stream a file from a url

## How it works

Run `npm install` to get necessary dependencies

Run `npm run dev` to get the server up and running

This get routes receives a url string via the express query object, passes it to the https to get the readstream and pipes this stream to the res writeable object

`/stream/?url=<url>`

using `stream/:url` throws an error as the url is not encoded properly, so i ended up going with a query string instead as that safely passes the url for streaming
