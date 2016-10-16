var mongoose = require("mongoose");
var PackagesSchema = new mongoose.Schema({
    name: {type: String},
    description: {type: String},
    devices: {type: Number},
    hours: {type: Number},
    price: {type: Number}
});

PackagesSchema.statics.objectId = function (objId) {
    return mongoose.Types.ObjectId(objId);
};

var Packages = mongoose.model("Packages", PackagesSchema);

Packages.GetPackages = function (callback) {
    Packages.find({}).lean().exec(callback);
};

Packages.CreatePackage = function (obj, callback) {
    callback = callback || function () {
        };

    var _package = new Packages(obj);
    _package.save(callback)
};

Packages.GetPackage = function (packageId, callback) {
    Packages.findOne({_id: packageId}).exec(callback);
};

module.exports = Packages;