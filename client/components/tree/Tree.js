import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import shallowCompare from 'react-addons-shallow-compare'
import nodePath from 'path'

import Node from './Node'
import { getVisibleNodesByIndex } from '../../../shared/utils/treeUtils'

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
    this.renderNode = this.renderNode.bind(this)
    // this.handleScroll = _.throttle(this.handleScroll.bind(this), 100)
  }

  // componentDidMount() {
  //   this.calculatePosition()
  // }
  //
  // componentDidUpdate() {
  //   this.calculatePosition()
  // }

  shouldComponentUpdate(nextProps, nextState) {
    const {tree: oldTree} = this.props
    const {tree: newTree} = nextProps

    return oldTree !== newTree
    // return shallowCompare(this, nextProps, nextState)
  }

  toggleNode(node) {
    this.props.onToggleNode(node)
  }

  renderNode({node, depth}) {
    const {path} = node

    return (
      <Node
        key={path}
        node={node}
        depth={depth}
        onToggleNode={this.toggleNode}
      />
    )
  }

  render() {
    const {tree} = this.props
    const visibleNodes = getVisibleNodesByIndex(tree, 0, 20)

    return (
      <div style={styles.container}>
        {visibleNodes.map(this.renderNode)}
      </div>
    )
  }
}
