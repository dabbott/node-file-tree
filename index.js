import 'react-virtualized/styles.css'
import './styles/reset.css'
import './styles/index.css'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import path from 'path'

import Transport from './client/Transport'
import WorkQueue from './shared/WorkQueue'
import Tree from './shared/tree'
import treeActions from './shared/treeActions'
import TreeComponent from './client/components/tree/Tree'

const transport = new Transport(`ws://localhost:3124`)

const tree = new Tree()
const actions = treeActions(tree)

const workQueue = new WorkQueue()
workQueue.on('start', (taskCount) => {
  console.log('tasks =>', taskCount)
  tree.startTransaction()
})
workQueue.on('finish', tree.finishTransaction)

let renderCount = 0
const render = (state) => {
  console.log('render', renderCount++)
  let {tree, ui} = state

  try {
    tree = tree.children.Users.children.devinabbott.children.Projects
  } catch (e) {
    console.log('not loaded', tree)
  }

  const root = (
    <div style={style}>
      <TreeComponent
        tree={tree}
        ui={ui}
        onToggleNode={({path}, expanded) => {
          if (expanded) {
            transport.send({
              eventName: 'watchPath',
              path: path,
            })
          }
        }}
      />
      <pre>{JSON.stringify(ui, null, 2)}</pre>
    </div>
  )

  ReactDOM.render(root, document.getElementById('react-root'))
}

tree.on('change', function (state, prevState) {
  // console.log('> state tree updated', state)
  render(state)
})

transport.on('message', (payload) => {
  const {eventName} = payload

  if (eventName === 'initialState') {
    const {rootPath, state} = payload

    console.log('state =>', state)

    tree.set(rootPath, state.tree, state.stat)
  } else {
    const {path} = payload

    console.log('event', eventName, path)

    const action = actions.bind(null, eventName, path)
    workQueue.push(action)
    // workQueue.run()
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
