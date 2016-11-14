'use strict'

const util = require(`util`)
const request = require(`request`)
const cryptoService = require(`./crypto`)
const fmt = `https://www.gravatar.com/avatar/%s?d=identicon&r=PG`
const tiny = `&s=24`

function hash (email) {
  return cryptoService.md5(email || ``)
}

function format (email) {
  return util.format(fmt, hash(email))
}

function fetch (email, errorSuppression, done) {
  if (done === void 0) {
    done = errorSuppression
    errorSuppression = false
  }

  request({
    url: util.format(fmt + tiny, hash(email)),
    encoding: `binary`
  }, recode)

  function recode (err, res, body) {
    if (err || !body) {
      if (errorSuppression) {
        done(null, { mime: ``, data: `` })
      } else {
        done(err || new Error(`Gravatar response body is empty`))
      }
      return
    }

    done(null, {
      mime: res.headers[`content-type`],
      data: new Buffer(body, `binary`).toString(`base64`)
    })
  }
}


module.exports = {
  fetch: fetch,
  format: format
}
