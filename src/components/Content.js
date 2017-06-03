import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router'
// import fetch from 'unfetch'
// import nprogress from 'nprogress'
// import { Emojione } from 'react-emoji-render'
// import TimeAgo from 'timeago-react'
// import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
// import { animateScroll } from 'react-scroll'
// import { Helmet } from 'react-helmet'

import ReactModal from 'react-modal'

// import processReadme from '../utils/readme'
// import { token } from '../../github.json'

@inject('router', 'base', 'repo')
@withRouter
@observer
export default class Content extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showModal: true
    }

  }

  load() {
    const repo = this.props.repo.repo

    // // readme
    // nprogress.inc()
    // fetch(`https://api.github.com/repos/${repo}/readme`, {
    //   headers: {
    //     'Authorization': `token ${token}`,
    //     'Accept': 'application/vnd.github.v3.html'
    //   }
    // })
    // .then(res => res.text())
    // .then(body => {
    //   this.props.repo.readme = body
    //   this.props.repo.loading = false
    //   nprogress.done()
    // })
  }

  componentDidMount() {
    this.props.repo.repo = `${this.props.match.params.owner}/${this.props.match.params.repo}`
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.owner !== nextProps.match.params.owner ||
      this.props.match.params.repo !== nextProps.match.params.repo)
    {
      this.props.repo.repo = `${nextProps.match.params.owner}/${nextProps.match.params.repo}`
    }
  }

  // componentWillUnmount() {
  //   this.props.repo.info = {}
  //   this.props.repo.repo = null
  //   this.props.repo.lastCommit = {}
  //   this.props.repo.readme = null
  //   this.props.repo.loading = false
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.repo.readme !== nextProps.repo.readme)
  //     return true

  //   if (this.props.match.params.owner !== nextProps.match.params.owner ||
  //     this.props.match.params.repo !== nextProps.match.params.repo)
  //     return true

  //   return false
  // }

  handleCloseModal () {
    this.setState({ showModal: false });
  }

  render() {
    const { info, repo, lastCommit, readme, loading } = this.props.repo

    // console.log(lastCommit);
    return (
      <ReactModal
        isOpen={this.state.showModal}
        contentLabel="Minimal Modal Example"
        className="content-modal"
        overlayClassName="overlay"
      >
        <button onClick={this.handleCloseModal.bind(this)}>Close Modal</button>
      </ReactModal>
    );
  }
}