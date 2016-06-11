import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import nodePath from 'path'

import NodeCaret from './NodeCaret'
import styles, { getPaddedStyle } from './styles'

const isDirectory = (type) => {
  return type === 'directory'
}

export default class Node extends Component {

  static contextTypes = {
    isExpanded: PropTypes.func,
    pathSeparator: PropTypes.string,
    onToggleNode: PropTypes.func,
  }

  static defaultProps = {
    name: null,
    nodes: {},
  }

  constructor(props, context) {
    super(props)
    const {nodes, depth} = props
    this.state = this.mapPropsToState(props, context)
  }

  mapPropsToState(props, context) {
    const {type, nodes, path} = props
    // const {expandedNodes} = context

    if (isDirectory(type)) {
      // console.log('props => state', path, !! expandedNodes[path])
      return {
        sortedNodes: this.sortNodes(nodes),
        // expanded: !! expandedNodes[path],
      }
    } else {
      return {}
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const changed = shallowCompare(this, nextProps, nextState)

    // console.log('should update?', changed, nextProps.path)

    return changed
    //
    // if (nextProps.path === '') {
    //   console.log('changed', nextProps.path, changed)
    // }
    //
    // if (changed) {
    //   return true
    // } else {
    //   const {path} = this.props
    //   const {expandedNodes: oldExpandedNodes} = this.context
    //   const {expandedNodes: newExpandedNodes} = nextContext
    //
    //   return oldExpandedNodes[path] !== newExpandedNodes[path]
    // }

  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {nodes: oldNodes} = this.props
    const {nodes: newNodes, path} = nextProps
    //
    // const {expandedNodes: oldExpandedNodes} = this.context
    // const {expandedNodes: newExpandedNodes} = nextContext

    if (oldNodes !== newNodes) {
      this.setState(this.mapPropsToState(nextProps, nextContext))
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
    const {name, depth, type, path} = this.props
    const {sortedNodes} = this.state
    const {pathSeparator, onToggleNode, isExpanded} = this.context
    const expanded = isExpanded(path)
    // const expanded = typeof expandedProp === 'undefined' ? isExpanded(path) : expandedProp

    // console.log('rendering', 'expanded', expanded, path)

    return (
      <div style={styles.nodeContainer}>
        <div style={getPaddedStyle(depth)}
          onClick={() => {
            console.log('onClick', type, path, expanded)
            isDirectory(type) && onToggleNode(path, ! expanded)
          }}>
          {isDirectory(type) && (
            <NodeCaret
              expanded={expanded}
            />
          )}
          <div style={styles.nodeText}>{name}</div>
        </div>
        {expanded && sortedNodes.map((node) => {
          return (
            <Node
              ref={node.name}
              key={node.name}
              name={node.name}
              path={nodePath.join(path, node.name)}
              type={node.type}
              nodes={isDirectory(node.type) ? node.children : null}
              depth={depth + 1}
            />
          )
        })}
      </div>
    )
  }
}
