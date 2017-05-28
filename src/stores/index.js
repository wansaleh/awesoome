import remotedev from 'mobx-remotedev'
import { observable, action } from 'mobx'
import fetch from 'unfetch'
import nprogress from 'nprogress'

@remotedev
export class BaseStore {
  @observable loading = true
  @observable things = []
  @observable current = null
  @observable searchTerm = ''

  constructor(router) {
    this.router = router
  }

  @action load(callback = () => {}) {
    if (this.things && this.things.length > 0) {
      callback(this.things)
      return false
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

        callback(this.things)
        nprogress.done()
      })
    }
  }
}

@remotedev
export class RepoStore {
  @observable info = null
  @observable lastCommit = null
  @observable fullName = null
  @observable readme = null
  @observable loading = false

  constructor(router) {
    this.router = router
  }
}
