'use strict';

/**
 * [login description]
 * @type {[type]}
 */
exports.login = require('./actions/login');

/**
 * [logout description]
 * @type {[type]}
 */
exports.logout = require('./actions/logout');

/**
 * [oauth description]
 * @type {[type]}
 */
exports.extras = {
  vkontakte_oauth2: require('./actions/oauth2'),
  vkontakte_access_token: require('./actions/access_token')
};
