# Node File Tree

Node file tree comes with two independent parts: the server and the client.

### Server API

##### With socket.io

```JavaScript
import FileTreeServer from 'node-file-tree-server'
import transport from 'node-file-tree-server-socket.io'
const io = require('socket.io')()

const tree = new FileTreeServer(__dirname, transport(io))

io.listen(3000)
```

##### With Electron

```JavaScript
import FileTreeServer from 'node-file-tree-server'
import transport from 'node-file-tree-server-electron'
import { ipcMain } from 'electron'

const tree = new FileTreeServer(__dirname, transport(ipcMain))
```

### Client API

##### With socket.io

```JavaScript
import FileTreeClient from 'node-file-tree-client'
import transport from 'node-file-tree-client-socket.io'
import io from 'socket.io-client'

import React from 'react'
import ReactDOM from 'react-dom'
import FileTree from 'react-file-tree'

const socket = io('http://localhost:3000')
const tree = new FileTreeClient(transport(socket))

tree.on('change', ({tree, ui}) => {
  const mountNode = document.querySelector('#app')

  ReactDOM.render(
    <FileTree tree={tree} ui={ui} />,
    mountNode
  )
})
```

##### With electron

```JavaScript
import FileTreeClient from 'node-file-tree-client'
import transport from 'node-file-tree-client-electron'
import { ipcRenderer } from 'electron'

import React from 'react'
import ReactDOM from 'react-dom'
import FileTree from 'react-file-tree'

const tree = new FileTreeClient(transport(ipcRenderer))

tree.on('change', ({tree, ui}) => {
  const mountNode = document.querySelector('#app')

  ReactDOM.render(
    <FileTree tree={tree} ui={ui} />,
    mountNode
  )
})
```
