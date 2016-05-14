var config = require('../../config'),
    User = require('../models/user'),
    request = require('request'),
    qs = require('qs'),
    moment = require('moment'),
    jwt = require('jwt-simple'),
    jsonwebtoken = require('jsonwebtoken');

var createJWT = function (user) {

    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, config.secretKey);
};

var createToken = function (user){

    return jsonwebtoken.sign({
        id: user.id,
        name: user.name,
        username: user.username
    }, config.secretKey, {
        expiresInMinute: 1440
    });
};

module.exports = {
    authFacebook: function(req, res) {

        var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
        var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
        var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
        var params = {
            code: req.body.code,
            client_id: req.body.clientId,
            client_secret: config.FACEBOOK_SECRET,
            redirect_uri: req.body.redirectUri
        };

        // Step 1. Exchange authorization code for access token.
        request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
            if (response.statusCode !== 200) {
                return res.status(500).send({ message: accessToken.error.message });
            }
            // Step 2. Retrieve profile information about the current user.
            request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
                if (response.statusCode !== 200) {
                    return res.status(500).send({ message: profile.error.message });
                }
                //console.log(response);
                //console.log(profile);
                if (req.header('Authorization')) {
                    //console.log('Authorization', req.header('Authorization'));
                    User.findOne({ facebook: profile.id }, function(err, existingUser) {
                        if (existingUser) {
                            return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
                        }
                        var token = req.header('Authorization').split(' ')[1];
                        console.log('auth/facebook', token);
                        var payload = jwt.decode(token, config.secretKey);
                        User.findById(payload.sub, function(err, user) {
                            if (!user) {
                                return res.status(400).send({ message: 'User not found' });
                            }
                            user.facebook = profile.id;
                            user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
                            user.displayName = user.displayName || profile.name;
                            user.save(function() {
                                var token = createJWT(user);
                                res.send({ token: token });
                            });
                        });
                    });
                } else {
                    // Step 3. Create a new user account or return an existing one.
                    User.findOne({ facebook: profile.id }, function(err, existingUser) {
                        if (existingUser) {
                            var token = createJWT(existingUser);
                            return res.send({
                                token: token,
                                user: existingUser
                            });
                        }
                        var user = new User();
                        console.log(user);
                        user.facebook = profile.id;
                        //user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
                        user.username = profile.name;
                        console.log('auth/facebook', user);
                        user.save(function(data) {
                            console.log(data);
                            var token = createJWT(user);
                            res.send({
                                token: token,
                                user: user
                            });
                        });
                    });
                }
            });
        });
    },

    authTwitter: function(req, res) {

        var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
        var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
        var profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

        // Part 1 of 2: Initial request from Satellizer.
        if (!req.body.oauth_token || !req.body.oauth_verifier) {

            //console.log('!oauth.token');

            var requestTokenOauth = {
                consumer_key: config.TWITTER_KEY,
                consumer_secret: config.TWITTER_SECRET,
                callback: req.body.redirectUri
            };

            //console.log('requestTokenOauth', requestTokenOauth);

            // Step 1. Obtain request token for the authorization popup.
            request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
                var oauthToken = qs.parse(body);

                // Step 2. Send OAuth token back to open the authorization screen.
                //console.log('oauthToken', oauthToken);
                res.send(oauthToken);
            });

        } else {

            //console.log('else');

            // Part 2 of 2: Second request after Authorize app is clicked.
            var accessTokenOauth = {
                consumer_key: config.TWITTER_KEY,
                consumer_secret: config.TWITTER_SECRET,
                token: req.body.oauth_token,
                verifier: req.body.oauth_verifier
            };

            // Step 3. Exchange oauth token and oauth verifier for access token.
            request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, accessToken) {

                accessToken = qs.parse(accessToken);

                var profileOauth = {
                    consumer_key: config.TWITTER_KEY,
                    consumer_secret: config.TWITTER_SECRET,
                    oauth_token: accessToken.oauth_token
                };

                // Step 4. Retrieve profile information about the current user.
                request.get({
                    url: profileUrl + accessToken.screen_name,
                    oauth: profileOauth,
                    json: true
                }, function(err, response, profile) {
                    //console.log('profile', profile);
                    // Step 5a. Link user accounts.
                    if (req.header('Authorization')) {

                        //console.log('Authorization');
                        User.findOne({ twitter: profile.id }, function(err, existingUser) {
                            if (existingUser) {
                                return res.status(409).send({ message: 'There is already a Twitter account that belongs to you' });
                            }

                            console.log('existUser', existingUser);
                            var token = req.header('Authorization').split(' ')[1];
                            var payload = jwt.decode(token, config.TOKEN_SECRET);

                            User.findById(payload.sub, function(err, user) {
                                if (!user) {
                                    return res.status(400).send({ message: 'User not found' });
                                }

                                user.twitter = profile.id;
                                user.username = user.displayName || profile.name;
                                //user.picture = user.picture || profile.profile_image_url.replace('_normal', '');
                                user.save(function(err) {
                                    res.send({ token: createJWT(user) });
                                });
                            });
                        });
                    } else {

                        // Step 5b. Create a new user account or return an existing one.
                        User.findOne({ twitter: profile.id }, function(err, existingUser) {
                            if (existingUser) {
                                return res.send({ token: createJWT(existingUser) });
                            }

                            var user = new User();
                            user.twitter = profile.id;
                            user.username = profile.name;
                            user.save(function() {
                                res.send({ token: createJWT(user) });
                            });
                        });
                    }
                });
            });
        }
    },

    authLinkedin: function(req, res) {
        console.log('authLinked');
        var accessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
        var peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)';
        var params = {
            code: req.body.code,
            client_id: req.body.clientId,
            client_secret: config.LINKEDIN_SECRET,
            redirect_uri: req.body.redirectUri,
            grant_type: 'authorization_code'
        };

        // Step 1. Exchange authorization code for access token.
        request.post(accessTokenUrl, { form: params, json: true }, function(err, response, body) {
            if (response.statusCode !== 200) {
                return res.status(response.statusCode).send({ message: body.error_description });
            }
            var params = {
                oauth2_access_token: body.access_token,
                format: 'json'
            };

            // Step 2. Retrieve profile information about the current user.
            request.get({ url: peopleApiUrl, qs: params, json: true }, function(err, response, profile) {

                // Step 3a. Link user accounts.
                if (req.header('Authorization')) {
                    User.findOne({ linkedin: profile.id }, function(err, existingUser) {
                        if (existingUser) {
                            return res.status(409).send({ message: 'There is already a LinkedIn account that belongs to you' });
                        }
                        var token = req.header('Authorization').split(' ')[1];
                        var payload = jwt.decode(token, config.TOKEN_SECRET); // secretKey замість TOKEN_SECRET?
                        User.findById(payload.sub, function(err, user) {
                            if (!user) {
                                return res.status(400).send({ message: 'User not found' });
                            }
                            user.linkedin = profile.id;
                            user.picture = user.picture || profile.pictureUrl;
                            user.displayName = user.displayName || profile.firstName + ' ' + profile.lastName;
                            user.save(function() {
                                var token = createJWT(user);
                                res.send({ token: token });
                            });
                        });
                    });
                } else {
                    // Step 3b. Create a new user account or return an existing one.
                    User.findOne({ linkedin: profile.id }, function(err, existingUser) {
                        if (existingUser) {
                            return res.send({ token: createJWT(existingUser) });
                        }
                        var user = new User();
                        user.linkedin = profile.id;
                        //user.picture = profile.pictureUrl;
                        user.username = profile.firstName + ' ' + profile.lastName;
                        user.save(function() {
                            var token = createJWT(user);
                            res.send({ token: token });
                        });
                    });
                }
            });
        });
    },

    authLogin: function(req, res) {

        User.findOne({
            username: req.body.username
        }).select('name username password').exec(function(err, user) {
            if(err) { throw err; }
            if(!user) {
                res.send({ message: "Невірні ім'я/пароль" });
            }

            var validPassword = user.comparePassword(req.body.password);
            if(!validPassword) {
                res.send({ message: "Невірний пароль" });
            } else {
                //// token
                var token = createToken(user);

                res.json({
                    success: true,
                    message: "Successful login!",
                    token: token
                })
            }
        })
    }
};