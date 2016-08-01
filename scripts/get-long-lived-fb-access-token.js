'use strict';

var contra = require('contra');
var winston = require('winston');
var db = require('../lib/db');
var env = require('../lib/env');
var boot = require('../lib/boot');
var facebookService = require('../services/facebook');
var fbAppId = env('FACEBOOK_APP_ID');
var fbAppSecret = env('FACEBOOK_APP_SECRET');
var fbPageId = env('FACEBOOK_PAGE_ID');
var argv = process.argv.slice(2);
var fbAccessToken = argv[0];

if (!fbAccessToken) {
  console.warn([
    'Generate a Pony Foo app token first! Instructions:',
    '1. Visit: https://developers.facebook.com/tools/explorer',
    '2. Choose "Pony Foo" in the applications drop-down on the top right corner.',
    '3. Click "Get Access Token".',
    '4. Choose "manage_pages", "publish_pages" permissions.',
    '5. Click "Get Access Token".',
    '6. Confirm all steps of the authentication dialog as necessary.',
    '7. Copy the access token generated by Facebook\'s Graph API Explorer.',
    '8. Run `NODE_ENV=production node scripts/get-long-lived-fb-access-token $TOKEN`.',
    '9. Paste the resulting token into FACEBOOK_ACCESS_TOKEN on the environment configuration file.'
  ].join('\n  '));
  return;
}

boot(booted);

function booted () {
  contra.waterfall([getBearerToken, getAccounts, printAccessToken], end);

  function getBearerToken (next) {
    var tokenRequest = {
      grant_type: 'fb_exchange_token',
      fb_exchange_token: fbAccessToken,
      client_id: fbAppId,
      client_secret: fbAppSecret,
    };
    facebookService.post('oauth/access_token', tokenRequest, next);
  }

  function getAccounts (data, next) {
    var accountsRequest = {
      access_token: data.access_token
    };
    facebookService.get('me/accounts', accountsRequest, next);
  }

  function printAccessToken (result, next) {
    var page = result.data.filter(wherePage)[0];
    if (!page) {
      next(new Error('User does not have access to facebook page')); return;
    }
    next(null, page.access_token);
  }

  function wherePage (page) {
    return page.id === fbPageId;
  }
}

function end (err, result) {
  if (err) {
    winston.error(err);
  } else {
    winston.info(result);
  }
  disconnect();
}

function disconnect () {
  db.disconnect(() => process.exit(0));
}
