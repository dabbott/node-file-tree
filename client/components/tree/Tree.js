import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import shallowCompare from 'react-addons-shallow-compare'
import nodePath from 'path'
import { AutoSizer, VirtualScroll } from 'react-virtualized'

import Node from './Node'
import { getVisibleNodesByIndex, countVisibleNodes } from '../../../shared/utils/treeUtils'

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
    overflow: 'none',
    flexWrap: 'no-wrap',
  },
}

export default class extends Component {

  static defaultProps = {
    tree: null,
    onToggleNode: () => {},
  }

  constructor(props) {
    super()

    this.toggleNode = this.toggleNode.bind(this)
    this.renderNode = this.renderNode.bind(this)

    this.state = this.mapPropsToState(props)
  }

  mapPropsToState(props) {
    const {tree} = props

    delete this.indexCache
    delete this.indexOffset

    return {
      visibleNodes: countVisibleNodes(tree),
    }
  }

  componentWillReceiveProps(nextProps) {
    const {tree: oldTree} = this.props
    const {tree: newTree} = nextProps

    if (oldTree !== newTree) {
      this.setState(this.mapPropsToState(nextProps))
    }
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

  renderNode({index}) {
    if (! this.indexCache ||
        ! this.indexCache[index - this.indexOffset]) {
      const lowerBound = Math.max(0, index - 20)
      const upperBound = index + 40

      this.indexOffset = lowerBound
      this.indexCache = getVisibleNodesByIndex(
        this.props.tree,
        lowerBound,
        upperBound
      )

      // console.log('cached', lowerBound, '<-->', upperBound)
    }

    const {node, depth} = this.indexCache[index - this.indexOffset]
    const {path} = node

    // console.log('node', index)

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
    const {visibleNodes} = this.state

    return (
      <div style={styles.container}>
        <div style={{flex: '1 1 auto', minHeight: 0, minWidth: 0, overflow: 'none'}}>
          <AutoSizer>
            {({width, height}) => (
              <VirtualScroll
                height={height}
                overscanRowCount={10}
                rowHeight={40}
                rowRenderer={this.renderNode}
                rowCount={visibleNodes}
                width={width}
                // Updates the VirtualScroll when data changes
                tree={tree}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    )
  }
}
