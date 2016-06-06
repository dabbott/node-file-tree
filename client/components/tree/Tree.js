import React, { Component } from 'react'
import shallowCompare from 'react-addons-shallow-compare'

import DirectoryNode from './DirectoryNode'

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
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {tree} = this.props

    return (
      <div style={styles.container}>
        {(tree &&
          <DirectoryNode
            name={'/'}
            nodes={tree}
            depth={0}
          />
        )}
      </div>
    )
  }
}
