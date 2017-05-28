import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import _some from 'lodash/some'


import categories from './things.json'

@inject('router', 'base')
@withRouter
@observer
export default class Testing extends Component {
  constructor(props) {
    super(props)
    this.baseState = this.props.base
  }

  isListed(link) {
    const itemWalk = (items) => {
      return _some(items, item => {
        if (item.link === link) {
          return true
        }

        if (item.items) {
          return itemWalk(item.items)
        }

        return false
      })
    }

    return _some(categories, category => {
      return itemWalk(category.items)
    })
  }

  componentDidMount() {
    const testLink = 'https://github.com/sindresorhus/awesome-npm'

    console.log(this.isListed(testLink));
  }

  render() {
    return (
      <div className="col-md-9 content-card">
        {this.baseState.things && this.baseState.things.map((thing, i) =>
          <div key={i}>{thing.title}</div>
        )}
      </div>
    );
  }
}
