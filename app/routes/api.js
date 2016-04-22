var User = require('../models/user'),
    Classified = require('../models/classified'),
    Categories = require('../models/categories'),
    config = require('../../config'),
    Auth = require('./Auth.js'),
    secretKey = config.secretKey;

var moment = require('moment'),
    jwt = require('jwt-simple'),
    request = require('request'),
    jsonwebtoken = require('jsonwebtoken'),
    qs = require('qs');

module.exports = function(app, express) {

    var api = express.Router();

    api.post('/signup', function(req, res) {

        var user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        });

        var token = createToken(user);

        user.save(function(err) {
            if(err) {
                res.send(err);
                return;
            }
            res.json({
                success: true,
                message: 'User has been created!',
                token: token
            });
        });
    });

    function createToken(user){

	    /*var token = jsonwebtoken.sign({
	        id: user.id,
	        name: user.name,
	        username: user.username
	    }, secretKey, {
	        expiresInMinute: 1440
	    });

	    return token;*/

        return jsonwebtoken.sign({
            id: user.id,
            name: user.name,
            username: user.username
        }, secretKey, {
            expiresInMinute: 1440
        });
	}

    api.get('/users', function(req, res) {

        User.find({}, function(err, users) {

            if(err) {
                res.send(err);
                return;
            }

            res.json(users);

        });
    });

    api.get('/list', function(req, res) {
        // todo: використати функцію getClassifiedsList
        // getClassifiedsList(req.query.after);
        var itemsPerPage = 20,
            after = parseInt(req.query.after, 10);

        Classified.find()
            .skip(after)
            .limit(itemsPerPage)
            .exec(function (err, classifieds) {
                res.json(classifieds);
            });
    });

    api.get('/categories', function (req, res) {
        Categories.find({}, function (err, categories) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(categories);
        })
    });

    api.post('/login', function(req, res) {

        User.findOne({
            username: req.body.username
        }).select('name username password').exec(function(err, user) {
            if(err) { throw err; }
            if(!user) {
                res.send({ message: "User doesn't exist" });
            }

            var validPassword = user.comparePassword(req.body.password);
            if(!validPassword) {
                res.send({ message: "Invalid Password" });
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
    });

/*
    app.post('/auth/facebook', function(req, res) {
        // todo: винести функцію в окремий файл socialAuthorization.js

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
    });
*/

    app.post('/auth/facebook', Auth.authFacebook);

    app.post('/auth/twitter', function(req, res) {
        // todo: винести функцію в окремий файл socialAuthorization.js

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
    });

    function createJWT(user) {
        var payload = {
            sub: user._id,
            iat: moment().unix(),
            exp: moment().add(14, 'days').unix()
        };
        return jwt.encode(payload, config.secretKey);
    }

    api.use(function(req, res, next) {

        console.log("Somebody just came to our app!");
        //var token = req.body.token || req.param('token') || req.headers['x-access-token'];
        var token = req.body.token || req.params.token || req.headers['x-access-token'];

        //check if token exist
        if(token) {
            jsonwebtoken.verify(token, secretKey, function(err, decoded) {
                if(err) {
                    res.status(403).send({ success: false, message: "Failed to authenticate user" });
                } else {
                    req.decoded = decoded;
                    req.decoded.id = req.decoded.id || req.decoded.sub;
                    next();
                }
            })
        } else {
            res.status(403).send({ success: false, message: "No Token Provided" });
        }
    });

    api.route('/')

        .post(function(req, res) {

            if (req.body.newCategories) { // якщо користувач створив нові категорії
                /*Categories.find({}, function (err, categories) { // додати їх в базу данних
                    if (err) {
                        console.log(err);
                    } else {
                        req.body.newCategories.forEach(function (element, index) {
                            categories[0].categories.push(element);
                        });

                        categories[0].save(function (err, categories) {
                            console.log('Categories saved:', categories);
                        });
                    }
                });*/

                addNewCategoriesToDB(req.body.newCategories);
            }
            var classified = new Classified({
                creator: req.decoded.id,
                content: req.body.content,
                title: req.body.title,
                price: req.body.price,
                image: req.body.image,
                category: req.body.categories
            });

            classified.save(function(err, newClassified) {
                if(err) {
                    res.send(err);
                    return;
                }
                //io.emit('classified', newClassified);
                //res.json({ message: "New Classified Created!" });
                res.json(newClassified);
            });
        });

    api.post('/update', function (req, res) {

        if (req.body.newCategories) {
            addNewCategoriesToDB(req.body.newCategories);
        }

        Classified.findOne(
            {_id : req.body._id},
            function(err, classified) {
                if(err) {
                    console.log(err);
                } else {

                    // 2: EDIT the record
                    classified.title = req.body.title;
                    classified.price = req.body.price;
                    classified.content = req.body.content;
                    classified.image = req.body.image;
                    classified.category = req.body.category;

                    // 3: SAVE the record
                    classified.save(function(err,classified){
                        console.log('Classified saved:', classified);
                        res.end();
                    });
                }
            }
        )
    });

    function addNewCategoriesToDB(newCategories) {
        Categories.find({}, function (err, categories) {
            if (err) {
                console.log(err);
            } else {
                newCategories.forEach(function (element, index) {
                    categories[0].categories.push(element);
                });

                categories[0].save(function (err, categories) {
                    console.log('Categories saved:', categories);
                });
            }
        });
    }

    api.post('/remove', function (req, res){
        Classified.findByIdAndRemove({ _id: req.body._id }, function (err, removedClassified) {
            if (err) {
                console.log(err);
            } else {
                res.json(removedClassified);
            }
        })
    });

    // todo: перейменувати на /single-classified
    api.get('/classified', function (req, res) {
        Classified.findById(
            req.query.classified_id,
            function (err, classified) {
                res.json(classified);
            }
        )
    });

    api.get('/list/:userId', function(req, res) {
        // todo: використати функцію getClassifiedsList
        // getClassifiedsList(req.query.after, req.params.userId);

        var itemsPerPage = 20,
            after = parseInt(req.query.after),
            userId = req.params.userId;

        Classified.find({ creator: userId })
            .skip(after)
            .limit(itemsPerPage)
            .exec(function (err, classifieds) {
                res.json(classifieds);
            });
    });

    // todo: перевірити функцію
    function getClassifiedsList(after, userId) {
        var itemsPerPage = 20;

        after = parseInt(after);
        userId = userId || '';

        Classified.find({ creator: userId })
            .skip(after)
            .limit(itemsPerPage)
            .exec(function (err, classifieds) {
                res.json(classifieds);
            });
    }

    api.get('/me', function(req, res) {

        // todo: перейменувати 'facebook' на 'social'
        if (req.query.facebook) {
            User.findById(req.decoded.sub, function(err, user) {
                res.send(user);
            });
        } else {
            res.json(req.decoded);
        }
    });

    return api;
};