import fetch from 'unfetch'
import nprogress from 'nprogress'
import { token } from '../github.json'
import _find from 'lodash/find'
import _some from 'lodash/some'

export const isListed = (things, link) => {
  const itemWalk = (items) => {
    return _some(items, item => {
      if (item.link === link) {
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

export const getCategoryFromLink = (things, link) => {
  const itemWalk = (items) => {
    return _find(items, item => {
      if (item.link === link) {
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

export const ghFetch = (url, callback) => {
  nprogress.inc()
  fetch(url, {
    headers: {
      'Authorization': `token ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      callback(data)
      nprogress.done()
    })
    .catch(err => {
      console.error(err)
      nprogress.done()
    })
}

export const ghFetchHTML = (url, callback) => {
  nprogress.inc()
  fetch(url, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3.html'
    }
  })
    .then(res => res.text())
    .then(body => {
      callback(body)
      nprogress.done()
    })
    .catch(err => {
      console.error(err)
      nprogress.done()
    })
}
