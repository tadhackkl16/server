var mongoose = require("mongoose"),
    bcrypt = require('bcrypt-nodejs');

var UsersSchema = new mongoose.Schema({
    username: {type: String},
    password: {type: String}
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

module.exports = Users;