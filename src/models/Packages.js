var mongoose = require("mongoose");
var PackagesSchema = new mongoose.Schema({
    name: {type: String},
    description: {type: String},
    devices: {type: Number},
    hours: {type: Number}
});

var Packages = mongoose.model("Packages", PackagesSchema);

Packages.GetPackages = function (callback) {
    Packages.find({}).lean().exec(callback);
};

Packages.GetPackage = function (packageId, callback) {
    Packages.findOne({_id: packageId}).exec(callback);
};

module.exports = Packages;