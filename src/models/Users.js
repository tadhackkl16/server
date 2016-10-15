var mongoose = require("mongoose"),
    bcrypt = require('bcrypt-nodejs');

var UsersSchema = new mongoose.Schema({
    username: {type: String},
    password: {type: String},
    package_id: {type: mongoose.Schema.Types.ObjectId},
    devices: [{typ: String}]
});

UsersSchema.pre('save', function (callback) {
    var user = this;

    if (!user.isModified('password')) return callback();

    bcrypt.genSalt(5, function (err, salt) {
        if (err) return callback(err);
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback();
        });
    });
});

UsersSchema.statics.objectId = function (objId) {
    return mongoose.Types.ObjectId(objId);
};

var Users = mongoose.model("Users", UsersSchema);

Users.CreateUser = function (obj, callback) {
    var user = new Users(obj);
    user.save(callback);
};

Users.GetUsers = function (callback) {
    Users.find({}).lean().exec(callback);
};

Users.GetUser = function (username, callback) {
    Users.findOne({username: username}).exec(callback);
};

Users.VerifyPassword = function (password, user) {
    return bcrypt.compareSync(password, user.password);
};

Users.PurchasePackage = function (packageId, user, callback) {
    callback = callback || function () {
        };

    Users.findOne({_id: user._id}).exec(function (err, currentuser) {
        if (err) return callback(err, 0);
        else {
            if (currentuser) {
                Users.findOneAndUpdate({_id: currentuser._id}, {package_id: packageId}, {
                    new: true,
                    upsert: true
                }).exec(function (err, result) {
                    if (result)
                        return callback(null, result);
                    callback(err);
                });
            } else {
                callback("User Not Exist", 0);
            }
        }
    });
};

Users.RegisterDevice = function (device, user, callback) {
    callback = callback || function () {
        };


    Users.findOne({_id: user._id}).exec(function (err, currentuser) {
        if (err) return callback(err, 0);
        else {
            if (currentuser) {
                Users.findOneAndUpdate({_id: currentuser._id}, {$push: {"devices": device}}, {
                    new: true,
                    upsert: true
                }).exec(function (err, result) {
                    if (result)
                        return callback(null, result);
                    callback(err);
                });
            } else {
                callback("User Not Exist", 0);
            }
        }
    });
};

module.exports = Users;