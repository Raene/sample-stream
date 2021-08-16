# Url Streaming Service

A simple service to stream an audio file from your local folder, this service runs on the bare http module for nodejs. No external dependencies used since it's a simple project

## How it works

run `node index.js` to start the server

visit `localhost:8000/?file=<filename>`

The filename should match the name of any audio file you copy into the music folder

There's a sample file in the music folder called 'delasoul'

Visit `localhost:8000/?file=delasoul` to see a quick example
