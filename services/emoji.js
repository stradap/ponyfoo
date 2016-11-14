'use strict'

const twemoji = require(`twemoji`)
const emojiOpts = {
  base: `https://twemoji.maxcdn.com/2/`,
  className: `tj-emoji`,
  size: 72
}
const funEmoji = [
  `🐺`, `🐸`, `🐯`, `🐗`, `🐴`, `🦄`, `🐑`, `🐘`, `🐼`, `🐦`, `🐣`,
  `🐍`, `🐢`, `🐙`, `🐠`, `🐟`, `🐬`, `🐳`, `🐋`, `🐏`, `🐇`, `🐉`, `🐐`, `🐓`, `🐲`, `🐊`,
  `🍩`, `🍮`, `🍯`, `🍎`, `🍏`, `🍊`, `🍋`, `🍒`, `🍇`, `🍉`, `🍓`,
  `🍑`, `🍈`, `🍌`, `🍐`, `🍍`, `🍠`, `🍆`, `🍅`, `🌽`,
  `⛵`, `🚤`, `🚣`, `✈`, `🚁`, `🚂`, `🚊`, `🚉`, `🚆`, `🚄`, `🚅`,
  `🚈`, `🚝`, `🚙`, `🚗`, `🚛`, `🚲`, `🚜`, `🚚`, `🚗`, `🚕`,
  `🔥`, `✨`, `🌟`, `💫`, `💥`, `🎉`, `🎊`, `🎨`, `🌙`, `⭐`, `🔱`, `⛅`, `⚡`,
  `👑`, `🏆`, `🔮`, `🔬`, `🔭`, `🚀`, `💎`, `🎃`, `👻`, `🎅`, `🎁`,
  `🙇`, `😍`, `😘`, `😻`, `👒`, `💼`, `👜`, `👝`, `👛`, `🎒`, `🎓`,
  `💛`, `💙`, `💜`, `💚`, `💗`, `💓`, `💕`, `💖`, `💝`, `💞`, `💘`,
  `🍦`, `🍨`, `🍧`, `🎂`, `🍰`, `🍪`, `🍫`, `🍬`, `🍭`,
  `🍕`, `🍟`, `🍝`, `🍛`, `🍤`, `🍣`, `🍥`,
  `🍻`, `🍸`, `🍹`, `🍷`
]
const mailEmoji = [
  `✉️️`, `💌`, `📥`, `📤`, `📬`, `📩`, `📮`, `📪`, `📫`, `📬`, `📭`
]

function random (list) {
  return list[Math.floor(Math.random() * list.length)]
}

function randomFun () {
  return random(funEmoji)
}

function randomMailEmoji () {
  return random(mailEmoji)
}

function compile (text) {
  return twemoji.parse(text, emojiOpts)
}

module.exports = {
  compile,
  randomFun,
  randomMailEmoji
}
