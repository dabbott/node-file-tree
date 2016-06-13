import { watch } from "./watch"
import { init } from "./server"
import Tree from '../shared/tree'
import treeActions from '../shared/treeActions'
import WorkQueue from '../shared/WorkQueue'
import path from 'path'

const DIRECTORY = path.join(path.dirname(path.dirname(__dirname)))
console.log('ROOT', DIRECTORY)

const tree = new Tree(DIRECTORY)
const watcher = watch(DIRECTORY)

init(watcher, tree)

watcher.on('all', treeActions(tree, true))

// const workQueue = new WorkQueue()
// workQueue.on('start', (taskCount) => {
//   console.log('tasks =>', taskCount)
//   tree.startTransaction()
// })
// workQueue.on('finish', tree.finishTransaction)
//
// const actions = treeActions(tree, true)
// watcher.on('all', (eventName, path, stat) => {
//   const f = actions.bind(null, eventName, path, stat)
//   workQueue.push(f)
// })

// tree.store.on('update', function( state ){
//   console.log('=== state ===')
//   console.log(JSON.stringify(state, null, 2))
// })


//
// const tree = new Tree('/a/b/c')
//
// console.log('get', tree.get('/a/b/c/d/e'))
//
// tree.add('/a/b/c/index.js')
//
// document.write(JSON.stringify(tree.toJS()))
