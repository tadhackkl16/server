var config = require('./../config/index'),
    restcomm = require('../lib/restcomm'),
    authToken = require('../security/authToken'),
    Users = require("../models/Users"),
    Packages = require("../models/Packages");

var usersApi = {
    users: function (req, res) {
        Users.GetUsers(function (err, data) {
            if (err) res.status(500).json({response: {success: false, message: 'Something blew up!'}});
            else res.status(200).json({response: {success: true, message: {users: data}}});
        })
    },
    user: function (req, res) {
        var username = req.body.username;
        Users.GetUser(username, function (err, data) {
            if (err) res.status(500).json({response: {success: false, message: 'Something blew up!'}});
            else res.status(200).json({response: {success: true, message: {user: data}}});
        })
    },
    currentUser: function (req, res) {
        if (!req.user) {
            res.status(500).json({response: {success: false, message: 'Not Authenticated'}});
            return;
        }

        Users.findOne({_id: req.user._id}).exec(function (err, data) {
            if (err) res.status(500).json({response: {success: false, message: 'Something blew up!'}});
            else res.status(200).json({response: {success: true, message: {user: data}}});
        });
    },
    purchase: function (req, res) {
        if (!req.body.packageId) {
            res.status(500).json({response: {success: false, message: 'Invalid values'}});
            return;
        }

        if (req.body.packageId.length < 12) {
            res.status(500).json({response: {success: false, message: 'PackageId is not valid'}});
            return;
        }

        if (!req.user) {
            res.status(500).json({response: {success: false, message: 'Not Authenticated'}});
            return;
        }


        //pay with axiata payment
        //send message with axiata paymanet
        Users.PurchasePackage(req.body.packageId, req.user, function (err, data) {
            if (err) res.status(500).json({response: {success: false, message: 'Something blew up!'}});
            else res.status(200).json({response: {success: true, message: {user: data}}});
        });

    },
    registerMaster: function (req, res) {
        if (!req.body.deviceId) {
            res.status(500).json({response: {success: false, message: 'Invalid values'}});
            return;
        }

        if (!req.user) {
            res.status(500).json({response: {success: false, message: 'Not Authenticated'}});
            return;
        }

        Users.findOne({_id: req.user._id}).exec(function (errS, user) {
            if (errS) res.status(500).json({response: {success: false, message: 'Something blew up!'}});
            else if (user.deviceId == "") {
                restcomm.createClient(req.body.deviceId, req.user, function (errC, result) {
                    if (errC)
                        res.status(500).json({
                            response: {
                                success: false,
                                message: 'Something blew up!'
                            }
                        });
                    else {
                        Users.RegisterMaster(result.login, req.user, function (errSR, data) {
                            if (errSR) res.status(500).json({
                                response: {
                                    success: false,
                                    message: 'Something blew up!'
                                }
                            });
                            else {
                                res.status(200).json({
                                    response: {
                                        success: true,
                                        message: {user: data}
                                    }
                                });
                            }
                        });
                    }
                });
            }
            else
                res.status(500).json({
                    response: {
                        success: false,
                        message: 'You already have master!'
                    }
                });
        })
    },
    registerSlave: function (req, res) {
        if (!req.body.deviceId) {
            res.status(500).json({response: {success: false, message: 'Invalid values'}});
            return;
        }

        if (!req.user) {
            res.status(500).json({response: {success: false, message: 'Not Authenticated'}});
            return;
        }

        Users.findOne({_id: req.user._id}).exec(function (errS, user) {
            if (errS) res.status(500).json({response: {success: false, message: 'Something blew up!'}});
            else {
                Packages.GetPackage(user.packageId, function (errP, _package) {
                    if (errP) res.status(500).json({response: {success: false, message: 'Something blew up!'}});
                    else {
                        if (user.devices < _package.devices) {
                            restcomm.createClient(req.body.deviceId, req.user, function (errC, result) {
                                if (errC)
                                    res.status(500).json({
                                        response: {
                                            success: false,
                                            message: 'Something blew up!'
                                        }
                                    });
                                else {
                                    Users.RegisterSlave(result.login, req.user, function (errSR, data) {
                                        if (errSR) res.status(500).json({
                                            response: {
                                                success: false,
                                                message: 'Something blew up!'
                                            }
                                        });
                                        else {
                                            res.status(200).json({
                                                response: {
                                                    success: true,
                                                    message: {user: data}
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        else
                            res.status(500).json({response: {success: false, message: 'You reach the limit!'}});
                    }
                });
            }
        });
    }
};

var authApi = {
    login: function (req, res) {

        if (!req.body.username || !req.body.password) {
            res.status(500).json({response: {success: false, message: 'Invalid values!'}});
            return;
        }
        console.log(req.body);

        var username = req.body.username, password = req.body.password;

        Users.findOne({username: username}).exec(function (err, user) {
            if (err) res.status(500).json({response: {success: false, message: 'Something blew up!'}});
            else {
                if (user) {
                    var validPass = Users.VerifyPassword(password, user);
                    if (!validPass)
                        res.status(500).json({response: {success: false, message: 'Invalid password'}});
                    else {
                        //token generator
                        var token = authToken.createToken(user);
                        res.status(200).json({
                            response: {
                                success: true,
                                message: {token: token, user: user}
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
                            var validPass = Users.VerifyPassword(password, userObj);
                            if (!validPass) res.status(500).json({
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

var packagesApi = {
    all: function (req, res) {
        Packages.GetPackages(function (err, data) {
            if (err) res.status(500).json({response: {success: false, message: 'Something blew up!'}});
            else res.status(200).json({response: {success: true, message: {packages: data}}});
        });
    },
    add: function (req, res) {
        if (!req.body.name || !req.body.description || !req.body.devices || !req.body.hours) {
            res.status(500).json({response: {success: false, message: 'Invalid values'}});
            return;
        }

        if (!req.user) {
            res.status(500).json({response: {success: false, message: 'Not Authenticated'}});
            return;
        }

        var object = {
            name: req.body.name,
            description: req.body.description,
            devices: req.body.devices,
            hours: req.body.hours
        };

        Packages.CreatePackage(object, function (err, data) {
            if (err) res.status(500).json({response: {success: false, message: 'Something blew up!'}});
            else res.status(200).json({response: {success: true, message: {package: data}}});
        })
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
    packages: packagesApi,
    users: usersApi,
    error: errorApi,
    views: viewsApi,
    auth: authApi
};
