var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

export const init = (watcher, tree) => {

  const connections = []

  const removeConnection = (item) => {
    const index = connections.indexOf(item)
    if (index >= 0) {
      connections.splice(index, 1)
    }
  }

  watcher.on('all', (eventName, path) => {
    console.log('watcher event', eventName)
    const action = { eventName, path }
    connections.forEach(ws => {
      ws.send(JSON.stringify(action))
    })
  })

  app.ws('/', function(ws, req) {

    // Send initial state upon connection
    const action = {
      eventName: 'initialState',
      rootPath: tree.rootPath,
      state: tree.toJS(),
    }

    ws.send(JSON.stringify(action))

    ws.on('close', () => {
      removeConnection(ws)
    })

    connections.push(ws)

    console.log('Connection opened')
  })

  const port = 3124

  console.log("listening on port", port)

  app.listen(port);
}
