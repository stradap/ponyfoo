'use strict';

const authOnly = require(`./account/only`);
const ownerOnly = require(`./author/roleOnly`)([`owner`]);
const invoiceOnly = require(`./author/roleOnly`)([`owner`]);
const articlesOnly = require(`./author/roleOnly`)([`owner`, `editor`, `articles`]);
const weekliesOnly = require(`./author/roleOnly`)([`owner`, `weeklies`]);

module.exports = [
  { route: `/`, action: `articles/home` },
  { route: `/p/:page([1-9][0-9]{0,})`, action: `articles/home` },
  { route: `/all/feed`, ignore: true },
  { route: `/articles/feed`, ignore: true },
  { route: `/articles/history`, action: `articles/history` },
  { route: `/articles/archives`, ignore: true },
  { route: `/articles/first`, action: `articles/first` },
  { route: `/articles/last`, action: `articles/last` },
  { route: `/articles/random`, action: `articles/random` },
  { route: `/articles/tagged/:tags`, action: `articles/tagged` },
  { route: `/articles/search/:terms`, action: `articles/search` },
  { route: `/articles/search/:terms/tagged/:tags`, action: `articles/searchTagged` },
  { route: `/articles/:year(\\d{4})/:month([01]\\d)/:day([0-3]\\d)`, action: `articles/dated` },
  { route: `/articles/:year(\\d{4})/:month([01]\\d)`, action: `articles/dated` },
  { route: `/articles/:year(\\d{4})`, action: `articles/dated` },
  { route: `/articles/tags/review`, action: `author/tags/review`, middleware: ownerOnly },
  { route: `/articles/tags/new`, action: `author/tags/edit`, middleware: ownerOnly },
  { route: `/articles/tags/:slug/edit`, action: `author/tags/edit`, middleware: ownerOnly },
  { route: `/articles/review`, action: `author/articles/review`, middleware: articlesOnly },
  { route: `/articles/new`, action: `author/articles/compose`, middleware: articlesOnly },
  { route: `/articles/:slug/edit`, action: `author/articles/compose`, middleware: articlesOnly },
  { route: `/articles/:slug`, action: `articles/article` },
  { route: `/weekly`, action: `weekly/home` },
  { route: `/weekly/feed`, ignore: true },
  { route: `/weekly/sponsor`, action: `weekly/sponsor` },
  { route: `/weekly/history`, action: `weekly/history` },
  { route: `/weekly/first`, action: `weekly/first` },
  { route: `/weekly/last`, action: `weekly/last` },
  { route: `/weekly/random`, action: `weekly/random` },
  { route: `/weekly/review`, action: `author/weeklies/review`, middleware: weekliesOnly },
  { route: `/weekly/submissions`, action: `weekly/submissions` },
  { route: `/weekly/submissions/review`, action: `weekly/submissions/review`, middleware: ownerOnly },
  { route: `/weekly/submissions/:slug/edit`, action: `weekly/submissions` },
  { route: `/weekly/new`, action: `author/weeklies/assemble`, middleware: weekliesOnly },
  { route: `/weekly/:slug/edit`, action: `author/weeklies/assemble`, middleware: weekliesOnly },
  { route: `/weekly/:slug`, action: `weekly/issue` },
  { route: `/contributors`, action: `marketing/contributors` },
  { route: `/contributors/join-us`, action: `marketing/join-us` },
  { route: `/contributors/:slug`, action: `marketing/contributor` },
  { route: `/styleguide`, action: `styleguide/home` },
  { route: `/about`, action: `marketing/about` },
  { route: `/speaking`, action: `speaking/home` },
  { route: `/speaking/review`, action: `author/engagements`, middleware: ownerOnly },
  { route: `/speaking/new`, action: `author/engagements-new`, middleware: ownerOnly },
  { route: `/opensource`, action: `opensource/home` },
  { route: `/opensource/review`, action: `author/oss`, middleware: ownerOnly },
  { route: `/opensource/new`, action: `author/oss-new`, middleware: ownerOnly },
  { route: `/slack`, action: `marketing/slack` },
  { route: `/books`, action: `books/home` },
  { route: `/books/javascript-application-design`, action: `books/javascript-application-design` },
  { route: `/presentations`, action: `speaking/presentations` },
  { route: `/presentations/review`, action: `author/presentations`, middleware: ownerOnly },
  { route: `/presentations/new`, action: `author/presentations-new`, middleware: ownerOnly },
  { route: `/presentations/:slug`, action: `speaking/presentation` },
  { route: `/subscribe`, action: `marketing/subscribe` },
  { route: `/subscribed`, action: `marketing/subscribed` },
  { route: `/unsubscribed`, action: `marketing/unsubscribed` },
  { route: `/account/login`, action: `account/login` },
  { route: `/account/login/:provider`, ignore: true },
  { route: `/account/logout`, ignore: true },
  { route: `/account/profile`, action: `account/profile`, middleware: authOnly },
  { route: `/invoices`, action: `invoices/review`, middleware: invoiceOnly },
  { route: `/invoices/parties`, action: `invoices/parties/review`, middleware: invoiceOnly },
  { route: `/invoices/parties/new`, action: `invoices/parties/edit`, middleware: invoiceOnly },
  { route: `/invoices/parties/:slug/edit`, action: `invoices/parties/edit`, middleware: invoiceOnly },
  { route: `/invoices/new`, action: `invoices/edit`, middleware: invoiceOnly },
  { route: `/invoices/:slug/edit`, action: `invoices/edit`, middleware: invoiceOnly },
  { route: `/users`, action: `owner/users/review`, middleware: ownerOnly },
  { route: `/users/new`, action: `owner/users/edit`, middleware: ownerOnly },
  { route: `/users/:id/edit`, action: `owner/users/edit`, middleware: ownerOnly },
  { route: `/owner/announcements`, action: `author/announcements`, middleware: ownerOnly },
  { route: `/owner/logs/:page([1-9][0-9]{0,})?`, action: `author/logs`, middleware: ownerOnly },
  { route: `/owner/subscribers/:page([1-9][0-9]{0,})?`, action: `author/subscribers`, middleware: ownerOnly },
  { route: `/owner/settings`, action: `author/settings`, middleware: ownerOnly },
  { route: `/privacy`, action: `marketing/privacy` },
  { route: `/license`, action: `marketing/license` },
  { route: `/bf/:shortlink?`, ignore: true },
  { route: `/s/:shortlink?`, ignore: true },
  { route: `/offline`, action: `error/offline` },
  { route: `/*`, action: `error/not-found` }
];
