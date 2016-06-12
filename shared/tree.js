import Freezer from 'freezer-js'
import path from 'path'
import EventEmitter from 'events'

import { split, within } from './utils/pathUtils'
import { ensureNode, createFileNode, createDirectoryNode } from './utils/treeUtils'

class Tree extends EventEmitter {
  constructor(rootPath = '/', initialState) {
    super()

    this.emitChange = this.emitChange.bind(this)

    this.emitCount = 0
    this.inTransaction = false
    this.set(rootPath, initialState)
  }
  set(rootPath, state) {
    this.rootPath = rootPath

    state = state || ensureNode(rootPath)

    if (this.store) {
      this.store.off('update', this.emitChange)
    }

    this.store = new Freezer(state)
    this.store.on('update', this.emitChange)

    this.emitChange(this.state)
  }
  emitChange(...args) {
    // console.log('emitting', this.emitCount++)
    this.emit('change', ...args)
  }
  get state() {
    if (this.inTransaction) {
      return this.transactionState
    }
    return this.store.get()
  }
  startTransaction() {
    this.inTransaction = true
    this.transactionState = this.state.transact()
  }
  finishTransaction() {
    this.inTransaction = false
    this.transactionState = null
  }
  get(filePath) {
    const {state, rootPath} = this

    const isWithin = within(filePath, rootPath)

    if (! isWithin) {
      throw new Error(`Can't get path outside root`)
    }

    const parts = split(filePath)

    let parent = state
    while (parts.length) {
      const part = parts[0]

      if (typeof parent.children[part] === 'undefined') {
        return null
      }

      parts.shift()
      parent = parent.children[part]
    }

    return parent
  }
  add(itemPath, item) {
    const parentPath = path.dirname(itemPath)

    const parent = this.get(parentPath)
    if (! parent) {
      console.log(`Can't add path - parent doesn't exist`)
      return null
    }

    const basePath = path.basename(itemPath)
    item.name = basePath
    item.path = itemPath
    parent.children.set(basePath, item)

    return item
  }
  addFile(filePath, metadata) {
    return this.add(filePath, createFileNode(filePath, metadata))
  }
  addDir(dirPath, metadata) {
    const {rootPath} = this

    // console.log('add dir', dirPath, 'root', rootPath)
    if (! within(dirPath, rootPath) || dirPath === rootPath) {
      console.log('No need to add', dirPath)
      return
    }

    return this.add(dirPath, createDirectoryNode(dirPath, metadata))
  }
  remove(itemPath) {
    const parentPath = path.dirname(itemPath)

    const parent = this.get(parentPath)
    if (! parent) {
      console.log(`Can't add path - parent doesn't exist`)
      return null
    }

    const basePath = path.basename(itemPath)
    const item = parent.children[basePath]
    parent.children.remove(basePath)

    return item
  }
  removeFile(itemPath) {
    this.remove(itemPath)
  }
  removeDir(itemPath) {
    this.remove(itemPath)
  }
  toJS() {
    return this.state.toJS()
  }
}

export default Tree
