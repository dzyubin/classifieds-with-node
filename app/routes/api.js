var User = require('../models/user'),
    Classified = require('../models/classified'),
    Categories = require('../models/categories'),
    config = require('../../config'),
    secretKey = config.secretKey,
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
        var itemsPerPage = 20,
            after = parseInt(req.query.after);

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

            } else if (user) {

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
            }
        })
    });

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
                Categories.find({}, function (err, categories) { // додати їх в базу данних
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
                });
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
                    });
                }
            }
        )
    });

    /*api.post('/remove', function (req, res){
        Classified.remove({ title: /Транспорт/ }, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('successfully removed');
            }
        })
    });*/

    api.get('/classified', function (req, res) {
        Classified.findById(
            req.query.classified_id,
            function (err, classified) {
                res.json(classified);
            }
        )
    });

    api.get('/list/:userId', function(req, res) {
        var itemsPerPage = 20,
            userId = req.params.userId,
            after = parseInt(req.query.after);

        Classified.find({ creator: userId })
            .skip(after)
            .limit(itemsPerPage)
            .exec(function (err, classifieds) {
                res.json(classifieds);
            });
    });

    api.get('/me', function(req, res) {
        res.json(req.decoded);
    });

    return api;
};