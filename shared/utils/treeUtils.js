import path from 'path'

import { split } from './pathUtils'

export const createDirectoryNode = (filePath, stat) => {
  return {
    type: 'directory',
    name: path.basename(filePath),
    path: filePath,
    stat,
    children: {},
  }
}

export const createFileNode = (filePath, stat) => {
  return {
    type: 'file',
    name: path.basename(filePath),
    path: filePath,
    stat,
  }
}

// export const traverse = () => {
//
// }

export const countVisibleNodes = (node) => {
  let count = 1

  if (node.expanded) {
    const children = node.children
    for (var key in children) {
      count += countVisibleNodes(children[key])
    }
  }

  return count
}

export const ensureNode = (dirPath, state) => {
  const parts = split(dirPath)
  const {root} = path.parse ? path.parse(dirPath) : {root: '/'}

  state = state || createDirectoryNode(root)

  let lastPart = state
  let currentPath = root
  while (parts.length) {
    const part = parts[0]
    const currentPath = path.join(root, part)
    lastPart = lastPart.children[part] = createDirectoryNode(currentPath)
    parts.shift()
  }

  return state
}
