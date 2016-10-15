var config = require('./../config/index'),
    authToken = require('../security/authToken'),
    Users = require("../models/Users");

var usersApi = {
    getUsers: function (req, res) {
        Users.GetUsers(function (err, data) {
            if (err) res.status(500).json({response: {success: false, message: 'Something blew up!'}});
            else res.status(200).json({response: {success: true, message: {users: data}}});
        })
    },
    getUser: function (req, res) {
        var username = req.body.username;
        Users.GetUser(username, function (err, data) {
            if (err) res.status(500).json({response: {success: false, message: 'Something blew up!'}});
            else res.status(200).json({response: {success: true, message: {user: data}}});
        })
    }
};

var authApi = {
    login: function (req, res) {

        if (!req.body.username || !req.body.password) {
            res.status(401).json({response: {success: false, message: 'Invalid values!'}});
            return;
        }
        console.log(req.body);

        var username = req.body.username, password = req.body.password;

        Users.findOne({username: username}).exec(function (err, user) {
            if (err) res.status(500).json({response: {success: false, message: 'Something blew up!'}});
            else {
                if (user) {
                    var validPass = Users.VerifyPassword(pass, user);
                    if (!validPass)
                        res.status(401).json({response: {success: false, message: 'Invalid password'}});
                    else {
                        //token generator
                        var token = authToken.createToken(user);
                        res.status(200).json({
                            response: {
                                success: true,
                                message: {token: token}
                            }
                        });
                    }
                } else {
                    var userObj = new Users({
                        username: username,
                        password: password
                    });
                    userObj.save(function (err) {
                        if (err) res.status(500).json({response: {success: false, message: 'Something blew up!'}});
                        else {
                            //user exist just login
                            var validPass = Users.VerifyPassword(pass, userObj);
                            if (!validPass) res.status(400).json({
                                response: {
                                    success: false,
                                    message: 'Invalid password'
                                }
                            });
                            else {
                                //token generator
                                var token = authToken.createToken(userObj);
                                res.status(200).json({
                                    response: {
                                        success: true,
                                        message: {token: token}
                                    }
                                });
                            }
                        }
                    })
                }
            }
        });
    }
};

var viewsApi = {
    index: function (req, res) {
        res.status(200).render("index.html");
    },
    api: function (req, res) {
        res.status(200).redirect("/apps/doc/index.html");
    }
};

var errorApi = {
    error: function (err, req, res, next) {
        if (err) {
            var error = err.message || err;
            console.log('Error: ' + error);
            //res.status(500).json({response: {success: false, message: {error: error}}});
        }
        next();
    }
};

module.exports = {
    users: usersApi,
    error: errorApi,
    views: viewsApi,
    auth: authApi
};
