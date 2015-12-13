'use strict';

var request = require('request');
var querystring= require('querystring');

exports = module.exports = VKOAuth2;

/**
 * vkontakte OAuth2 object, make various requests
 * the the graphAPI
 * @param {string} appId     the vkontakte app id
 * @param {string} appSecret the vkontakte app secret
 * @param {string} redirectURL  the url vkontakte should use as a callback
 */
function VKOAuth2(appId, appSecret, redirectURL, fullSettings) {

    this._appId = appId;
    this._appSecret = appSecret;
    this._redirectURL = redirectURL;

    var settings = fullSettings || {};

    this._vkOpts = fullSettings.settings || {};
    this._apiVersion = this._vkOpts.version || "5.41";
    this._dialogOptions = this._vkOpts.dialog || {};

    this._fields = fullSettings.fieldMap ? _.values(fullSettings.fieldMap) : [];

    this._fields = _.unique(this._fields.concat(['uid', 'first_name', 'last_name', 'screen_name', 'sex', 'photo', 'connections', 'screen_name']));

    this._authURL = 'https://oauth.vk.com/authorize';
    this._accessTokenURI = 'https://oauth.vk.com/access_token';

    this._profileURI = 'https://api.vk.com/method/users.get';
}


/**
 * returns the login dialog uri
 * @return {string} vkontakte login uri
 */
VKOAuth2.prototype.getLoginDialogURI = function() {

    var redirect = arguments[0] || this._redirectURL;

    var defaultParams = {
        client_id: this._appId,
        display: 'popup',
        redirect_uri: redirect,
        response_type: 'code',
        scope: [],
        v: this._apiVersion,
    };

    this._dialogOptions = _.omit(this._dialogOptions, ['v', 'client_id', 'response_type', 'redirect_uri']);

    var params = _.merge({}, defaultParams, this._dialogOptions);
    params.scope.push('friends');
    params.scope.push('email');

    params.scope = _.unique(params.scope).join(',');
    var url = this._authURL + '?' + querystring.stringify(params);
    return url;
};

/**
 * makes a request to the graph api to confirm the identity of a person trying
 * to login, prevents attackers from spoofing responses. Should be called
 * in the callback from the initial request.
 * @param  {string}   code encrypted string unique to each login request
 * @param  {Function} cb   the user defined callback when request is complete
 */
VKOAuth2.prototype.confirmIdentity = function(code, doneCallback) {

    var me = this;

    var params = {
        client_id: this._appId,
        redirect_uri: this._redirectURL,
        client_secret: this._appSecret,
        code: code
    };

    var accessTokenURI = this._accessTokenURI + '?' + querystring.stringify(params);;

    request(accessTokenURI, function (err, response, body) {

        if (err) {
            return doneCallback(err);
        }

        try {
            me.accessToken = JSON.parse(body);
        } catch (err) {
            return doneCallback(err);
        }

        doneCallback(null, me.accessToken);
    });
};

/**
 * performs a GET request to the graph api
 * @param  {string}   uri uri to hit
 * @param  {Function} cb  user defined callback
 */
VKOAuth2.prototype.getMe = function (doneCallback) {

    var me = this;

    if (typeof this.accessToken === 'undefined') {
        cb('Access token does not exist!');
    }

    var params = {
        fields : this._fields.join(','),
        access_token : this.accessToken.access_token,
        v : this._apiVersion
    };

    var url = this._profileURI + '?' + querystring.stringify(params);

    request(url, function (err, response, body) {

        if (err) return doneCallback(err);

        try {
            var responseData = JSON.parse(body);
        } catch (err) {
            return doneCallback(err);
        }

        var data = responseData.response[0];
        data['email'] = me.accessToken.email;

        doneCallback(null, data);
    });
};
