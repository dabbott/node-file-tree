import memoize from 'lodash.memoize'

const styles = {
  nodeContainer: {
    flex: '0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  nodeContent: {
    flex: '0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  nodeText: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'proxima-nova, "Helvetica Neue", Helvetica, Arial, sans-serif',
    lineHeight: '40px',
    padding: '0 20px',
  },
}

export const getPaddedStyle = memoize((depth) => {
  return {
    paddingLeft: depth * 20,
    ...styles.nodeContent,
  }
})

export default styles
