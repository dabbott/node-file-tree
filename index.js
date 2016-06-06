require('./styles/reset.css')
require('./styles/index.css')

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Transport from './client/Transport'
import Tree from './shared/tree'
import treeActions from './shared/treeActions'
import TreeComponent from './client/components/tree/Tree'

let tree = null
let dispatch = null

const render = (state) => {
  const root = (
    <div style={style}>
      {/*<pre>{JSON.stringify(state, null, 2)}</pre>*/}
      <TreeComponent
        tree={state}
      />
    </div>
  )

  ReactDOM.render(root, document.getElementById('react-root'))
}

const transport = new Transport(`ws://localhost:3124`)
transport.on('message', (payload) => {
  const {eventName} = payload
  if (eventName === 'initialState') {
    const {rootPath, state} = payload
    tree = new Tree(rootPath, state)
    tree.store.on('update', function( state ){
      console.log('updated', state, tree.state, state === tree.state)
      render(tree.state)
    })
    dispatch = treeActions(tree)
    render(tree.state)
  } else {
    const {path} = payload
    // console.log('dispatch', tree, dispatch)
    tree && dispatch && dispatch(eventName, path)
  }
  console.log('payload', payload)
})

const style = {
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  minWidth: 0,
  minHeight: 0,
  overflow: 'hidden',
}

render(null)
