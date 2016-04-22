var moment = require('moment'),
    jwt = require('jwt-simple'),
    config = require('../../config');

module.exports = {
    createJWT: function (user) {

        var payload = {
            sub: user._id,
            iat: moment().unix(),
            exp: moment().add(14, 'days').unix()
        };
        return jwt.encode(payload, config.secretKey);
    }
};