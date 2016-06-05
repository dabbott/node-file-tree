
import EventEmitter from 'events'

export default class extends EventEmitter {

  constructor(url) {
    super()

    this.ws = new WebSocket(url)
    this.ws.onmessage = (event) => {
      const action = JSON.parse(event.data)
      this.emit('message', action)
    }
  }

}
