import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router'
import { Emojione } from 'react-emoji-render'
import cls from 'classnames'
import TimeAgo from 'react-timeago'

import { repo } from '../../github.json'

import s from './Footer.module.scss'

@inject('router', 'base')
@withRouter
@observer
export default class Footer extends Component {
  render() {
    return (
      <footer className={cls("container", s.footer)}>
        <p>
          Created from the <a href={`https://github.com/${repo}`} target="_blank" rel="noopener noreferrer">Awesome List</a>
          {' '}
          by <a href={`https://github.com/sindresorhus`} target="_blank" rel="noopener noreferrer">sindresorhus</a>
          {' / '}
          <a href="https://github.com/wansaleh/awesoome" target="_blank" rel="noopener noreferrer">Source</a>
          {' / '}
          <Emojione svg text="With 💋 from 🇲🇾" />
          {' / '}
          {this.props.base.info &&
            <span>Last fetch: <TimeAgo date={this.props.base.info.last_updated} /></span>
          }
        </p>

          {/* <a
            className={cls("back-to-top", { 'show': this.props.base.showBackToTop })}
            href="#" onClick={this.backToTop.bind(this)}>
            <svg viewBox="0 0 129 129" enableBackground="new 0 0 129 129">
              <g>
                <path d="m121.4,61.6l-54-54c-0.7-0.7-1.8-1.2-2.9-1.2s-2.2,0.5-2.9,1.2l-54,54c-1.6,1.6-1.6,4.2 0,5.8 0.8,0.8 1.8,1.2 2.9,1.2s2.1-0.4 2.9-1.2l47-47v98.1c0,2.3 1.8,4.1 4.1,4.1s4.1-1.8 4.1-4.1v-98.1l47,47c1.6,1.6 4.2,1.6 5.8,0s1.5-4.2 1.42109e-14-5.8z"/>
              </g>
            </svg>
          </a> */}
      </footer>
    )
  }
}
