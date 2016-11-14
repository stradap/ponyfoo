'use strict'

const summaryService = require(`./summary`)
const markdownService = require(`./markdown`)

function summarize (article) {
  if (article.summary) { // author-provided summary
    return summaryService.summarize(markdownService.compile(article.summary))
  }
  return summaryService.summarize(article.teaserHtml + article.introductionHtml, 170)
}

module.exports = {
  summarize: summarize
}
