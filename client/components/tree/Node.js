import React, { Component } from 'react'
import shallowCompare from 'react-addons-shallow-compare'

import styles, { getPaddedStyle } from './styles'

const isDirectory = (type) => {
  return type === 'directory'
}

export default class Node extends Component {

  static defaultProps = {
    name: null,
    nodes: {},
  }

  constructor(props) {
    super(props)
    const {nodes, depth} = props
    this.state = this.mapPropsToState(props)
  }

  mapPropsToState(props) {
    const {type, nodes} = props

    if (isDirectory(type)) {
      return {
        sortedNodes: this.sortNodes(nodes),
      }
    } else {
      return {}
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.mapPropsToState(nextProps))
  }

  sortNodes(nodes) {
    const sorted = Object.keys(nodes).sort().map((key) => {
      const node = nodes[key]
      if (node === true) {
        // console.log('file node', nodes, node, key)
        return {
          name: key,
          type: 'file',
          node,
        }
      } else {
        return {
          name: key,
          type: 'directory',
          nodes: node,
          node,
        }
      }
    })
    // console.log('children', nodes, 'sorted', sorted)
    return sorted
  }

  render() {
    const {name, depth, type} = this.props
    const {sortedNodes} = this.state

    return (
      <div style={styles.nodeContainer}>
        <div style={getPaddedStyle(depth)}>
          <div style={styles.nodeText}>{name}</div>
        </div>
        {isDirectory(type) && sortedNodes.map((node) => {
          return (
            <Node
              key={node.name}
              name={node.name}
              type={node.type}
              nodes={isDirectory(node.type) ? node.nodes : null}
              depth={depth + 1}
            />
          )
        })}
      </div>
    )
  }
}
