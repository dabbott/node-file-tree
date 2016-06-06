import React, { Component } from 'react'
import shallowCompare from 'react-addons-shallow-compare'

import FileNode from './FileNode'
import styles, { getPaddedStyle } from './styles'

export default class DirectoryNode extends Component {

  static defaultProps = {
    name: null,
    nodes: {},
  }

  constructor(props) {
    super(props)
    const {nodes, depth} = props
    this.state = {
      sortedNodes: this.sortNodes(nodes),
    }
    // console.log('sorted children', this.state.sortedNodes)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentWillReceiveProps(nextProps) {
    const {nodes, depth} = nextProps
    // console.log('received', nodes)
    this.setState({
      sortedNodes: this.sortNodes(nodes),
    })
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
    const {name, depth} = this.props
    const {sortedNodes} = this.state

    return (
      <div style={styles.nodeContainer}>
        <div style={getPaddedStyle(depth)}>
          <div style={styles.nodeText}>{name}</div>
        </div>
        {sortedNodes.map((node) => {
          // console.log('node name', node.name, node)
          if (node.type === 'file') {
            return (
              <FileNode
                key={node.name}
                name={node.name}
                depth={depth + 1}
              />
            )
          } else {
            return (
              <DirectoryNode
                key={node.name}
                name={node.name}
                nodes={node.nodes}
                depth={depth + 1}
              />
            )
          }
        })}
      </div>
    )
  }
}
