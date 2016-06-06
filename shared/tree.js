import Freezer from 'freezer-js'
import path from 'path'

import { split, within, ensurePath } from './utils/pathUtils'

class Tree {
  constructor(rootPath, initialState) {
    this.rootPath = rootPath

    initialState = initialState || ensurePath(rootPath)
    const options = { freezeInstances: true }

    this.store = new Freezer(initialState, options)
  }
  get state() {
    return this.store.get()
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

      if (typeof parent[part] === 'undefined') {
        return null
      }

      parts.shift()
      parent = parent[part]
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
    parent.set(basePath, item)

    return item
  }
  addFile(filePath) {
    return this.add(filePath, true)
  }
  addDir(dirPath) {
    const {rootPath} = this

    // console.log('add dir', dirPath, 'root', rootPath)
    if (! within(dirPath, rootPath) || dirPath === rootPath) {
      console.log('No need to add', dirPath)
      return
    }

    return this.add(dirPath, {})
  }
  remove(itemPath) {
    const parentPath = path.dirname(itemPath)

    const parent = this.get(parentPath)
    if (! parent) {
      console.log(`Can't add path - parent doesn't exist`)
      return null
    }

    const basePath = path.basename(itemPath)
    const item = parent[basePath]
    parent.remove(basePath)

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
