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

  watcher.on('all', (type, path, stat) => {
    // console.log('watcher event', type)
    const action = JSON.stringify({
      type,
      payload: {
        path,
        stat,
      }
    })

    connections.forEach(ws => {
      // console.log('sending', type)
      ws.send(action)
    })
  })

  // let treeChange = 0
  //
  // tree.on('change', (state) => {
  //   console.log('tree change', treeChange++)
  //   const action = {
  //     type: 'state',
  //     rootPath: tree.rootPath,
  //     state: tree.toJS(),
  //   }
  //
  //   connections.forEach(ws => {
  //     // console.log('sending', type)
  //     ws.send(JSON.stringify(action))
  //   })
  // })


  app.ws('/', function(ws, req) {

    // Send initial state upon connection
    const action = {
      type: 'state',
      payload: {
        rootPath: tree.rootPath,
        state: tree.toJS(),
      },
    }

    ws.send(JSON.stringify(action))

    ws.on('message', (e) => {
      const message = JSON.parse(e)
      const {type, payload} = message

      switch (type) {
        case 'watchPath':
          const {path} = payload
          watcher.add(path + '/')
          console.log('watching path', path)
        break
      }
    })

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
