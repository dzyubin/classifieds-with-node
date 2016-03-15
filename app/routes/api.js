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
        expiresInMinute: 1440 // in video it is "expirtesInMinute". Is it correct?
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

    api.post('/login', function(req, res) {

        User.findOne({
            username: req.body.username
        //}).select('password').exec(function(err, user) {
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

        var token = req.body.token || req.param('token') || req.headers['x-access-token'];

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
                content: req.body.content

            });

            //classified.save(function(err, newClassified) {
            classified.save(function(err) {
                if(err) {
                    res.send(err);
                    return;
                }
                //io.emit('classified', newClassified);
                res.json({ message: "New Classified Created!" });
            });
        })
        .get(function(req, res) {

            Classified.find({  }, function(err, classifieds) {

                if(err) {
                    res.send(err);
                    return;
                }

                res.json(classifieds);
            })
        });

    api.get('/me', function(req, res) {
        res.json(req.decoded);
    });

    return api;
};