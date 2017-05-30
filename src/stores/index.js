import remotedev from 'mobx-remotedev'
import { observable, action } from 'mobx'
import nprogress from 'nprogress'
import _each from 'lodash/each'

@remotedev
export class BaseStore {
  @observable loading = true
  @observable.shallow things = []
  @observable.shallow flatThings = []

  @observable searchTerm = ''
  @observable.shallow categoryResults = []
  @observable.shallow itemResults = []

  constructor(router) {
    this.router = router
  }

  loadThings(callback = () => {}) {
    if (this.things.length > 0) {
      callback()
    }
    else {
      this.loading = true
      nprogress.inc()

      fetch(`https://api.awesoo.me/things`)
      .then(res => res.json())
      .then(data => {
        // console.log(data);
        this.things = data
        this.flatThings = this.allItems(data)
        this.loading = false

        callback()
        nprogress.done()
      })
    }
  }

  allItems(categories) {
    let result = []

    _each(categories, category => {
      if (category.items) {
        _each(category.items, item => {
          result.push(item)

          if (item.items) {
            _each(item.items, subitem => {
              result.push(subitem)
            })
          }
        })
      }
    })

    return result
  }

  // findRepo(repo) {
  //   for (let thing in this.things) {
  //     for (let item in thing.items) {

  //       if (item.items && item.items.length > 0) {
  //         for (let subitem in item.items) {
  //           if (subitem.full_name === repo) {
  //             return subitem
  //           }
  //         }
  //       }
  //       console.log(item.full_name, repo);
  //       if (item.full_name === repo) {
  //         return item
  //       }
  //     }
  //   }

  //   return false
  // }
}

@remotedev
export class RepoStore {
  @observable loading = false
  @observable.shallow info = {}
  @observable repo = null
  @observable.shallow lastCommit = {}
  @observable readme = null

  constructor(router) {
    this.router = router
  }
}
