import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import { StickyContainer, Sticky } from 'react-sticky'
// import Parser from 'html-react-parser'
import _find from 'lodash/find'
import _filter from 'lodash/filter'
import _orderBy from 'lodash/orderBy'
import _includes from 'lodash/includes'
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
    this.sortTypes = ['title', 'date', 'stars']
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

  getLink(item) {
    const { match } = this.props

    // if (parentTitle)
    //   return `/${match.params.category}/${parentTitle}/${repo}`

    return `/${match.params.category}/${item.id}`
    // return '/' + match.params.category + '/' + repo
  }

  isCategoryFound(id) {
    if (!this.props.base.categoryResults)
      return false
    return this.props.base.categoryResults.includes(id)
  }

  isItemFound(id) {
    const { itemResults } = this.props.base

    if (!itemResults)
      return false

    return itemResults.includes(id)
  }

  handleSort(sortType) {
    if (this.props.base.sortType === sortType) {
      this.props.base.sortType = 'default'
    }
    else {
      this.props.base.sortType = sortType
    }
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

  renderItems(items, parentTitle = null) {
    const { searchTerm, itemResults } = this.props.base

    if (!items) return null

    items = _filter(items, item => {
      if (!searchTerm || itemResults.length === 0)
        return true

      return _includes(itemResults, item.id)
    })

    return this.sortItems(items).map((item, i) => {
      return (
        <li key={i} data-id={item.id}>

          <div className={cls("links")} data-id={item.id}>

            <NavLink
              to={this.getLink(item)}
              className={cls("link")}
              activeClassName="active">

              <span className="title" dangerouslySetInnerHTML={{__html: item.title}} />

              {/*<span className="stars">
                {item.stargazers}&nbsp;
                <i className="fa fa-star"></i>
              </span>*/}

              <Dot date={item.last_commit} />

            </NavLink>

            <a href={item.url} className="github" target="_blank" rel="noopener noreferrer">
              <i className="fa fa-github" />
            </a>

          </div>

          {item.items &&
            <ul className="items">
              {this.renderItems(item.items, item.title)}
            </ul>
          }

        </li>
      )
    })
  }

  render() {
    const { match } = this.props
    const { things, sortType, searchTerm } = this.props.base
    const current = this.get(match.params.category)

    if (!current) return null

    const btnClass = "btn btn-sm btn-outline-secondary BtnGroup-item"

    return (
      <StickyContainer className={cls("sidebar")}>
        <Sticky>
          {
            ({ style, isSticky }) =>
              <div style={style} className={cls("sidebar-sticky", { sticky: isSticky })}>
                {/* <div className="categories-2">
                  <h2>
                    Category
                    <span className="show-toggle">Show All</span>
                  </h2>

                  {things &&
                    <ul className="list">
                      {things.map(item => {
                        if (searchTerm && !this.isCategoryFound(item.id))
                          return null

                        return (
                          <li
                            className=""
                            key={item.id}
                            data-id={item.id}>
                            <NavLink to={`/${item.id}`}
                              activeClassName="active">
                              {item.title}
                            </NavLink>
                          </li>
                        )
                      })}
                    </ul>
                  }
                </div> */}

                {/* <div className="sort">
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
                </div> */}

                <h2>
                  {current.title}
                </h2>

                <ul className="items list lh-copy">
                  {this.renderItems(current.items)}
                </ul>

                <div className="legends">
                  <span className="legend"><Dot className="hot" /> {'<'} 1 week</span>
                  <span className="legend"><Dot className="new" /> {'<'} 1 month</span>
                  <span className="legend"><Dot className="old" /> {'>'} 6 months </span>
                </div>

              </div>
          }
        </Sticky>
      </StickyContainer>
    )
  }
}
