import React, { Component } from 'react'
import shallowCompare from 'react-addons-shallow-compare'

import Node from './Node'

const styles = {
  container: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#3B3738',
  },
}

export default class extends Component {

  static defaultProps = {
    tree: null,
    root: '/',
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {tree, root} = this.props

    return (
      <div style={styles.container}>
        {(tree &&
          <Node
            name={root}
            type={'directory'}
            nodes={tree}
            depth={0}
          />
        )}
      </div>
    )
  }
}
