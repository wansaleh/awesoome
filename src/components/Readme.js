import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router'
import fetch from 'unfetch'
import nprogress from 'nprogress'
import { Emojione } from 'react-emoji-render'
import timeago from 'timeago.js'
// import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { animateScroll } from 'react-scroll'
import { Helmet } from 'react-helmet'
import ReactPlaceholder from 'react-placeholder'
import _isEmpty from 'lodash/isEmpty'
// import cls from 'classnames'

import Dot from './Dot'
// import { daysSinceLastPush } from '@/utils/misc'
import processReadme from '../utils/readme'
import { token } from '../../github.json'

const Placeholder = ({ rows, ready }) => {
  return (
    <ReactPlaceholder type='text' rows={rows} ready={ready} color="#e1e4e8">
      <div></div>
    </ReactPlaceholder>
  )
}

@inject('router', 'base', 'repo')
@withRouter
@observer
export default class Readme extends Component {
  // constructor(props) {
  //   super(props)
  //   this.baseState = this.props.base
  //   this.repoState = this.props.repo
  // }

  load() {
    const repo = this.props.repo.repo

    this.props.repo.loading = true

    // readme
    nprogress.inc()
    fetch(`https://api.github.com/repos/${repo}/readme`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3.html'
      }
    })
    .then(res => res.text())
    .then(body => {
      this.props.repo.readme = body
      this.props.repo.loading = false
      nprogress.done()
    })

    // repo information
    nprogress.inc()
    fetch(`https://api.github.com/repos/${repo}`, {
      headers: { 'Authorization': `token ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      this.props.repo.info = data
      nprogress.done()
    })

    // commits
    nprogress.inc()
    fetch(`https://api.github.com/repos/${repo}/commits?per_page=1`, {
      headers: { 'Authorization': `token ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      this.props.repo.lastCommit = data[0]
      // console.log(this.props.repo.lastCommit.commit.author);
      nprogress.done()
    })

  }

  componentDidMount() {
    this.props.repo.repo = `${this.props.match.params.owner}/${this.props.match.params.repo}`
    this.props.base.loadThings(this.load.bind(this))
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.owner !== nextProps.match.params.owner ||
      this.props.match.params.repo !== nextProps.match.params.repo)
    {
      this.scrollToTop()

      this.props.repo.repo = `${nextProps.match.params.owner}/${nextProps.match.params.repo}`
      this.props.base.loadThings(this.load.bind(this))
    }
  }

  componentWillUnmount() {
    this.props.repo.info = {}
    this.props.repo.repo = null
    this.props.repo.lastCommit = {}
    this.props.repo.readme = null
    this.props.repo.loading = false
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // if (this.props.repo.readme !== nextProps.repo.readme)
  //   //   return true

  //   if (this.props.match.params.owner !== nextProps.match.params.owner ||
  //     this.props.match.params.repo !== nextProps.match.params.repo)
  //     return true

  //   return false
  // }

  scrollToTop() {
    animateScroll.scrollToTop({ duration: 500 });
  }

  render() {
    const { router } = this.props
    const { info, repo, lastCommit, readme, loading } = this.props.repo

    const ready = Boolean(
      !loading &&
      (!_isEmpty(lastCommit) && lastCommit.commit) &&
      !_isEmpty(info) &&
      !_isEmpty(readme))

    return (
      <Fragment>
        {info &&
          <Helmet>
            <title>{info.name}</title>
            {info.description && <meta name="description" content={info.description} />}
          </Helmet>
        }

        <div className="info">
          <Placeholder rows={1} ready={ready} />
          {ready &&
            <div>
              <h3 className="repo">
                <span className="stars">
                  <i className="fa fa-star"></i>&nbsp;
                  {info.stargazers_count}
                </span>

                {' '}

                {info.owner && <a href={info.owner.html_url} target="_blank" rel="noopener noreferrer">{info.owner.login}</a>}
                {' / '}
                <a href={info.html_url} target="_blank" rel="noopener noreferrer">{info.name}</a>
              </h3>

              <div className="last-commit">
                <Dot date={lastCommit.commit.author.date} />
                Last commit&nbsp;
                <a href={lastCommit.html_url} target="_blank" rel="noopener noreferrer">
                  {timeago().format(lastCommit.commit.author.date)}
                </a>
                &nbsp;by&nbsp;
                <a href={lastCommit.author.html_url} target="_blank" rel="noopener noreferrer">
                  {lastCommit.author.login}
                </a>
              </div>
            </div>
          }
        </div>

        <div className="readme">
          <Placeholder rows={40} ready={ready} />
          {ready &&
            <div>

              {info.description &&
                <div className="description">
                  {info.homepage &&
                    <a className="homepage" href={info.homepage} target="_blank" rel="noopener noreferrer">
                      {info.homepage.replace(/^https?:\/\/(www.)?|\/$/g, '')}
                    </a>
                  }

                  <Emojione svg text={info.description} />
                </div>
              }

              {processReadme(this.props.base.things, repo, readme, router)}

            </div>
          }
        </div>
      </Fragment>
    );
  }
}