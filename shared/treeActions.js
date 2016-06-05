export default (tree) => (eventName, path) => {
  console.log('=>', eventName, path)
  switch (eventName) {
    case 'add':
      tree.addFile(path)
    break
    case 'addDir':
      tree.addDir(path)
    break
  }
}
