import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router'
// import { NavLink } from 'react-router-dom'
import { StickyContainer, Sticky } from 'react-sticky'
// import Parser from 'html-react-parser'
// import _find from 'lodash/find'
// import _filter from 'lodash/filter'
// import _orderBy from 'lodash/orderBy'
// import _includes from 'lodash/includes'
import cls from 'classnames'
// import Dot from './Dot'
// import { daysSinceLastPush } from '@/utils/misc'

import SidebarContents from './SidebarContents'

// const capitalizeFirstLetter = (string) => {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// }

@inject('router', 'base')
@withRouter
@observer
export default class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.sortTypes = ['title', 'date', 'stars']
  }

  render() {
    // const btnClass = "btn btn-sm btn-outline-secondary BtnGroup-item"

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

                <SidebarContents />

              </div>
          }
        </Sticky>
      </StickyContainer>
    )
  }
}
