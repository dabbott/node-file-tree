
const url = `ws://localhost:3124`
const ws = new WebSocket(url)
ws.onmessage = function(e) {
  console.log('message', e)
}
