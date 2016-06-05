import Freezer from 'freezer-js'
import path from 'path'
import within from 'path-is-inside'

const split = (filePath) => {
	const parts = []
	while (path.dirname(filePath) !== filePath) {
		parts.unshift(path.basename(filePath))
		filePath = path.dirname(filePath)
	}
	return parts
}

const getUniqueEnding = (parentPath, childPath) => {
  const parentParts = split(parentPath)
  const childParts = split(childPath)

  if (childParts.length < parentParts.length) {
    throw new Error(`Can't get unique ending - child not in parent`)
  }

  return childParts.slice(parentParts.length)
}

class Tree {
  constructor(rootPath) {
    this.rootPath = rootPath

    const pathParts = split(rootPath)
    const rootName = pathParts[pathParts.length - 1] || ''

    const initialState = {}
    const options = { freezeInstances: true }

    this.store = new Freezer(initialState, options)
  }
  get state() {
    return this.store.get()
  }
  get(filePath) {
    const {state, rootPath} = this

    if (filePath === rootPath) {
      return state
    }

    const isWithin = within(filePath, rootPath)

    console.log(filePath, rootPath)

    if (! isWithin) {
      throw new Error(`Can't get path outside root`)
    }

    const parts = getUniqueEnding(rootPath, filePath)

    let parent = state
    while (parts.length) {
      const part = parts[0]
      console.log(part)
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
    return this.add(dirPath, {})
  }
  toJS() {
    return this.state.toJS()
  }
}

export default Tree
