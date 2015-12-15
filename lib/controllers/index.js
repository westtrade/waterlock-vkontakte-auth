'use strict';

/**
 * [login method]
 * 
 */
exports.login = require('./actions/login');

/**
 * [logout method]
 * 
 */
exports.logout = require('./actions/logout');

/**
 * [oauth method]
 */
exports.extras = {
	vkontakte_oauth2: require('./actions/oauth2'),
	vkontakte_access_token: require('./actions/access_token')
};
