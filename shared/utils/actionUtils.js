
export const actionFromChokidarEvent = (eventName, path, stat) => {
  return {
    type: eventName,
    payload: {
      path,
      stat,
    }
  }
}
