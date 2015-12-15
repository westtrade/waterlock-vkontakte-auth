# Waterlock Vkontakte Auth

[![Codacy](https://img.shields.io/codacy/74513f5b1d8b46e09d134615c5b53385.svg)](https://www.codacy.com/app/westtrade/waterlock-vkontakte-auth)
[![Build Status](https://img.shields.io/travis/westtrade/waterlock-vkontakte-auth.svg?style=flat)](https://travis-ci.org/westtrade/waterlock-vkontakte-auth) 
[![NPM version](https://img.shields.io/npm/v/waterlock-vkontakte-auth.svg?style=flat)](http://badge.fury.io/js/waterlock-vkontakte-auth) 
[![Dependency Status](https://gemnasium.com/westtrade/waterlock-vkontakte-auth.svg?style=flat)](https://gemnasium.com/westtrade/waterlock-vkontakte-auth)

waterlock-vkontakte-auth is a module for [waterlock](http://waterlock.ninja/)
providing a vkontakte authentication method for users either based on username.

## Usage

```bash

npm i waterlock-vkontakte-auth --save

```

Set the following option in your `waterlock.js` config file

- redirectUri is an optional property - use this if you want to override the computed redirectUri. This is useful for when you want to send an auth code to waterlock instead of having waterlock handle the entire auth flow for you. Useful for when you're developing an SPA which handles the authentication with something like Torii (EmberJs). See https://github.com/wayne-o/ember-waterlock-example - waterlock will validate the auth code with the provider and retrieve an access token which can be used to setup a session and return the JWT to your app


```js
authMethod: [
    {
        name: "waterlock-vkontakte-auth",
        appId: "your-app-id",
        appSecret: "your-app-secret",
        redirectUri: 'redirectUri'
    }
]
```

Direct your user to `/auth/login?type=vkontakte` will initiate the oauth request. The callback uri is `/auth/vkontakte_oauth2` if successfuly authenticated a user record will be created if a user is not found one will be created using the [waterlines](https://github.com/balderdashy/waterline) `findOrCreate` method

If you are using sails blueprints and have pluralized your REST API you can configure waterlock to pluralize the auth endpoints by including pluralizeEndpoints=true in the waterlock.js file:

```js
module.exports.waterlock = {

  pluralizeEndpoints: true

}
```

### Grabbing Vkontakte field values

By default, waterlock-vkontakte-auth stores the user's `vkontakteId` and `email` in the Auth model. In reality, Vkontakte returns more data than that.
To grab and store this, you will need to modify the add the fields in your `Auth.js` model...

Full list of [vk auth fields](https://vk.com/dev/fields).


```js
// api/models/Auth.js
module.exports = {
    attributes: require('waterlock').models.auth.attributes({
        firstName: 'string',
        lastName: 'string',
        gender: 'string',
        timezone: 'number'
    })
}
```

`` List of authMethod settings ``

- `fieldMap` object within the vkontakte authMethod in your `waterlock.js` config file which matches your model's fields to vkontakte's fields.
- `settings` object override default OAuth2.0 vk settings, except scope (this array required two permission as default `friends` and `email`), and this next options: 'v', 'client_id', 'response_type', 'redirect_uri'. Full list of overrided options of `dialog` settings you can see [here](https://vk.com/dev/auth_sites). List of scope permission you can see [here](https://vk.com/dev/permissions)




```js
authMethod: [
    {
        name: "waterlock-vkontakte-auth",
        appId: "your-app-id",
        appSecret: "your-app-secret",

        fieldMap: { 
            // <model-field>: <vkontakte-field>,
            'firstName': 'first_name',
            'lastName': 'last_name',
            'gender': 'gender',
            'timezone': 'timezone'
        },

        settings : { //override default oauth settings

            dialog : { //https://vk.com/dev/auth_sites
                'scope' : ['offers']
            },

            version : '5.42'
        },
    }
]
```
