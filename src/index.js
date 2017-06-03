import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'mobx-react'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import { Router } from 'react-router-dom'

import App from '@/components/App'

import '@/styles/index.scss'

import { BaseStore, RepoStore } from '@/stores'

// if (process.env.NODE_ENV !== 'production') {
//   const { whyDidYouUpdate } = require('why-did-you-update')
//   whyDidYouUpdate(React)
// }

const browserHistory = createBrowserHistory()
const routerStore = new RouterStore()

const stores = {
  router: routerStore,
  base: new BaseStore(routerStore),
  repo: new RepoStore(routerStore),
}

const history = syncHistoryWithStore(browserHistory, routerStore)

const render = Component => {
  ReactDOM.render(
    <Provider {...stores}>
      <Router history={history}>
        <AppContainer>
          <Component />
        </AppContainer>
      </Router>
    </Provider>,

    document.getElementById('app')
  )
}

render(App)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('@/components/App', () => render(App))
}
