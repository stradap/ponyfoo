'use strict';

var contra = require('contra');
var Article = require('../../models/Article');

module.exports = function (req, res, next) {
  var slug = req.params.slug;

  res.viewModel = {
    model: {
      title: 'Article Composer',
      article: { tags: [] },
      editing: !!slug
    }
  };

  if (slug) {
    Article.findOne({ slug: slug }, populate);
  } else {
    next();
  }

  function populate (err, article) {
    if (err) {
      next(err); return;
    }
    if (!article) {
      res.json(404, { messages: ['Article not found'] }); return;
    }
    res.viewModel.model.article = article;
    next();
  }
};
