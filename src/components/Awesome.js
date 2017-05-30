import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router'
import fetch from 'unfetch'
import nprogress from 'nprogress'
import { Emojione } from 'react-emoji-render'
import TimeAgo from 'timeago-react'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { animateScroll } from 'react-scroll'

import processReadme from './process-readme'
import { token } from '../../github.json'

@inject('router', 'base', 'repo')
@withRouter
@observer
export default class Awesome extends Component {
  constructor(props) {
    super(props)
    this.baseState = this.props.base
    this.repoState = this.props.repo
  }

  load() {
    const repo = this.repoState.repo

    this.repoState.loading = true

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
      this.repoState.readme = body
      this.repoState.loading = false
      nprogress.done()
    })

    // repo information
    nprogress.inc()
    fetch(`https://api.github.com/repos/${repo}`, {
      headers: { 'Authorization': `token ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      this.repoState.info = data
      nprogress.done()
    })

    // commits
    nprogress.inc()
    fetch(`https://api.github.com/repos/${repo}/commits`, {
      headers: { 'Authorization': `token ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      this.repoState.lastCommit = data[0]
      // console.log(this.repoState.lastCommit.commit.author);
      nprogress.done()
    })

  }

  componentDidMount() {
    this.repoState.repo = `${this.props.match.params.owner}/${this.props.match.params.repo}`
    this.baseState.loadThings(this.load.bind(this))
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.owner !== nextProps.match.params.owner ||
      this.props.match.params.repo !== nextProps.match.params.repo)
    {
      this.scrollToTop()

      this.repoState.repo = `${nextProps.match.params.owner}/${nextProps.match.params.repo}`
      this.baseState.loadThings(this.load.bind(this))
    }
  }

  componentWillUnmount() {
    this.repoState.info = {}
    this.repoState.repo = null
    this.repoState.lastCommit = {}
    this.repoState.readme = null
    this.repoState.loading = false
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.repo.readme !== nextProps.repo.readme)
      return true

    if (this.props.match.params.owner !== nextProps.match.params.owner ||
      this.props.match.params.repo !== nextProps.match.params.repo)
      return true

    return false
  }


  scrollToTop() {
    animateScroll.scrollToTop({ duration: 500 });
  }

  render() {
    // document.title

    const { info, repo, lastCommit, readme, loading } = this.repoState

    const ready =
      !loading &&
      (lastCommit && lastCommit.commit) &&
      info &&
      readme

    // console.log(lastCommit);
    return (
      <div className="col-md-9">
        <CSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>

          {ready &&
            <div className="content-card">
              <div className="info">
                <h3 className="repo f6 fw1 ma0">
                  {info.owner && <a href={info.owner.html_url} target="_blank" rel="noopener noreferrer">{info.owner.login}</a>}
                  <span className="v-mid dib mh1">/</span>
                  <a href={info.html_url} target="_blank" rel="noopener noreferrer">{info.name}</a>
                </h3>
                <div className="last-commit f6">
                  <a href={lastCommit.html_url} target="_blank" rel="noopener noreferrer">
                    Last commit&nbsp;
                    <TimeAgo datetime={lastCommit.commit.author.date} />
                  </a>
                  &nbsp;by&nbsp;
                  <a href={lastCommit.author.html_url} target="_blank" rel="noopener noreferrer">
                    {lastCommit.author.login}
                  </a>
                </div>
              </div>

              <div className="description cf">
                {info.homepage &&
                  <a href={info.homepage} target="_blank" rel="noopener noreferrer" className="fr ml3">
                    {info.homepage.replace(/^https?:\/\/(www.)?|\/$/g, '')}
                  </a>
                }
                {' '}
                <Emojione svg text={info.description} />
              </div>

              {processReadme(this.baseState.things, repo, readme)}
            </div>
          }

          {/*<a onClick={this.scrollToTop}>To top</a>*/}

        </CSSTransitionGroup>

      </div>
    );
  }
}