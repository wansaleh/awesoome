import remotedev from 'mobx-remotedev'
import { observable, action } from 'mobx'
import nprogress from 'nprogress'

@remotedev
export class BaseStore {
  @observable loading = true
  @observable things = []
  @observable searchTerm = ''

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
        this.loading = false

        callback()
        nprogress.done()
      })
    }
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
  @observable info = null
  @observable repo = null
  @observable lastCommit = null
  @observable readme = null
  @observable loading = false

  constructor(router) {
    this.router = router
  }
}
