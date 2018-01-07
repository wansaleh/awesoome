import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router'
import { StickyContainer, Sticky } from 'react-sticky'
import cls from 'classnames'

import SidebarContents from './SidebarContents'

@inject('router', 'base')
@withRouter
@observer
export default class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.sortTypes = ['title', 'date', 'stars']
  }

  render() {
    return (
      <StickyContainer className={cls("sidebar")}>
        <Sticky>
          {
            ({ style, isSticky }) =>
              <div style={style} className={cls("sidebar-sticky", { sticky: isSticky })}>
                 <SidebarContents />
              </div>
          }
        </Sticky>
      </StickyContainer>
    )
  }
}
