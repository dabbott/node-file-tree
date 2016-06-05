var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

export const init = (watcher) => {
  app.use(function (req, res, next) {
    console.log('middleware');
    req.testing = 'testing';
    return next();
  });

  app.get('/', function(req, res, next){
    console.log('get route', req.testing);
    res.end();
  });

  app.ws('/', function(ws, req) {
    watcher.on('all', (eventName, path) => {
      console.log(eventName, path)
      const action = { eventName, path }
      ws.send(JSON.stringify(action))
    })
    ws.on('message', function(msg) {
      console.log(msg);
    });
    console.log('socket', req.testing);
  });

  const port = 3124

  console.log("listening on port", port)

  app.listen(port);
}
