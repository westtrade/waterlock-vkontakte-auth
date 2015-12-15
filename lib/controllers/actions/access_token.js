'use strict';

var vk = require('../../waterlock-vkontakte-auth').vk;

/**
* Oauth action - for use with Vkontakte Connect auth flows - best to use the
* proper oAuth2 flow but this is here if it takes your fancy
*/
module.exports = function (req, res){
	vk.processAccessToken(req.query.code, accessTokenResponse);


	/**
	* [accessTokenResponse description]
	* @param  {[type]} error                  [description]
	* @param  {[type]} accessToken       [description]
	*/
	function accessTokenResponse(error, accessToken){
		if (error && typeof accessToken !== 'undefined') {
			waterlock.logger.debug(error);
			res.serverError();
		} else {
			vk.getMe(userInfoResponse);
		}
	}

	/**
	* [userInfoResponse description]
	* @param  {[type]} error    [description]
	* @param  {[type]} data     [description]
	* @param  {[type]} response [description]
	* @return {[type]}          [description]
	*/
	function userInfoResponse(error, response, body){
		if (error) {
			waterlock.logger.debug(error);
			res.serverError();
		} else {
			var _data = JSON.parse(body);

			var attr = {
				vkontakteId: _data.id,
				name: _data.name
			};

			if(req.session.authenticated){
				attr['user'] = req.session.user.id;
				waterlock.engine.attachAuthToUser(attr, req.session.user, userFound);
			}else{
				waterlock.engine.findOrCreateAuth({vkontakteId: attr.vkontakteId}, attr, userFound);
			}
		}
	}

	/**
	* [userFound description]
	* @param  {[type]} err  [description]
	* @param  {[type]} user [description]
	* @return {[type]}      [description]
	*/
	function userFound(err, user){
		if(err){
			// ensure your using username instead of email
			waterlock.logger.debug(err);
			waterlock.cycle.loginFailure(req, res, null, {error: 'trouble creating model'});
		}

		waterlock.cycle.loginSuccess(req, res, user);
	}
};
