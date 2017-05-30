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
