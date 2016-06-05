import path from 'path'
import chokidar from 'chokidar'

export const watch = (dirPath) => {
  // Example of a more typical implementation structure:

  // Initialize watcher.
  var watcher = chokidar.watch(dirPath, {
    ignored: /node_modules/,
    persistent: true,
    // depth: 0,
    depth: 1,
  })

  // Something to use when events are received.
  var log = console.log.bind(console)
  // Add event listeners.
  watcher
    .on('add', path => log(`File ${path} has been added`))
    .on('change', path => log(`File ${path} has been changed`))
    .on('unlink', path => log(`File ${path} has been removed`))

  watcher
    .on('addDir', path => log(`Directory ${path} has been added`))
    .on('unlinkDir', path => log(`Directory ${path} has been removed`))
    .on('error', error => log(`Watcher error: ${error}`))
    .on('ready', () => log('Initial scan complete. Ready for changes'))
    // .on('raw', (event, path, details) => {
    //   log('Raw event info:', event, path, details);
    // });

  return watcher

}
