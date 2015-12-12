'use strict';

var path = require('path');
var VKOAuth2 = require('./vkoauth2');

exports.authType = 'vkontakte';

try {
	var configPath = path.normalize(__dirname + '/../../../config/waterlock.js');
	var config = require(configPath).waterlock;
} catch (e) {
	throw 'waterlock not installed';
}

var method = {};
if (typeof config.authMethod[0] === 'object') {
	for (var i = 0; i < config.authMethod.length; i++) {
		if (config.authMethod[i].name === 'waterlock-vkontakte-auth') {
			method = config.authMethod[i];
		}
	}
} else {
	method = config.authMethod;
}

var vkOauth2Url = method.redirectUri ? 
		method.redirectUri :
		(config.baseUrl + (config.pluralizeEndpoints ? '/auths/' : '/auth') + '/vkontakte_oauth2')


exports.config = config;
exports.authConfig = method;
exports.vk = new VKOAuth2(method.appId, method.appSecret, vkOauth2Url);

exports.actions = require('./controllers');
exports.model = require('./models');
