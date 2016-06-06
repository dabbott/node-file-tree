require('./styles/reset.css')
require('./styles/index.css')

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import path from 'path'

import Transport from './client/Transport'
import Tree from './shared/tree'
import treeActions from './shared/treeActions'
import TreeComponent from './client/components/tree/Tree'
import Store from './client/store'

const store = new Store()

const render = (state) => {
  console.log('state', state)
  const {tree, expandedNodes} = state || {}

  const root = (
    <div style={style}>
      <TreeComponent
        tree={tree}
        pathSeparator={path.sep}
        expandedNodes={expandedNodes}
        onToggleNode={(path, expanded) => {
          store.dispatch('toggleNode', path, expanded)
        }}
      />
      <pre>{JSON.stringify(expandedNodes, null, 2)}</pre>
    </div>
  )

  ReactDOM.render(root, document.getElementById('react-root'))
}

store.on('change', render)

const transport = new Transport(`ws://localhost:3124`)
transport.on('message', (payload) => {
  const {eventName} = payload
  if (eventName === 'initialState') {
    const {rootPath, state} = payload
    const tree = new Tree(rootPath, state)
    store.init(tree, treeActions)
    console.log('store', store, 'state', store.getState())


  } else {
    const {path} = payload
    store.dispatch(eventName, path)
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
