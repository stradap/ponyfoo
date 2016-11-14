'use strict'

const htmlService = require(`./html`)
const markdownService = require(`./markdown`)
const semojiService = require(`./semoji`)

function compile (md, options) {
  const methods = []
  const o = options || {}

  add(o.markdown !== false, semojiService.compile)
  add(o.markdown !== false, markdownService.compile)
  add(o.externalize, htmlService.externalizeLinks)
  add(o.deferImages, deferImages)
  add(o.absolutize, htmlService.absolutize)
  add(o.fixEmojiSize, htmlService.fixedEmojiSize)
  add(o.removeEmoji, htmlService.removeEmoji)
  add(o.minify !== false, htmlService.minify)
  add(o.linkThrough, linkThrough)

  const html = methods.reduce((result, method) => method(result), md)
  return html

  function add (conditional, fn) {
    if (conditional) { methods.push(fn) }
  }

  function deferImages (html) {
    const i = typeof o.deferImages === `number` && o.deferImages
    return htmlService.deferImages(html, i)
  }

  function linkThrough (html) {
    return htmlService.linkThrough(html, o.linkThrough)
  }
}

module.exports = {
  compile
}
