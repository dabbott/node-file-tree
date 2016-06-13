let actionCount = 0

export default (tree, debug) => (action) => {
  const {type, payload} = action

  if (debug) {
    console.log('action', actionCount++, '=>', type, payload.path)
  }

  switch (type) {
    case 'state':
      tree.set(payload.rootPath, payload.state.tree, payload.state.stat)
    break
    case 'add':
      tree.addFile(payload.path, payload.metadata)
    break
    case 'addDir':
      tree.addDir(payload.path, payload.metadata)
    break
    case 'unlink':
      tree.removeFile(payload.path)
    break
    case 'unlinkDir':
      tree.removeDir(payload.path)
    break
  }

  return tree
}
