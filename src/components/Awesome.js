import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router'
import fetch from 'unfetch'
import nprogress from 'nprogress'
import { Emojione } from 'react-emoji-render'
import TimeAgo from 'timeago-react'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

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

  load(repo) {
    this.repoState.loading = true
    nprogress.inc()

    // repo information
    fetch(`https://api.github.com/repos/${repo}`, {
      headers: { 'Authorization': `token ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      this.repoState.info = data

      // commits
      fetch(`https://api.github.com/repos/${repo}/commits`, {
        headers: { 'Authorization': `token ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        this.repoState.lastCommit = data[0]

        // readme
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
      })
    })
  }

  componentDidMount() {
    this.repoState.fullName = `${this.props.match.params.owner}/${this.props.match.params.repo}`

    this.baseState.load(things => {
      this.load(this.repoState.fullName)
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.owner !== nextProps.match.params.owner ||
      this.props.match.params.repo !== nextProps.match.params.repo)
    {
      this.repoState.fullName = `${nextProps.match.params.owner}/${nextProps.match.params.repo}`

      this.baseState.load(things => {
        this.load(this.repoState.fullName)
      })
    }
  }

  componentWillUnmount() {
    this.repoState.info = null
    this.repoState.fullName = null
    this.repoState.readme = null
    this.repoState.loading = false
  }

  handleHashClick(e) {
    // e.target.href.split('#')[1]
  }

  render() {
    // document.title

    const { info, fullName, lastCommit, readme, loading } = this.repoState

    return (
      <div className="col-md-9">
        <CSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}>

          {(!loading && readme) &&
            <div className="content-card">
              {info &&
                <div className="info">
                  <h3 className="repo f5 fw1 ma0">
                    {/*<i className="fa fa-github v-mid" />&nbsp;*/}
                    <a href={info.owner.html_url} target="_blank" rel="noopener noreferrer">{info.owner.login}</a>
                    <span className="v-mid dib mh1">/</span>
                    <a href={info.html_url} target="_blank" rel="noopener noreferrer">{info.name}</a>
                  </h3>
                  {lastCommit &&
                    <div className="last-commit">
                      Last Commit:&nbsp;
                      <TimeAgo datetime={lastCommit.commit.author.date} />
                      &nbsp;by {lastCommit.commit.author.name}
                    </div>
                  }
                </div>
              }

              {(info && info.description) &&
                <div className="description cf">
                  {info.homepage &&
                    <a href={info.homepage} target="_blank" rel="noopener noreferrer" className="fr pl3 pb3">
                      <i className="fa fa-home"></i>&nbsp;
                      {info.homepage.replace(/^https?:\/\/(www.)?/, '')}
                    </a>
                  }
                  {' '}
                  <Emojione svg text={info.description} />
                </div>
              }

              {/*<div dangerouslySetInnerHTML={{__html: readme}}></div>*/}
              {readme && processReadme(this.baseState.things, fullName, readme)}
            </div>
          }

        </CSSTransitionGroup>
      </div>
    );
  }
}