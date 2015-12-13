'use strict';

var _ = require('lodash');

var authConfig = require('../../waterlock-vkontakte-auth').authConfig;
var vk = require('../../waterlock-vkontakte-auth').vk;

/**
 * Oauth action
 */
module.exports = function (req, res) {

    vk.confirmIdentity(req.query.code, accessTokenResponse);

    /**
     * [accessTokenResponse description]
     * @param  {[type]} error                  [description]
     * @param  {[type]} accessToken       [description]
     */
    function accessTokenResponse (error, accessToken) {

        if (error && typeof accessToken !== 'undefined') {
            waterlock.logger.debug(error);
            return res.serverError(error);
        }

        vk.getMe(function (err, data) {

            if (err) { return res.serverError(err); }

            userInfoResponse(data);
        });
    }

    /**
     * [userInfoResponse description]
     * @param  {[type]} error    [description]
     * @param  {[type]} data     [description]
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    function userInfoResponse (userData) {

        var attrs = {
            vkontakteId: userData.id,
            //name: userData.first_name,
            //username: userData.screen_name,
            email: userData.email
        };

        var fieldMap = authConfig.fieldMap || {};
        _.each(fieldMap, function(val, key) {
            if (!_.isUndefined(userData[val])) { attrs[key] = userData[val]; }
        });

        if (req.session.authenticated) {

            attrs['user'] = req.session.user.id;

            waterlock.engine.attachAuthToUser(attrs, req.session.user, userFound);
        } else {
            waterlock.engine.findOrCreateAuth({ vkontakteId: attrs.vkontakteId }, attrs, userFound);
        }

    }

    /**
     * [userFound description]
     * @param  {[type]} err  [description]
     * @param  {[type]} user [description]
     * @return {[type]}      [description]
     */
    function userFound(err, user) {

        if (err) {
            // ensure your using username instead of email
            waterlock.logger.debug(err);

            console.log(err);
            return waterlock.cycle.loginFailure(req, res, null, { error: 'trouble creating model' });
        }

        waterlock.cycle.loginSuccess(req, res, user);
    }
};
