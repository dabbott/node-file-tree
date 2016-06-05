import { watch } from "./watch"
import { init } from "./server"
import Tree from './tree'
import path from 'path'

const DIRECTORY = path.dirname(__dirname)

const watcher = watch(DIRECTORY)
init(watcher)

console.log('ROOT', DIRECTORY)

const tree = new Tree(DIRECTORY)

watcher.on('all', (eventName, path) => {
  console.log('=>', eventName, path)
  switch (eventName) {
    case 'add':
      tree.addFile(path)
    break
    case 'addDir':
      tree.addDir(path)
    break
  }
})

tree.store.on('update', function( state ){
  console.log('=== state ===')
  console.log(JSON.stringify(state, null, 2))
})


//
// const tree = new Tree('/a/b/c')
//
// console.log('get', tree.get('/a/b/c/d/e'))
//
// tree.add('/a/b/c/index.js')
//
// document.write(JSON.stringify(tree.toJS()))
