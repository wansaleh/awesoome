import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Route, Link, NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'
import { Emojione } from 'react-emoji-render'
import cls from 'classnames'
import Fuse from 'fuse.js'
// import _map from 'lodash/map'
import _isEmpty from 'lodash/isEmpty'
import _debounce from 'lodash/debounce'
import { Helmet } from 'react-helmet'
import ReactPlaceholder from 'react-placeholder'
import { animateScroll } from 'react-scroll'

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
  state = {
    showBackToTop: false
  }

  // constructor(props) {
  //   super(props)
  // }

  componentDidMount() {
    this.props.base.loadThings()
    // window.addEventListener('scroll', this.handleScroll.bind(this))
  }

  // handleScroll(e) {
  //   const deb = _debounce(() => {
  //     const top = window.scrollY
  //     this.setState({ showBackToTop: top > 500 })
  //   }, 100)

  //   deb()
  // }

  hightlightCategories() {
    const { things, searchTerm } = this.props.base
    const fuse = new Fuse(things, fuseOptionsCategory)
    const result = fuse.search(searchTerm)
    this.props.base.categoryResults = result
  }

  hightlightItems() {
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
    this.hightlightCategories()
    this.hightlightItems()
  }

  backToTop(e) {
    animateScroll.scrollTo(0, { duration: 300 })
  }

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
      <div>
        <Helmet titleTemplate="%s - Awesoo.me">
          <title>Home</title>
        </Helmet>

        <div className="nav">
          <header className="container">
            <h1>
              <Link to="/"><Emojione svg text=":sunglasses: Awesoo.me" /></Link>
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
            <ReactPlaceholder type='text' rows={6} ready={!_isEmpty(things)} color="#e1e4e8">
              {things &&
                <ul className="list">
                  {things.map(item =>
                    <li
                      className={cls("dib", { highlight: this.isCategoryFound(item.id) })}
                      key={item.id}
                      data-id={item.id}>
                      <NavLink to={`/${item.id}`}
                        activeClassName="active">
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

        {/*<div>
          {categoryResults && categoryResults.map((result, i) =>
            <span key={i} style={{marginRight: '1rem'}}>{result}</span>
          )}
        </div>*/}

        <Route render={({ location, history, match }) => (
          <div className="container">
            <Route exact path="/" component={Home} />
            <div className="row mt4">
              <div className={cls("col-md-3 pb5 lists", { searching: searchTerm !== '' })}>
                <Route path="/:category" component={Sidebar} />
              </div>
              <div className="col-md-9">
                <Route exact path="/:category/:item/:subitem/:owner/:repo" component={Readme} />
                <Route exact path="/:category/:owner/:repo" component={Readme} />
              </div>
              {/*<Route path="/:category/:owner/:repo/:content" component={Content} />*/}
            </div>
          </div>
        )} />

        <footer className="container">
          <p>
            From <a href={`https://github.com/${repo}`} target="_blank" rel="noopener noreferrer">Awesome List</a>
            {' / '}
            <a href="https://github.com/wansaleh/awesoome" target="_blank" rel="noopener noreferrer">Source</a>
            {' / '}
            <Emojione svg text="With 💋 from 🇲🇾" />
          </p>
        </footer>

        <a
          className={cls("back-to-top", { 'show': this.state.showBackToTop })}
          href="#" onClick={this.backToTop.bind(this)}>
          <svg viewBox="0 0 129 129" enableBackground="new 0 0 129 129">
            <g>
              <path d="m121.4,61.6l-54-54c-0.7-0.7-1.8-1.2-2.9-1.2s-2.2,0.5-2.9,1.2l-54,54c-1.6,1.6-1.6,4.2 0,5.8 0.8,0.8 1.8,1.2 2.9,1.2s2.1-0.4 2.9-1.2l47-47v98.1c0,2.3 1.8,4.1 4.1,4.1s4.1-1.8 4.1-4.1v-98.1l47,47c1.6,1.6 4.2,1.6 5.8,0s1.5-4.2 1.42109e-14-5.8z"/>
            </g>
          </svg>
        </a>
      </div>
    )
  }
}
