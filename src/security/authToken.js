var jsonwebtoken = require('jsonwebtoken'),
    secretKey = require("../config").secretKey;

module.exports = {
    createToken: function (user) {
        return jsonwebtoken.sign({
            _id: user._id,
            username: user.username,
            passwrod: user.password
        }, secretKey);
    },
    verifyToken: function (token, callback) {
        jsonwebtoken.verify(token, secretKey, callback);
    }
};