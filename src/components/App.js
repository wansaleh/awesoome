import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Route, Switch, Link, NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'
import { Emojione } from 'react-emoji-render'
import cls from 'classnames'

import Category from './Category'
import Awesome from './Awesome'

@inject('router', 'base')
@withRouter
@observer
export default class App extends Component {
  constructor(props) {
    super(props)
    this.baseState = this.props.base
  }

  componentDidMount() {
    this.baseState.load()
  }

  hightlightLinks() {
    const { searchTerm } = this.baseState
  }

  handleSearch(e) {
    this.baseState.searchTerm = e.target.value
    this.hightlightLinks()
  }

  render() {
    const { things, searchTerm } = this.baseState

    return (
      <div className={cls("container pv5", { searching: searchTerm !== '' })}>
        <header>
          <h1 className="f2 fw9 ma0 tracked-tight nl2">
            <Link to="/"><Emojione svg text=":sunglasses: Awesoo.me" /></Link>
          </h1>

          <div className="search">
            <input
              className="form-control"
              type="search" placeholder="Search something awesome..."
              value={searchTerm}
              onInput={this.handleSearch.bind(this)} />
          </div>
        </header>

        <div className="categories">
          <ul className="list mv2 pa0 f4 fw3 nl2 nr2">
            {things && things.map(item =>
              <li className="dib" key={item.id}>
                <NavLink to={`/${item.id}`}
                  className="dib ph2 pv1 mv0"
                  activeClassName="active">
                  {item.title}</NavLink>
              </li>
            )}
          </ul>
        </div>

        <Route render={({ location, history, match }) => (
          <div className="row mt4">

            <Route path="/:category" component={Category} />
            <Route path="/:category/:owner/:repo" component={Awesome} />

          </div>
        )} />

        <footer>
          <p><Emojione svg text="With 💋 from Malaysia 🇲🇾" /></p>
        </footer>
      </div>
    )
  }
}
