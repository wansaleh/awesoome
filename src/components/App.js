import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Route, Link, NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'
import { Emojione } from 'react-emoji-render'
import cls from 'classnames'
import Fuse from 'fuse.js'
import _map from 'lodash/map'
// import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

import Category from './Category'
import Awesome from './Awesome'
// import Testing from './Testing'

// const { InputFilter, FilterResults } = fuzzyFilterFactory();

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
    // 'title',
    'items.title'
  ]
}
const fuseOptionsItem = {
  ...fuseOptions,
  keys: [
    'title'
  ]
}

@inject('router', 'base')
@withRouter
@observer
export default class App extends Component {
  constructor(props) {
    super(props)
    this.baseState = this.props.base
  }

  componentDidMount() {
    this.baseState.loadThings()
  }

  hightlightCategories() {
    const { things, searchTerm } = this.baseState
    const fuse = new Fuse(things, fuseOptionsCategory)
    const result = fuse.search(searchTerm)
    this.baseState.categoryResults = _map(result, 'id');
  }

  hightlightItems() {
    const { flatThings, searchTerm } = this.baseState
    const fuse = new Fuse(flatThings, fuseOptionsItem)
    const result = fuse.search(searchTerm)
    this.baseState.itemResults = _map(result, 'id');
  }

  isCategoryFound(id) {
    if (!this.baseState.categoryResults)
      return false
    return this.baseState.categoryResults.includes(id)
  }

  handleSearch(e) {
    this.baseState.searchTerm = e.target.value
    this.hightlightCategories()
    this.hightlightItems()
  }

  render() {
    const { things, searchTerm } = this.baseState

    return (
      <div className="container pv5">
        <header>
          <h1 className="f2 fw9 ma0 tracked-tight nl2">
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
          <ul className="list mv2 pa0 f3 fw3 nl2 nr2">
            {things && things.map(item =>
              <li className="dib" key={item.id}>
                <NavLink to={`/${item.id}`}
                  data-id={item.id}
                  className={cls("dib ph2 pv1 mv0", { highlight: this.isCategoryFound(item.id) })}
                  activeClassName="active">
                  {item.title}</NavLink>
              </li>
            )}
          </ul>
        </div>

        {/*<div>
          {categoryResults && categoryResults.map((result, i) =>
            <span key={i}>{result}&nbsp;</span>
          )}
        </div>*/}

        <Route render={({ location, history, match }) => (
          <div className="row mt4">
            <Route exact path="/" render={() =>
                <div className="home">
                  <Emojione svg text=":sunglasses:" />
                </div>
            } />
            <Route path="/:category" component={Category} />
            <Route path="/:category/:owner/:repo" component={Awesome} />
          </div>
        )} />

        <footer>
          <p>
            <Emojione svg text="With 💋 from 🇲🇾" />.
            {' '}
            <a href="https://github.com/wansaleh/awesoome" target="_blank" rel="noopener noreferrer">
              Source Code.</a>
          </p>
        </footer>
      </div>
    )
  }
}
