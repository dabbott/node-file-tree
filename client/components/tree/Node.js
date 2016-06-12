import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import nodePath from 'path'

import NodeCaret from './NodeCaret'
import styles, { getPaddedStyle } from './styles'

const isDirectory = (type) => {
  return type === 'directory'
}

export default class Node extends Component {

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const shouldUpdate = shallowCompare(this, nextProps, nextState)

    // console.log('update', shouldUpdate, nextProps.node.path)

    return shouldUpdate
  }

  render() {
    const {depth, node, expanded, onToggleNode} = this.props
    const {type, name, path} = node

    // console.log('rendering', 'expanded', expanded, path, node)

    return (
      <div style={styles.nodeContainer}>
        <div style={getPaddedStyle(depth)}
          onClick={() => {
            if (isDirectory(type)) {
              onToggleNode(node)
            }
          }}>
          {isDirectory(type) && (
            <NodeCaret
              expanded={expanded}
            />
          )}
          <div style={styles.nodeText}>{name}</div>
        </div>
      </div>
    )
  }
}
