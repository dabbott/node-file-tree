export default (tree) => (eventName, path, metadata) => {
  // console.log('=>', eventName, path, metadata)
  switch (eventName) {
    case 'add':
      tree.addFile(path, metadata)
    break
    case 'addDir':
      tree.addDir(path, metadata)
    break
    case 'unlink':
      tree.removeFile(path)
    break
    case 'unlinkDir':
      tree.removeDir(path)
    break
  }
}
