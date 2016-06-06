import React, { Component } from 'react'
import shallowCompare from 'react-addons-shallow-compare'

import styles, { getPaddedStyle } from './styles'

export default class extends Component {

  static defaultProps = {
    name: null,
    depth: 0,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {name, depth} = this.props

    return (
      <div style={styles.nodeContainer}>
        <div style={getPaddedStyle(depth)}>
          <div style={styles.nodeText}>{name}</div>
        </div>
      </div>
    )
  }
}
