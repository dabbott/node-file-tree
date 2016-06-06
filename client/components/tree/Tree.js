import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'

import Node from './Node'
import {split} from '../../../shared/utils/pathUtils'

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
  },
}

export default class extends Component {

  static childContextTypes = {
    isExpanded: PropTypes.func,
    pathSeparator: PropTypes.string,
    onToggleNode: PropTypes.func,
  }

  static defaultProps = {
    tree: null,
    root: '',
    onToggleNode: () => {},
  }

  constructor() {
    super()

    this.toggleNode = this.toggleNode.bind(this)
    this.isExpanded = this.isExpanded.bind(this)
  }

  getChildContext() {
    const {
      pathSeparator,
    } = this.props

    return {
      pathSeparator,
      onToggleNode: this.toggleNode,
      isExpanded: this.isExpanded,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  isExpanded(path) {
    return !! this.props.expandedNodes[path]
  }

  toggleNode(path, expanded) {
    const {root, expandedNodes} = this.props

    this.props.onToggleNode(path, expanded)

    const parts = split(path)
    let ref = this.refs.root
    while (parts.length) {
      ref = ref.refs[parts[0]]
      // console.log('updating ref', ref.props.path)
      // ref.forceUpdate()
      parts.shift()
    }
    ref.forceUpdate()
  }

  render() {
    const {tree, root} = this.props

    return (
      <div style={styles.container}>
        {(tree &&
          <Node
            ref={'root'}
            // expanded={this.isExpanded(root)}
            name={root}
            path={root}
            type={'directory'}
            nodes={tree}
            depth={0}
          />
        )}
      </div>
    )
  }
}
