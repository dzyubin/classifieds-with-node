var User = require('../models/user'),
    Classified = require('../models/classified'),
    Categories = require('../models/categories'),
    config = require('../../config'),
    moment = require('moment'),
    jwt = require('jwt-simple'),
    secretKey = config.secretKey,
    request = require('request'),
    jsonwebtoken = require('jsonwebtoken');

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

	    var token = jsonwebtoken.sign({
	        id: user.id,
	        name: user.name,
	        username: user.username
	    }, secretKey, {
	        expiresInMinute: 1440
	    });

	    return token;
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

    /*api.post('/categories', function(req, res) {
        console.log(req.body);
        var categories = new Categories({
            categories: req.body
        });

        categories.save(function(err, newCategories) {
            //classified.save(function(err) {
            if(err) {
                res.send(err);
                return;
            }
            //io.emit('classified', newCategories);
            //res.json({ message: "New Classified Created!" });
            res.json(newCategories);
        });
    });*/

    /*api.route('/')
        .get(function(req, res) {

            Classified.find({}, function(err, classifieds) {

                if(err) {
                    res.send(err);
                    return;
                }

                res.json(classifieds);
            })
        });*/

    api.get('/list', function(req, res) {
        // todo: використати функцію getClassifiedsList
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

    app.post('/auth/facebook', function(req, res) {
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
                    //console.log('req.decoded', req.decoded);
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
            //classified.save(function(err) {
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
        Categories.find({}, function (err, categories) { // додати їх в базу данних
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

    // todo: доробити функцію
/*
    function getClassifiedsList(after, userId) {
        var itemsPerPage = 20,
            after = parseInt(after);
            //userId = req.params.userId;

        userId = userId || '';

        Classified.find({ creator: userId })
            .skip(after)
            .limit(itemsPerPage)
            .exec(function (err, classifieds) {
                res.json(classifieds);
            });
    }
*/

    api.get('/me', function(req, res) {
        //console.log('req.query', req.query);

        if (req.query.facebook) {
            User.findById(req.decoded.sub, function(err, user) {
                //console.log('user', user);
                res.send(user);
            });
        } else {
            res.json(req.decoded);
        }
    });

    return api;
};