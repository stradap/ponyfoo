'use strict'

const $ = require(`dominus`)
const measly = require(`measly`)
const taunus = require(`taunus`)
const ls = require(`local-storage`)
const progressblock = require(`../lib/progressblock`)
const addToHome = require(`./addToHome`)
const scroll = require(`../lib/scroll`)
const userService = require(`../services/user`)
const markdownService = require(`../../../services/markdown`)
const bubbleKey = `subscribe-bubble-state`
const initialState = {
  action: null,
  email: null
}

function subscribeBubble () {
  let destroy
  taunus.on(`change`, container => {
    const user = userService.getUser()
    const state = readState()
    if (user || state.action) {
      return
    }
    if (destroy) {
      destroy()
      destroy = null
    }
    setTimeout(trackProgress, 200)

    function trackProgress () {
      const spline = $(`.sp-line`, container)
      if (spline.length === 0) {
        return
      }
      destroy = scroll.track(({ scrolled }) => {
        if (scrolled < 60) {
          return
        }
        destroy()
        renderBubble()
        addToHome.enable()
      })
    }
  })
}

function renderBubble () {
  const main = $(`.ly-main`)
  const container = $(`<div>`)
    .addClass(`sb-container`)
    .appendTo(main)

  const openerContainer = $(`<div>`)
    .addClass(`sb-opener-container`)
    .appendTo(container)

  const opener = $(`<button>`)
    .addClass(`sb-opener sb-bubble fa fa-heart`)
    .appendTo(openerContainer)

  setTimeout(showOpener, 500)

  function showOpener () {
    openerContainer.addClass(`sb-pulsating`)
    opener
      .addClass(`sb-opener-show`)
      .once(`click`, renderControls)
  }

  function renderControls () {
    const expansion = $(`<div>`)
      .addClass(`sb-expansion sb-expansion-hide`)
      .prependTo(container)

    $(`<div>`)
      .addClass(`sb-label md-markdown md-markdown-inline`)
      .html(markdownService.compile(`
## Want more like this?

Get all the awesome in your inbox! <br> No spam. 💌
`))
      .appendTo(expansion)

    const input = $(`<input>`)
      .addClass(`sb-input`)
      .attr(`type`, `email`)
      .attr(`placeholder`, `example@ponyfoo.com`)
      .on(`keydown`, onKeyDown)
      .appendTo(expansion)

    $(`<button>`)
      .addClass(`sb-closer sb-bubble fa fa-remove`)
      .once(`click`, closerClick)
      .appendTo(expansion)

    openerContainer.removeClass(`sb-pulsating`)
    opener.on(`click`, openerClick)

    setTimeout(showControls, 0)

    function showControls () {
      expansion
        .removeClass(`sb-expansion-hide`)
        .addClass(`sb-expansion-stage-one`)
      opener
        .removeClass(`fa-heart`)
        .addClass(`fa-envelope`)
      input.focus()

      setTimeout(showLabel, 500)

      function showLabel () {
        expansion.addClass(`sb-expansion-stage-two`)
      }
    }

    function hideControls () {
      expansion
        .removeClass(`sb-expansion-stage-one`)
        .removeClass(`sb-expansion-stage-two`)
        .addClass(`sb-expansion-hide`)
      opener
        .removeClass(`fa-envelope`)
        .addClass(`fa-heart`)
    }

    function onKeyDown (e) {
      if (e.which === 13) {
        e.preventDefault()
        openerClick()
      }
    }

    function openerClick () {
      if (expansion.hasClass(`sb-expansion-hide`)) {
        showControls()
        return
      }
      const email = input.value().trim()
      if (!email) {
        hideControls()
        return
      }
      post(email)
    }

    function post (email) {
      if (progressblock.block(opener)) {
        return
      }
      const json = {
        subscriber: email,
        source: `bubble`
      }
      const [ context ] = expansion
      const ajax = measly.layer({ context })
      ajax
        .put(`/api/subscribers`, { json })
        .on(`200`, () => {
          remember(`submit`, email)
          setTimeout(hide, 1000)
        })
        .on(`always`, () => {
          progressblock.release(opener)
        })
    }

    function hide () {
      $(`.vw-conventional`, expansion).remove()
      hideControls()
      setTimeout(closerClick, 1000)
    }
  }

  function closerClick () {
    container.remove()
    remember(`close`)
  }
}

function readState () {
  return ls.get(bubbleKey) || initialState
}

function remember (action, email = null) {
  const state = readState()
  if (state.action) {
    return
  }
  ls.set(bubbleKey, { action, email })
}

module.exports = subscribeBubble
