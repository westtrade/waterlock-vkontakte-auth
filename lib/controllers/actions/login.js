'use strict';
 
 var vk = require('../../waterlock-vkontakte-auth').vk;

/**
 * Login action
 */
module.exports = function(req, res){
    res.redirect(vk.getLoginDialogURI());
};