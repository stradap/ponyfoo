'use strict'

const winston = require(`winston`)
const subscriberTwitterService = require(`../../../services/subscriberTwitter`)

module.exports = function (req, res) {
  subscriberTwitterService.pollCards(completed)
  function completed (err) {
    if (err) {
      winston.warn(err)
      req.flash(`error`, `An error occurred while retrieving Twitter card data.`)
    } else {
      req.flash(`success`, `Pulled interested parties from Twitter cards.`)
    }
    res.redirect(`/owner/subscribers`)
  }
}
