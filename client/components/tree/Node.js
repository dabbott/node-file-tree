import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import nodePath from 'path'

import NodeCaret from './NodeCaret'
import styles, { getPaddedStyle } from './styles'

const isDirectory = (type) => {
  return type === 'directory'
}

export default class Node extends Component {

  static defaultProps = {
    // node: null,
  }

  constructor(props, context) {
    super(props)

    this.state = this.mapPropsToState(props)
  }

  mapPropsToState(props, context) {
    const {type, children} = props.node

    if (isDirectory(type)) {
      return {
        sortedNodes: this.sortNodes(children),
      }
    } else {
      return {}
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const changed = shallowCompare(this, nextProps, nextState)

    // console.log('should update?', changed, nextProps.node.path)

    return changed
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {children: oldChildren} = this.props.node
    const {children: newChildren} = nextProps.node

    if (oldChildren !== newChildren) {
      // console.log('props => state', nextProps.node.path)
      this.setState(this.mapPropsToState(nextProps))
    }
  }

  sortNodes(nodes) {
    const sorted = Object.keys(nodes).sort().map((key) => {
      return nodes[key]
    })
    // console.log('children', nodes, 'sorted', sorted)
    return sorted
  }

  render() {
    const {depth, node, onToggleNode} = this.props
    const {type, expanded, name, path} = node
    const {sortedNodes} = this.state

    // console.log('rendering', 'expanded', expanded, path, node)

    return (
      <div style={styles.nodeContainer}>
        <div style={getPaddedStyle(depth)}
          onClick={() => {
            const nextExpandedState = ! expanded
            if (isDirectory(type)) {
              node.set('expanded', nextExpandedState)
              onToggleNode(path, nextExpandedState)
            }
          }}>
          {isDirectory(type) && (
            <NodeCaret
              expanded={expanded}
            />
          )}
          <div style={styles.nodeText}>{name}</div>
        </div>
        {expanded && sortedNodes.map((child) => {
          return (
            <Node
              ref={child.name}
              key={child.name}
              node={child}
              depth={depth + 1}
              onToggleNode={onToggleNode}
            />
          )
        })}
      </div>
    )
  }
}
