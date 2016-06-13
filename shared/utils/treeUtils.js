import path from 'path'

import { split } from './pathUtils'

export const createDirectoryNode = (filePath, stat) => {
  return {
    type: 'directory',
    name: path.basename(filePath),
    path: filePath,
    // stat,
    children: {},
  }
}

export const createFileNode = (filePath, stat) => {
  return {
    type: 'file',
    name: path.basename(filePath),
    path: filePath,
    // stat,
  }
}

export const sortNodes = (nodes) => {
  return Object.keys(nodes).sort().map((key) => {
    return nodes[key]
  })
}

export const getVisibleNodesByIndex = (root, ui, targetIndex, targetCount) => {
  let currentIndex = 0
  let currentCount = 0
  const nodes = []

  const getNode = (node, depth) => {
    if (currentCount >= targetCount) {
      return
    }

    if (currentIndex >= targetIndex) {
      nodes.push({
        node,
        depth,
      })
      currentCount++
    }

    currentIndex++

    if (ui[node.path]) {
      const children = sortNodes(node.children)
      for (var i = 0; i < children.length; i++) {
        getNode(children[i], depth + 1)
      }
    }
  }

  getNode(root, 0)

  return nodes
}

export const countVisibleNodes = (node, ui) => {
  let count = 1

  if (ui[node.path]) {
    const children = node.children
    for (var key in children) {
      count += countVisibleNodes(children[key], ui)
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
