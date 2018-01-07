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

import Sidebar from './Sidebar'
import Readme from './Readme'
// import Content from './Content'
// import Testing from './Testing'
import { repo } from '../../github.json'
// import SidebarContents from './SidebarContents';

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
    this.props.base.categoryResults = []
    this.props.base.itemResults = []

    // window.removeEventListener('scroll', this.handleScroll.bind(this))
  }

  render() {
    const { things, searchTerm, categoryResults } = this.props.base

    return (
      <div id="outer-container">
        <Helmet titleTemplate="%s - Awesoo.me">
          <title>Home</title>
        </Helmet>

        {/* <Menu
          pageWrapId="page-wrap"
          outerContainerId="outer-container"
          burgerButtonClassName={cls({ show: this.props.base.showBurger })}
        >
          <Route path="/:category" component={SidebarContents}></Route>
        </Menu> */}

        <main id="page-wrap">
          <div className="nav">
            <header className="container">
              <h1>
                <Link to="/" onClick={this.clearSearch}><Emojione svg text=":sunglasses: Awesoo.me" /></Link>
              </h1>

              <div className="search">
                <input
                  className="form-control"
                  type="search" placeholder="Search something awesome..."
                  value={searchTerm}
                  onChange={this.handleSearch.bind(this)} />
              </div>
            </header>

            <div className={cls("container categories", { searching: searchTerm !== '' })}>
              <ReactPlaceholder type='text' rows={1} ready={!_isEmpty(things)} color="#e1e4e8">
                {things &&
                  <ul className="list">
                    {things.map(item =>
                      <li
                        className={cls("dib", { highlight: this.isCategoryFound(item.id) })}
                        key={item.id}
                        data-id={item.id}>
                        <NavLink to={`/${item.id}`}
                          activeClassName="active"
                          disabled={searchTerm !== '' && !this.isCategoryFound(item.id)}
                        >
                          {item.title}
                          {/* {this.isCategoryFound(item.id) && <span className="result-count">10</span>} */}
                        </NavLink>
                      </li>
                    )}
                  </ul>
                }
              </ReactPlaceholder>
            </div>
          </div>

          {/* ROUTE DEFINITIONS */}
          <Route render={({ location, history, match }) => (
            <div className="container">
              <Route exact path="/" component={Home}></Route>

              <div className="row">
                <div className={cls("col-md-3 lists", { searching: searchTerm !== '' })}>
                  <Route path="/:category" component={Sidebar}></Route>
                </div>
                <div className="col-md-9">
                  <Route exact path="/:category/:item/:subitem/:owner/:repo" component={Readme}></Route>
                  <Route exact path="/:category/:owner/:repo" component={Readme}></Route>
                </div>
                {/*<Route path="/:category/:owner/:repo/:content" component={Content} />*/}
              </div>
            </div>
          )} ></Route>

          <footer className="container">
            <p>
              Created from the <a href={`https://github.com/${repo}`} target="_blank" rel="noopener noreferrer">Awesome List</a>
              {' '}
              by <a href={`https://github.com/sindresorhus`} target="_blank" rel="noopener noreferrer">sindresorhus</a>
              {' / '}
              <a href="https://github.com/wansaleh/awesoome" target="_blank" rel="noopener noreferrer">Source</a>
              {' / '}
              <Emojione svg text="With 💋 from 🇲🇾" />
              {' / '}
              {this.props.base.info &&
                <span>Last fetch: <TimeAgo date={this.props.base.info.last_updated} /></span>
              }
            </p>
          </footer>

          {/* <a
            className={cls("back-to-top", { 'show': this.props.base.showBackToTop })}
            href="#" onClick={this.backToTop.bind(this)}>
            <svg viewBox="0 0 129 129" enableBackground="new 0 0 129 129">
              <g>
                <path d="m121.4,61.6l-54-54c-0.7-0.7-1.8-1.2-2.9-1.2s-2.2,0.5-2.9,1.2l-54,54c-1.6,1.6-1.6,4.2 0,5.8 0.8,0.8 1.8,1.2 2.9,1.2s2.1-0.4 2.9-1.2l47-47v98.1c0,2.3 1.8,4.1 4.1,4.1s4.1-1.8 4.1-4.1v-98.1l47,47c1.6,1.6 4.2,1.6 5.8,0s1.5-4.2 1.42109e-14-5.8z"/>
              </g>
            </svg>
          </a> */}
        </main>
      </div>
    )
  }
}
