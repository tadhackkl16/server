var newrelic = require('newrelic'),
    express = require('express'),
    mongoose = require('mongoose'),
    config = require('./src/config/index'),
    schedule = require('./src/schedule/index');

var app = express();
app.locals.newrelic = newrelic;

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

//schedule handlers
//schedule.runSchedule();

exports = module.exports = app;