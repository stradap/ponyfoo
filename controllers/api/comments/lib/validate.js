'use strict';

var util = require('util');
var mongoose = require('mongoose');
var validator = require('validator');
var ObjectId = mongoose.Schema.Types.ObjectId;

function validate (model) {
  var validation = [];
  if (!model || typeof model !== 'object') {
    validation.push('Invalid request.');
    return validation;
  }
  var sanitized = {
    author: getName(),
    email: getEmail(),
    content: getContent(),
    site: getSite(),
    parent: getParent()
  };
  validation.model = sanitized;

  return validation;

  function getName () {
    var name = validator.toString(model.name).trim();
    if (!name) {
      validation.push(util.format('Your name is required'));
    }
    return name;
  }

  function getEmail () {
    var valid = validator.isEmail(model.email);
    if (valid === false) {
      validation.push('Please provide a valid email address! No spam, promise!');
    }
    return model.email;
  }

  function getContent () {
    var length = 10;
    var valid = validator.isLength(model.content, length);
    if (valid === false) {
      validation.push(util.format('Your comment must be at least %s characters long', length));
    }
    return model.content;
  }

  function getSite () {
    var scheme = /^https?:\/\//i;
    var input = validator.toString(model.site).trim();
    if (!validator.isURL(input)) {
      validation.push('The site is optional, but it should be an URL');
    }
    return scheme.test(input) ? input : 'http://' + input;
  }

  function getParent () {
    return model.parent ? new ObjectId(model.parent) : null;
  }
}

module.exports = validate;