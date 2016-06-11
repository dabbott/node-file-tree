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

const transport = new Transport(`ws://localhost:3124`)

const store = new Store()

let renderCount = 0
const render = (state) => {
  console.log('render', renderCount++)
  const {tree, expandedNodes} = state || {}

  const root = (
    <div style={style}>
      <TreeComponent
        tree={tree && tree.Users.devinabbott.Projects}
        root={'/Users/devinabbott/Projects'}
        pathSeparator={path.sep}
        expandedNodes={expandedNodes}
        onToggleNode={(path, expanded) => {
          store.dispatch('toggleNode', path, expanded)
          transport.send({
            eventName: 'watchPath',
            path: path,
          })
        }}
      />
      <pre>{JSON.stringify(expandedNodes, null, 2)}</pre>
    </div>
  )

  ReactDOM.render(root, document.getElementById('react-root'))
}

store.on('change', render)

const queue = []
let timerId = null
const drainQueue = () => {
  // const actions = treeActions(store._state.tree)
  const {tree} = store.getState()
  // tree.transact()
  store.startTransaction()
  console.log('draining queue', queue.length)
  queue.forEach(({eventName, path}) => {
    try {
      store.dispatch(eventName, path)
    } catch (e) {
      console.log('error performing', eventName, path)
      console.error(e)
    }
  })
  console.log('drained queue')
  queue.length = 0
  // tree.run()
  store.finishTransaction()
  timerId = null
}

transport.on('message', (payload) => {
  const {eventName} = payload
  if (eventName === 'initialState') {
    const {rootPath, state} = payload
    const tree = new Tree(rootPath, state)
    store.init(tree, treeActions)
    // console.log('store', store, 'state', store.getState())


  } else {
    const {path} = payload
    queue.push(payload)
    if (! timerId) {
      console.log('enqueued')
      timerId = setTimeout(drainQueue, 2000)
    }
  }
  // console.log('payload', payload)
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
