import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
// import { Emojione } from 'react-emoji-render'
// import Toggle from 'react-toggle'
import { StickyContainer, Sticky } from 'react-sticky'
import Parser from 'html-react-parser'
import _find from 'lodash/find'

// const parseHref = (href) => {
//   const match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
//   return match && {
//     href: href,
//     protocol: match[1],
//     host: match[2],
//     hostname: match[3],
//     port: match[4],
//     pathname: match[5],
//     search: match[6],
//     hash: match[7]
//   }
// }

@inject('router', 'base')
@withRouter
@observer
export default class Category extends Component {
  constructor(props) {
    super(props)
    this.baseState = this.props.base
  }

  get(category) {
    return _find(this.baseState.things, thing => thing.id === category)
  }

  componentDidMount() {
    console.log('cdm: sidebar');
    // const { match } = this.props
    // this.get(match.params.category)
  }

  componentWillReceiveProps(nextProps) {
    console.log('cwrp: sidebar');
    // const { match } = nextProps

    // if (this.props.match.params.category !== nextProps.match.params.category) {
    //   this.get(match.params.category)
    // }
  }

  // componentWillUnmount() {
  //   this.baseState.current = null
  // }

  getLink(repo) {
    const { match } = this.props
    return '/' + match.params.category + '/' + repo
  }

  renderItems(items) {
    if (!items) return null

    return items.map((item, i) =>
      <li key={i}>
        <div className="links">
          <NavLink
            to={this.getLink(item.full_name)}
            activeClassName="active">
            {Parser(item.title)}
          </NavLink>
          <a href={item.url} className="github" target="_blank" rel="noopener noreferrer">
            <i className="fa fa-github" /></a>
        </div>
        {item.items &&
          <ul className="items">
            {this.renderItems(item.items)}
          </ul>
        }
      </li>
    )
  }

  render() {
    const { match } = this.props
    const current = this.get(match.params.category)

    if (!current) return null

    return (
      <StickyContainer className="col-md-3 pb5 lists">
        <Sticky>
          {
            ({ style }) =>
              <div style={style}>
                <h2 className="fw1">
                  {current.title}
                </h2>
                <ul className="items list lh-copy">
                  {this.renderItems(current.items)}
                </ul>
              </div>
          }
        </Sticky>
      </StickyContainer>
    )
  }
}
