import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import fetch from 'unfetch'
import nprogress from 'nprogress'
import { Emojione } from 'react-emoji-render'
import $ from 'jquery'
import TimeAgo from 'timeago-react'
import HTML2React from 'html2react'

import { isListed, getCategoryFromLink } from '../utils'
import { token } from '../../github.json'

const processReadme = (things, repo, readme) => {
  let body = $(readme)

  // repair awesome links
  body.find('a[href^="https://github.com"]').each((i, el) => {
    let href = $(el).attr('href')

    const category = getCategoryFromLink(things, href)

    if (category !== false) {
      let newHref = href.replace('https://github.com', `/${category.id}`)
      $(el)
        .attr('href', newHref)
        .attr('data-href-processed', true)
    }
  })

  // repair internal links
  body.find('a:not([data-href-processed]):not([href^="http://"]):not([href^="https://"]):not([href^="//"]):not([href^="#"])').each((i, el) => {
    let href = $(el).attr('href')
    if (href.substr(0, 1) === '/')
      href = href.substr(1)

    $(el)
      .attr('href', `https://github.com/${repo}/blob/master/${href}`)
      .attr('target', '_blank')
  })

  // repair img srcs
  body.find('img:not([src^="http://"]):not([src^="https://"]):not([src^="//"])').each((i, el) => {
    let src = $(el).attr('src')
    if (src.substr(0, 1) === '/')
      src = src.substr(1)

    $(el).attr('src', `https://github.com/${repo}/raw/master/${src}`)
  })

  // repair hash links
  body.find('a[href^="#"]').each((i, el) => {
    let origHref = $(el).attr('href').substr(1)
    $(el).attr('href', '#user-content-' + origHref)
  })

  return HTML2React(body.html(), {
    'a': (props) => {
      let { href, ...newProps } = props;

      return <Link {...newProps} to={href} />
    },

    'h1': (props) => {
      let { align, ...newProps } = props;

      let className
      if (align === 'left') {
        className = 'tl'
      }
      if (align === 'center') {
        className = 'tc'
      }
      if (align === 'right') {
        className = 'tr'
      }

      return <h1 {...newProps} className={className} />
    },

    'p': (props) => {
      let { align, ...newProps } = props;

      let className
      if (align === 'left') {
        className = 'tl'
      }
      if (align === 'center') {
        className = 'tc'
      }
      if (align === 'right') {
        className = 'tr'
      }

      return <p {...newProps} className={className} />
    },

    'img': (props) => {
      let { align, ...newProps } = props;

      let className
      if (align === 'left') {
        className = 'fl pr2'
      }
      if (align === 'center') {
        className = 'tc'
      }
      if (align === 'right') {
        className = 'fr pl2'
      }

      return <img {...newProps} className={className} alt="" />
    },
  })
}

@inject('router', 'base', 'repo')
@withRouter
@observer
export default class AwesomeRepo extends Component {
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
      // console.log(data);
    })

    // commits
    fetch(`https://api.github.com/repos/${repo}/commits`, {
      headers: { 'Authorization': `token ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      this.repoState.lastCommit = data[0]
      // console.log(this.repoState.lastCommit);
    })

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
        {!loading &&
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

            {(info && info.description) && <div className="description"><Emojione svg text={info.description} /></div>}

            {/*<div dangerouslySetInnerHTML={{__html: readme}}></div>*/}
            {readme && processReadme(this.baseState.things, fullName, readme)}
          </div>
        }
      </div>
    );
  }
}