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

// export const addChildNode = (parent, child) => {
//   parent.children
// }

export const ensureNode = (dirPath, state) => {
  state = state || createDirectoryNode()

  const parts = split(dirPath)
  const {root} = path.parse ? path.parse(dirPath) : {root: '/'}

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
