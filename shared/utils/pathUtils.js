import path from 'path'

export within from 'path-is-inside'

export const split = (filePath) => {
	const parts = []
	while (path.dirname(filePath) !== filePath) {
		parts.unshift(path.basename(filePath))
		filePath = path.dirname(filePath)
	}
	return parts.filter(part => part)
}

export const ensurePath = (dirPath, state = {}) => {
  const parts = split(dirPath)

  let lastPart = state
  while (parts.length) {
    lastPart = lastPart[parts[0]] = {}
    parts.shift()
  }

  return state
}
