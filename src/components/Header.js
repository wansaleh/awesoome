import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { Route, Link, NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'
import { Emojione } from 'react-emoji-render'
import cls from 'classnames'
import Fuse from 'fuse.js'
import _isEmpty from 'lodash/isEmpty'
import { Helmet } from 'react-helmet'
import ReactPlaceholder from 'react-placeholder'
import TimeAgo from 'react-timeago'

import Sidebar from './Sidebar'
import Readme from './Readme'
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
export default class Header extends Component {
  componentDidMount() {
    this.props.base.loadThings()
  }

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
    const { things, searchTerm } = this.props.base

    return (
      <Fragment>
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
      </Fragment>
    )
  }
}
