export const createStore = (initialState = {}) => {
  const store = {
    status: 'loading',
    data: null,
    getState: () => {
      return store.data
    },
    ready: (tree) => {
      store.status = 'ready'
      store.data = tree,
    },
  }

  return store
}
