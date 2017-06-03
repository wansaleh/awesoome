import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Route, Link, NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'
import { Emojione } from 'react-emoji-render'
import cls from 'classnames'
import Fuse from 'fuse.js'
import _map from 'lodash/map'
import _isEmpty from 'lodash/isEmpty'
import { Helmet } from 'react-helmet'
import ReactPlaceholder from 'react-placeholder'

import Sidebar from './Sidebar'
import Readme from './Readme'
// import Content from './Content'
// import Testing from './Testing'
import { repo } from '../../github.json'

const fuseOptions = {
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
  // constructor(props) {
  //   super(props)
  // }

  componentDidMount() {
    this.props.base.loadThings()
  }

  hightlightCategories() {
    const { things, searchTerm } = this.props.base
    const fuse = new Fuse(things, fuseOptionsCategory)
    const result = fuse.search(searchTerm)
    this.props.base.categoryResults = _map(result, 'id');
  }

  hightlightItems() {
    const { flatThings, searchTerm } = this.props.base
    const fuse = new Fuse(flatThings, fuseOptionsItem)
    const result = fuse.search(searchTerm)
    this.props.base.itemResults = _map(result, 'id');
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

  componentWillUnmount() {
    this.props.base.loading = false
    this.props.base.things = []
    this.props.base.flatThings = []

    this.props.base.searchTerm = ''
    this.props.base.sortType = 'default'
    this.props.base.categoryResults = []
    this.props.base.itemResults = []
  }

  render() {
    const { things, searchTerm, categoryResults } = this.props.base

    return (
      <div className="container">
        <Helmet titleTemplate="%s - Awesoo.me">
          <title>Home</title>
        </Helmet>

        <header>
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

        <div className={cls("categories", { searching: searchTerm !== '' })}>
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
                    </NavLink>
                  </li>
                )}
              </ul>
            }
          </ReactPlaceholder>
        </div>

        {/*<div>
          {categoryResults && categoryResults.map((result, i) =>
            <span key={i} style={{marginRight: '1rem'}}>{result}</span>
          )}
        </div>*/}

        <Route render={({ location, history, match }) => (
          <div>
            <Route exact path="/" component={Home} />
            <div className="row mt4">
              <div className={cls("col-md-3 pb5 lists", { searching: searchTerm !== '' })}>
                <Route path="/:category" component={Sidebar} />
              </div>
              <div className="col-md-9">
                <Route path="/:category/:owner/:repo" component={Readme} />
              </div>
              {/*<Route path="/:category/:owner/:repo/:content" component={Content} />*/}
            </div>
          </div>
        )} />

        <footer>
          <p>
            From <a href={`https://github.com/${repo}`} target="_blank" rel="noopener noreferrer">Awesome List</a>
            {' / '}
            <a href="https://github.com/wansaleh/awesoome" target="_blank" rel="noopener noreferrer">Source</a>
            {' / '}
            <Emojione svg text="With 💋 from 🇲🇾" />
          </p>
        </footer>
      </div>
    )
  }
}
