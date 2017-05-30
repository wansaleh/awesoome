import fetch from 'unfetch'
import nprogress from 'nprogress'
import { token } from '../github.json'
import _find from 'lodash/find'
import _some from 'lodash/some'

// export const compareProps = (curProps, nextProps, ) => {
// }

export const flattenListing = (things) => {
  let output = []

  things.forEach(thing => {
    if (thing.items) {
      let subitems = flattenListing(thing.items)

      subitems.forEach(subitem => {
        output.push(subitem)
      })
    }
    else {
      output.push(thing)
    }
  })

  return output
}

export const getListing = (things, repo) => {
  const itemWalk = (items) => {
    return _find(items, item => {
      if (item.full_name === repo) {
        return true
      }

      if (item.items) {
        return itemWalk(item.items)
      }

      return false
    })
  }

  for (let thing in things) {
    let item = itemWalk(thing.items)
    if (item !== false)
      return item
  }
}

export const isListed = (things, url) => {
  const itemWalk = (items) => {
    return _some(items, item => {
      if (item.url === url) {
        return true
      }

      if (item.items) {
        return itemWalk(item.items)
      }

      return false
    })
  }

  return _some(things, thing => {
    return itemWalk(thing.items)
  })
}

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
