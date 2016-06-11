import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import nodePath from 'path'

import Node from './Node'

const styles = {
  container: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#3B3738',
    minHeight: 0,
    minWidth: 0,
    overflow: 'auto',
    flexWrap: 'no-wrap',
  },
}

export default class extends Component {

  static defaultProps = {
    tree: null,
    onToggleNode: () => {},
  }

  constructor() {
    super()

    this.toggleNode = this.toggleNode.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {tree: oldTree} = this.props
    const {tree: newTree} = nextProps

    return oldTree !== newTree
    // return shallowCompare(this, nextProps, nextState)
  }

  toggleNode(node) {
    this.props.onToggleNode(node)
  }

  render() {
    const {tree} = this.props

    return (
      <div style={styles.container}>
        {tree && (
          <Node
            ref={'root'}
            node={tree}
            depth={0}
            onToggleNode={this.toggleNode}
          />
        )}
      </div>
    )
  }
}
