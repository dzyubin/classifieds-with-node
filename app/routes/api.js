var User = require('../models/user'),
    Classified = require('../models/classified'),
    Categories = require('../models/categories'),
    config = require('../../config'),
    Auth = require('./Auth.js'),
    secretKey = config.secretKey;

var request = require('request'),
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

    api.get('/list', function (req, res) {
        getClassifiedsList(req, res);
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

    api.post('/login', Auth.authLogin);

    app.post('/auth/facebook', Auth.authFacebook);

    app.post('/auth/twitter', Auth.authTwitter);

    app.post('/auth/linkedin', Auth.authLinkedin);

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

            if (req.body.newCategories) {
                addNewCategoriesToDB(req.body.newCategories);
            }

            var classified = new Classified({
                creator: req.decoded.id,
                content: req.body.content,
                title: req.body.title,
                price: req.body.price,
                image: req.body.image,
                category: req.body.categories,
                contact: req.body.contact,
                created: req.body.created
            });

            classified.save(function(err, newClassified) {
                if(err) {
                    res.send(err);
                    return;
                }
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
         getClassifiedsList(req, res);
    });

    function getClassifiedsList(req, res) {
        var itemsPerPage = req.query.itemsPerPage || '',
            after = parseInt(req.query.after),
            ascend = req.query.ascend || -1;

        var query = {};

        if (req.params.userId) query.creator = req.params.userId;
        if (req.query.category) query.category = req.query.category;

        Classified.find(query)
            .sort({created: ascend})
            .skip(after)
            .limit(itemsPerPage)
            .exec(function (error, classifieds) {
                if (error) res.json(error);
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