import path from 'path'
import chokidar from 'chokidar'

const DIRECTORY = path.dirname(__dirname)

// Example of a more typical implementation structure:

// Initialize watcher.
var watcher = chokidar.watch(DIRECTORY, {
  ignored: /[\/\\]\./,
  persistent: true,
  depth: 0,
})

// Something to use when events are received.
var log = console.log.bind(console)
// Add event listeners.
watcher
  .on('add', path => log(`File ${path} has been added`))
  .on('change', path => log(`File ${path} has been changed`))
  .on('unlink', path => log(`File ${path} has been removed`))

export default watcher
