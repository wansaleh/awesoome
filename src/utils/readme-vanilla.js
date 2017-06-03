import React from 'react'
import $ from 'jquery'
import Parser from 'html-react-parser'
import domToReact from 'html-react-parser/lib/dom-to-react';
import { Link } from 'react-router-dom'
import { animateScroll } from 'react-scroll'

import { getCategoryFromUrl } from './misc'

if (window.Element && !Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
      i,
      el = this;
    do {
      i = matches.length;
      while (--i >= 0 && matches.item(i) !== el) {};
    } while ((i < 0) && (el = el.parentElement));
    return el;
  };
}

const HashLink = (props) => {
  const handleScroll = (e) => {
    const heading = $(e.target).parent()
    console.log(heading);
    // const pos = document.getElementById('user-content-' + e.target.hash.substr(1)).getBoundingClientRect()
    // animateScroll.scrollTo(pos.top, { smooth: 'easeInOutCubic', duration: 300 })
  }

  return (
    <a {...props} onClick={handleScroll} />
  )
}

export default (things, repo, readme) => {

  if (!readme) return null

  console.log('processing readme');

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
    let href = $(el).attr('href').substr(1)

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
      console.log(this.nodeType);
      return this.nodeType === 3
    }).remove();
  })

  const options = {
    replace: (domNode) => {
      if (!domNode.attribs) return;

      else if (domNode.name === 'a') {
        let { href, ...props } = domNode.attribs;

        if (props['data-internal-link'])
          return <Link {...props} to={href}>{domToReact(domNode.children, options)}</Link>

        if (props['data-hash-link']) {
          return <HashLink {...domNode.attribs}>{domToReact(domNode.children, options)}</HashLink>
        }
      }

      else if (domNode.name === 'img') {
        let { align, style, ...props } = domNode.attribs;

        let className = props.class
        delete props.class

        if (align === 'absmiddle') {
          className = 'v-mid'
        }
        if (align === 'left') {
          className = 'fl pr2'
        }
        if (align === 'center') {
          className = 'tc'
        }
        if (align === 'right') {
          className = 'fr pl2'
        }

        return <img {...props} className={className} />
      }

      else if (['h1', 'p'].indexOf(domNode.name) > -1) {
        let { align, style, ...props } = domNode.attribs;

        const Tag = domNode.name

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

        return <Tag {...props} className={className}>{domToReact(domNode.children, options)}</Tag>
      }

    }
  }

  return Parser(body.html(), options)

}