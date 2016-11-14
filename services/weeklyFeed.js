'use strict'

const fs = require(`fs`)
const util = require(`util`)
const contra = require(`contra`)
const cheerio = require(`cheerio`)
const assign = require(`assignment`)
const feedService = require(`./feed`)
const markupService = require(`./markup`)
const weeklyService = require(`./weekly`)
const WeeklyIssue = require(`../models/WeeklyIssue`)
const env = require(`../lib/env`)
const authority = env(`AUTHORITY`)
const css = fs.readFileSync(`.bin/static/newsletter-rss.css`, `utf8`)

function getFeed (done) {
  WeeklyIssue
    .find({ status: `released`, statusReach: `everyone` })
    .populate(`author`, `displayName email`)
    .sort(`-publication`)
    .limit(10)
    .exec(found)

  function found (err, issues) {
    if (err) {
      done(err); return
    }

    contra.map(issues, toFeedItem, done)
    function toFeedItem (issue, next) {
      formatContent(md(issue.summaryHtml) + issue.contentHtml, formatted)
      function formatted (err, description) {
        if (err) {
          next(err); return
        }
        next(null, {
          title: issue.computedTitle + ` \u2014 Pony Foo Weekly`,
          description,
          url: authority + `/weekly/` + issue.slug,
          categories: weeklyService.getAllTags(issue),
          author: util.format(`%s (%s)`, issue.author.email, issue.author.displayName),
          date: issue.publication
        })
      }
    }
    function md (html) {
      return `<div class="md-markdown">` + html + `</div>`
    }
    function formatContent (contentHtml, done) {
      const compilerOpts = {
        markdown: false,
        absolutize: true,
        removeEmoji: true
      }
      const contents = `<style>${ css }</style><div class="f-core">${ contentHtml }</div>`
      const html = markupService.compile(contents, compilerOpts)
      const fixed = fixUp(html)

      done(null, fixed)
    }
  }
}

function fixUp (html) {
  const $ = cheerio.load(html)
  $(`.wy-section-header .md-markdown > p`).each(replaceWith($, `div`))
  const result = $.html()
  return result
}

function replaceWith ($, tagName) {
  const tag = `<${ tagName }>`
  return replacer
  function replacer () {
    const el = $(this)
    const contents = el.html()
    const replacement = $(tag).html(contents)
    el.replaceWith(replacement)
  }
}

module.exports = assign({ getFeed }, feedService.from({
  id: `weekly`,
  href: `/weekly/feed`,
  title: `Pony Foo Weekly`,
  description: `Latest Pony Foo Weekly issues`,
  getFeed
}))
