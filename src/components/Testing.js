import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router'
// import { NavLink } from 'react-router-dom'
// import _some from 'lodash/some'
// import { flattenListing, getListing } from '../utils'


// import categories from './things.json'

@inject('router', 'base')
@withRouter
@observer
export default class Testing extends Component {
  constructor(props) {
    super(props)
    this.baseState = this.props.base
  }

  componentDidMount() {
    this.baseState.load(things => {
      // let test = flattenListing(things)
      // console.log(test);
    })
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
