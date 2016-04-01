var User = require('../models/user');
var Classified = require('../models/classified');
var config = require('../../config');
var secretKey = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');

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

    api.get('/users', function(req, res) {

        User.find({}, function(err, users) {

            if(err) {
                res.send(err);
                return;
            }

            res.json(users);

        });
    });

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

    api.get('/list/:itemsPerPage/:pageNumber', function(req, res) {
        //console.log(req.params);
        var itemsPerPage = req.params.itemsPerPage,
            pageNumber = req.params.pageNumber;

        Classified.find()
            .limit(itemsPerPage)
            .skip(itemsPerPage * (pageNumber-1))
            .exec(function (err, classifieds) {
                Classified.count().exec(function (err, data) {
                    res.json({ classifieds: classifieds, total_count: data })
                })
            });
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
        console.log(req.headers);
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

            var classified = new Classified({

                creator: req.decoded.id,
                content: req.body.content,
                title: req.body.title,
                price: req.body.price,
                image: req.body.image,
                category: req.body.category

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
        //console.log(req.body);
        console.log(req.body.updatedCategories);
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
                    if (req.body.updatedCategories) {
                        classified.category = req.body.updatedCategories;
                    } else if (req.body.additionalCategory){
                        classified.category.push(req.body.additionalCategory)
                    } else {
                        classified.category = req.body.category
                    }

                    // 3: SAVE the record
                    classified.save(function(err,classified){
                        console.log('Classified saved:', classified);
                    });
                }
            }
        )
    });

    api.post('/remove', function (req, res){
        Classified.remove({ title: /Транспорт/ }, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('successfully removed');
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

    api.get('/list/:itemsPerPage/:pageNumber/:userId', function(req, res) {
        var itemsPerPage = req.params.itemsPerPage,
            pageNumber = req.params.pageNumber,
            userId = req.params.userId;

        Classified.find({ creator: userId })
            .limit(itemsPerPage)
            .skip(itemsPerPage * (pageNumber-1))
            .exec(function (err, classifieds) {
                Classified.count({ creator: userId }).exec(function (err, data) {
                    res.json({ classifieds: classifieds, total_count: data })
                })
            });
    });

    api.get('/me', function(req, res) {
        res.json(req.decoded);
    });



    return api;
};