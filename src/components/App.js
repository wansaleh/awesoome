import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { Route, Link, NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'
import { Emojione } from 'react-emoji-render'
import cls from 'classnames'
import Fuse from 'fuse.js'
// import _map from 'lodash/map'
import _isEmpty from 'lodash/isEmpty'
// import _debounce from 'lodash/debounce'
import { Helmet } from 'react-helmet'
import ReactPlaceholder from 'react-placeholder'
// import { animateScroll } from 'react-scroll'
// import { slide as Menu } from 'react-burger-menu'
// import windowDimensions from 'react-window-dimensions';
// import timeAgo from 'epoch-timeago';
import TimeAgo from 'react-timeago'

import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import Readme from './Readme'
// import Content from './Content'
// import Testing from './Testing'
import { repo } from '../../github.json'

const fuseOptions = {
  id: 'id',
  shouldSort: true,
  threshold: 0.3,
  location: 0,
  distance: 80,
  maxPatternLength: 32,
  minMatchCharLength: 1,
};

const fuseOptionsCategory = {
  ...fuseOptions,
  keys: [
    'title',
    'items.title'
  ]
}
const fuseOptionsItem = {
  ...fuseOptions,
  keys: [
    'title'
  ]
}

const Home = () => {
  return (
    <div className="home">
      <Emojione svg text=":sunglasses:" />
    </div>
  )
}

@inject('router', 'base')
@withRouter
@observer
export default class App extends Component {
  componentDidMount() {
    this.props.base.loadThings()
    // window.addEventListener('scroll', this.handleScroll.bind(this))
  }

  // handleScroll(e) {
  //   const deb = _debounce(() => {
  //     const top = window.scrollY
  //     this.props.base.showBackToTop = top > 200
  //   }, 500)

  //   deb()
  // }

  highlightCategories() {
    const { things, searchTerm } = this.props.base
    const fuse = new Fuse(things, fuseOptionsCategory)
    const result = fuse.search(searchTerm)
    this.props.base.categoryResults = result
  }

  highlightItems() {
    const { flatThings, searchTerm } = this.props.base
    const fuse = new Fuse(flatThings, fuseOptionsItem)
    const result = fuse.search(searchTerm)
    this.props.base.itemResults = result
  }

  isCategoryFound(id) {
    if (!this.props.base.categoryResults)
      return false
    return this.props.base.categoryResults.includes(id)
  }

  handleSearch(e) {
    this.props.base.searchTerm = e.target.value
    this.highlightCategories()
    this.highlightItems()
  }

  clearSearch = (e) => {
    this.props.base.searchTerm = ''
  }

  // backToTop(e) {
  //   animateScroll.scrollTo(0, { duration: 300 })
  // }

  componentWillUnmount() {
    this.props.base.loading = false
    this.props.base.things = []
    this.props.base.flatThings = []

    this.props.base.searchTerm = ''
    this.props.base.sortType = 'default'

    // window.removeEventListener('scroll', this.handleScroll.bind(this))
  }

  render() {
    const { searchTerm } = this.props.base

    return (
      <div id="outer-container">
        <Helmet titleTemplate="%s - Awesoo.me">
          <title>Home</title>
        </Helmet>

        <main id="page-wrap">
          <Header />

          {/* ROUTE DEFINITIONS */}
          <Route render={({ location, history, match }) => (
            <div className="container">
              <Route exact path="/" component={Home}></Route>

              <div className="row">
                <div className={cls("col-md-3", { searching: searchTerm !== '' })}>
                  <Route path="/:category" component={Sidebar}></Route>
                </div>
                <div className="col-md-9">
                  <Route exact path="/:category/:item/:subitem/:owner/:repo" component={Readme}></Route>
                  <Route exact path="/:category/:owner/:repo" component={Readme}></Route>
                </div>
              </div>
            </div>
          )} ></Route>

          <Footer />
        </main>
      </div>
    )
  }
}
