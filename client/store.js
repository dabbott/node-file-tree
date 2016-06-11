import EventEmitter from 'events'
import Freezer from 'freezer-js'

class Store extends EventEmitter {
  constructor() {
    super()

    this.status = 'loading'
    this.inTransaction = false
    this._state = {
      tree: null,
      expandedNodes: new Freezer({}),
    }
  }

  getState() {
    const state = this._state

    return {
      tree: state.tree ? state.tree.state : null,
      expandedNodes: state.expandedNodes.get(),
    }
  }

  startTransaction() {
    this.inTransaction = true
  }

  finishTransaction() {
    this.inTransaction = false
    this.emitChange()
  }

  init(tree, treeActions) {
    this.status = 'ready'
    this._dispatch = treeActions(tree)
    this._state.tree = tree
    this.emitChange()
  }

  dispatch(...args) {
    if (args[0] === 'toggleNode') {
      // console.log('toggling', ...args)
      const nodePath = args[1]
      const shouldExpand = args[2]

      const expandState = this._state.expandedNodes.get()
      if (expandState[nodePath]) {
        expandState.remove(nodePath)
      } else {
        expandState.set(nodePath, shouldExpand)
      }
    } else {
      this._dispatch && this._dispatch(...args)
    }

    ! this.inTransaction && this.emitChange()
  }

  emitChange() {
    this.emit('change', this.getState())
  }
}

export default Store
