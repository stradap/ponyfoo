'use strict';

var env = require('../../lib/env');
var staticService = require('../../services/static');
var authority = env('AUTHORITY');

module.exports = function (req, res, next) {
  res.viewModel = {
    rss: 'https://feeds.feedburner.com/ponyfooweekly',
    model: {
      title: 'Pony Foo Weekly Newsletter',
      meta: {
        images: [authority + staticService.unroll('/img/profile.jpg')],
        description: ''
      }
    }
  };
  next();
}
