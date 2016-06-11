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
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {depth, node, onToggleNode} = this.props
    const {type, expanded, name, path} = node

    // console.log('rendering', 'expanded', expanded, path, node)

    return (
      <div style={styles.nodeContainer}>
        <div style={getPaddedStyle(depth)}
          onClick={() => {
            if (isDirectory(type)) {
              const updated = node.set('expanded', ! expanded)
              onToggleNode(updated)
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
