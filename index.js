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
const tree = new Tree()

const expandedNodes = {}

let renderCount = 0
const render = (state) => {
  console.log('render', renderCount++)
  // const {tree, expandedNodes} = state || {}

  try {
    state = state.children.Users.children.devinabbott.children.Projects
  } catch (e) {
    console.log('not loaded', state)
  }

  const root = (
    <div style={style}>
      <TreeComponent
        tree={state}
        onToggleNode={(path, expanded) => {
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

// store.on('change', render)
tree.on('change', function (state, prevState) {
  console.log('> state tree updated', state)
  render(state)
  // console.log('tree change', arguments)
})

// const queue = []
// let timerId = null
// const drainQueue = () => {
//   // const actions = treeActions(store._state.tree)
//   const {tree} = store.getState()
//   // tree.transact()
//   store.startTransaction()
//   console.log('draining queue', queue.length)
//   queue.forEach(({eventName, path}) => {
//     try {
//       store.dispatch(eventName, path)
//     } catch (e) {
//       console.log('error performing', eventName, path)
//       console.error(e)
//     }
//   })
//   console.log('drained queue')
//   queue.length = 0
//   // tree.run()
//   store.finishTransaction()
//   timerId = null
// }

transport.on('message', (payload) => {
  const {eventName} = payload

  if (eventName === 'initialState') {
    const {rootPath, state} = payload

    console.log('state =>', state)

    tree.set(rootPath, state)
  } else {
    const {path} = payload

    // console.log('event', eventName, path)

    treeActions(tree)(eventName, path)

    // queue.push(payload)
    //
    // if (! timerId) {
    //   console.log('enqueued')
    //   timerId = setTimeout(drainQueue, 2000)
    // }
  }
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

render(tree.state)
