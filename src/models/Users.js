var mongoose = require("mongoose"),
    bcrypt = require('bcrypt-nodejs');

var UsersSchema = new mongoose.Schema({
    username: {type: String, default: ""},
    password: {type: String, default: ""},
    deviceId: {type: String, default: ""},
    packageId: {type: String, default: ""},
    devices: [String]
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
                Users.findOneAndUpdate({_id: currentuser._id}, {packageId: packageId}, {
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

Users.RegisterMaster = function (deviceId, user, callback) {
    callback = callback || function () {
        };

    Users.findOneAndUpdate({_id: user._id}, {deviceId: deviceId}, {
        new: true,
        upsert: true
    }).exec(function (err, result) {
        if (err)
            callback(err);
        else callback(null, result);
    });
};

Users.RegisterSlave = function (device, user, callback) {
    callback = callback || function () {
        };


    Users.findOne({_id: user._id}).exec(function (err, currentuser) {
        if (err) return callback(err, 0);
        else {
            if (currentuser) {
                Users.findOneAndUpdate({_id: currentuser._id}, {$pushAll: {devices: [device]}}, {
                    new: true,
                    upsert: true
                }).exec(function (errS, result) {
                    if (err)
                        callback(errS);
                    else callback(null, result);
                });
            } else {
                callback("User Not Exist", 0);
            }
        }
    });
};

module.exports = Users;
