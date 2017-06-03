import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import { StickyContainer, Sticky } from 'react-sticky'
// import Parser from 'html-react-parser'
import _find from 'lodash/find'
import _orderBy from 'lodash/orderBy'
import cls from 'classnames'
import Dot from './Dot'
// import { daysSinceLastPush } from '@/utils/misc'

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

@inject('router', 'base')
@withRouter
@observer
export default class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.sortTypes = ['title', 'date', 'stars', 'default']
  }

  get(category) {
    return _find(this.props.base.things, thing => thing.id === category)
  }

  // componentDidMount() {
  //   console.log('cdm: sidebar');
  //   // const { match } = this.props
  //   // this.get(match.params.category)
  // }

  // componentWillReceiveProps(nextProps) {
  //   console.log('cwrp: sidebar');
  //   // const { match } = nextProps

  //   // if (this.props.match.params.category !== nextProps.match.params.category) {
  //   //   this.get(match.params.category)
  //   // }
  // }

  componentWillUnmount() {
    this.props.base.current = null
  }

  getLink(repo) {
    const { match } = this.props
    return '/' + match.params.category + '/' + repo
  }

  isItemFound(id) {
    const { itemResults } = this.props.base

    if (!itemResults)
      return false

    return itemResults.includes(id)
  }

  handleSort(sortType) {
    this.props.base.sortType = sortType
  }

  sortItems(items) {
    const { sortType } = this.props.base

    let sortedItems = items

    switch (sortType) {
      case 'title':
        sortedItems = _orderBy(sortedItems, ['title'])
        break

      case 'date':
        sortedItems = _orderBy(sortedItems, ['last_commit'], 'desc')
        break

      case 'stars':
        sortedItems = _orderBy(sortedItems, ['stargazers'], 'desc')
        break

      case 'default':
      default:
        break
    }

    return sortedItems
  }

  renderItems(items) {
    if (!items) return null

    return this.sortItems(items).map((item, i) =>
      <li key={i} data-id={item.id}>

        <div className={cls("links", { highlight: this.isItemFound(item.id) })} data-id={item.id}>

          <NavLink
            to={this.getLink(item.id)}
            className={cls("link")}
            activeClassName="active">

            <span className="title" dangerouslySetInnerHTML={{__html: item.title}} />

            <span className="stars">
              {item.stargazers}&nbsp;
              <i className="fa fa-star"></i>
            </span>

            <Dot date={item.last_commit} />

          </NavLink>

          <a href={item.url} className="github" target="_blank" rel="noopener noreferrer">
            <i className="fa fa-github" />
          </a>

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
    const { sortType } = this.props.base
    const current = this.get(match.params.category)

    if (!current) return null

    const btnClass = "btn btn-sm btn-outline-secondary BtnGroup-item"

    return (
      <StickyContainer className={cls("sidebar")}>
        <Sticky>
          {
            ({ style, isSticky }) =>
              <div style={style} className={cls({ sticky: isSticky })}>
                <div className="sort">
                  <div className="BtnGroup btn-group">
                    {this.sortTypes.map((type, i) =>
                      <button
                        key={i}
                        type="button"
                        className={cls(btnClass, { active: type === sortType })}
                        onClick={this.handleSort.bind(this, type)}>
                        {capitalizeFirstLetter(type)}
                      </button>
                    )}
                  </div>
                </div>

                <div className="legends">
                  <span className="legend"><Dot className="hot" /> {'<'} 1 week</span>
                  <span className="legend"><Dot className="new" /> {'<'} 1 month</span>
                  <span className="legend"><Dot className="old" /> {'>'} 6 months </span>
                </div>

                <h2>
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
