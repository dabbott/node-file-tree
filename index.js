require('./styles/reset.css')
require('./styles/index.css')

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Transport from './client/Transport'
import Tree from './shared/tree'
import treeActions from './shared/treeActions'

let tree = null
let dispatch = null

const transport = new Transport(`ws://localhost:3124`)
transport.on('message', (payload) => {
  const {eventName} = payload
  if (eventName === 'initialState') {
    const {rootPath, state} = payload
    tree = new Tree(rootPath, state)
    tree.store.on('update', function( state ){
      console.log('=== state ===')
      console.log(JSON.stringify(state, null, 2))
    })
    dispatch = treeActions(tree)
  } else {
    const {path} = payload
    // console.log('dispatch', tree, dispatch)
    tree && dispatch && dispatch(eventName, path)
  }
  console.log('payload', payload)
})

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
