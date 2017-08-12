import React from 'react'
import $ from 'jquery'
import Parser from 'html-react-parser'
import domToReact from 'html-react-parser/lib/dom-to-react';
import { Link } from 'react-router-dom'
import { animateScroll } from 'react-scroll'
import _endsWith from 'lodash/endsWith'

import { getCategoryFromUrl } from './misc'

const HashLink = (props) => {
  const handleScroll = (e) => {
    try {
      const hash = e.target.hash.substr(1)
      const heading = $(`#user-content-${hash}, [name="user-content-${hash}"`).parent()
      const top = heading.offset().top
      window.scroll(0, top - 10)
      // const pos = document.getElementById('user-content-' + e.target.hash.substr(1)).getBoundingClientRect()
      // animateScroll.scrollTo(top - 10, { duration: 700 })
      // Velocity(heading[0], 'scroll', { duration: 1000, easing: 'ease' });
    }
    catch (e) {}
  }

  return (
    <a {...props} onClick={handleScroll} />
  )
}

export default (things, repo, readme, router) => {

  if (!readme) return null

  // console.log('processing readme');

  // repair class attributes
  readme = readme.replace(/class=["']([a-zA-Z0-9:;\.\s\(\)\-\,]*)["']/, 'className="$1"')

  let body = $(readme)

  // repair awesome links
  body.find('a[href^="https://github.com"]').each((i, el) => {
    let href = $(el).attr('href')

    const category = getCategoryFromUrl(things, href)

    if (category !== false) {
      let newHref = href.replace('https://github.com', `/${category.id}`)
      $(el)
        .attr('href', newHref)
        .attr('data-processed', true)
        .attr('data-internal-link', true)
    }
  })

  // repair internal links
  body.find('a:not([data-internal-link]):not([href^="http://"]):not([href^="https://"]):not([href^="//"]):not([href^="#"])').each((i, el) => {
    let href = $(el).attr('href')

    if (!href) return false

    if (href.substr(0, 1) === '/')
      href = href.substr(1)

    $(el)
      .attr('href', `https://github.com/${repo}/blob/master/${href}`)
      .attr('target', '_blank')
      .attr('data-processed', true)
      .attr('data-github-raw', true)
  })

  // repair hash links
  body.find('a[href^="#"]:not(.anchor)').each((i, el) => {
    // let href = $(el).attr('href').substr(1)

    $(el)
      // .attr('href', '#user-content-' + href)
      .attr('data-processed', true)
      .attr('data-hash-link', true)
  })

  body.find('a:not([data-processed])').each((i, el) => {
    $(el)
      .attr('target', '_blank')
      .attr('data-processed', true)
      .attr('data-external-link', true)
  })

  body.find('img').each((i, el) => {
    let src = $(el).attr('src')
    if (!src) return false
    let parentLink = $(el).parent('a')
    if (parentLink && parentLink.attr('href') === src) {
      $(el).unwrap()
    }
  })

  // repair img srcs
  body.find('img:not([src^="http://"]):not([src^="https://"]):not([src^="//"])').each((i, el) => {
    let src = $(el).attr('src')

    if (!src) return false

    if (src.substr(0, 1) === '/')
      src = src.substr(1)

    $(el)
      .attr('src', `https://github.com/${repo}/raw/master/${src}`)
      .attr('data-processed', true)
  })

  // repair tables
  // console.log(body.find('table'));
  body.find('table, thead, tbody, tr').each((i, el) => {
    $(el).contents().filter(function() {
      // console.log(this.nodeType);
      return this.nodeType === 3
    }).remove();
  })

  const options = {
    replace: (domNode) => {
      if (!domNode.attribs) return;

      else if (domNode.name === 'a') {
        let { href, target, ...props } = domNode.attribs;

        if (props['data-internal-link']) {
          if (_endsWith(href, 'sindresorhus/awesome'))
            return <Link {...props} to="/">{domToReact(domNode.children, options)}</Link>

          return <Link {...props} to={href}>{domToReact(domNode.children, options)}</Link>
        }

        if (props['data-hash-link']) {
          return <HashLink {...domNode.attribs}>{domToReact(domNode.children, options)}</HashLink>
        }

        // if (props['data-github-raw']) {
        //   if (href.indexOf('/blob/master/') > -1 && _endsWith(href, '.md')) {
        //     const content = router.location.pathname + href.split('/blob/master')[1].replace('.md', '--md')
        //     return <Link {...props} to={content}>{domToReact(domNode.children, options)}</Link>
        //   }
        // }
      }

      else if (domNode.name === 'img') {
        let { align, style, ...props } = domNode.attribs;

        // let className = props.class
        delete props.class

        style = {}

        if (align === 'absmiddle') {
          style = {
            verticalAlign: 'middle'
          }
        }
        if (align === 'left') {
          style = {
            float: 'left',
            paddingRight: '0.5rem'
          }
        }
        if (align === 'center') {
          style = {
            textAlign: 'center'
          }
        }
        if (align === 'right') {
          style = {
            float: 'right',
            paddingLeft: '0.5rem'
          }
        }

        return <img {...props} style={style} />
      }

      else if (['h1', 'p'].indexOf(domNode.name) > -1) {
        let { align, style, ...props } = domNode.attribs;

        const Tag = domNode.name

        style = {}

        if (align === 'left') {
          style = {
            float: 'left',
            paddingRight: '0.5rem'
          }
        }
        if (align === 'center') {
          style = {
            textAlign: 'center'
          }
        }
        if (align === 'right') {
          style = {
            float: 'right',
            paddingLeft: '0.5rem'
          }
        }

        return <Tag {...props} style={style}>{domToReact(domNode.children, options)}</Tag>
      }

    }
  }

  return Parser(body.html(), options)

}