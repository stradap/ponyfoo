'use strict'

const winston = require(`winston`)
const Engagement = require(`../../../models/Engagement`)

module.exports = function (req, res) {
  Engagement.remove({ _id: req.body.id }, saved)
  function saved (err) {
    if (err) {
      winston.error(err)
    }
    res.redirect(`/speaking/review`)
  }
}
