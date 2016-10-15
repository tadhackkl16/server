var express = require('express'),
    mongoose = require('mongoose'),
    config = require('./src/config/index');

var app = express();

//connect to mongodb
var connect = function () {
    var options = {server: {socketOptions: {keepAlive: 1}}, authMechanism: 'ScramSHA1'};
    mongoose.connect(config.db.release, options);
};
connect();

mongoose.connection.on('error', function (err) {
    //console.log("err:" + err);
});
mongoose.connection.on('disconnected', connect);

require('./src/config/express')(app);
require('./src/routes')(app);


exports = module.exports = app;