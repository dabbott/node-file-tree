require('./styles/reset.css')
require('./styles/index.css')

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

require('./client/transport')

const style = {
  flex: '1 1 auto',
  display: 'flex',
  alignItems: 'stretch',
  minWidth: 0,
  minHeight: 0,
  overflow: 'hidden',
}

const root = (
  <div style={style}>
    Hello World!
  </div>
)

ReactDOM.render(root, document.getElementById('react-root'))
