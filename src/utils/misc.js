import _find from 'lodash/find'

export const getCategoryFromUrl = (things, url) => {
  const itemWalk = (items) => {
    return _find(items, item => {
      if (item.url === url) {
        return true
      }

      if (item.items) {
        return itemWalk(item.items)
      }

      return false
    })
  }

  const category = _find(things, thing => {
    return itemWalk(thing.items)
  })

  if (category !== undefined) {
    return category
  }

  return false
}

export const daysSinceLastPush = (lastPush) => {
  let msSince = Date.now() - Date.parse(lastPush)
  if (msSince < 0)
    return 0

  return Math.ceil((Date.now() - Date.parse(lastPush)) / 86400000)
}
