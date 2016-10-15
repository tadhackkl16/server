var fs = require('fs'),
    config = require('./../config'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    sessions = require('express-session'),
    compression = require('compression'),
    serveStatic = require('serve-static'),
    methodOverride = require('method-override'),
    connectMongo = require('connect-mongo')(sessions),
    mongoDBStore = require('connect-mongodb-session')(sessions),
    path = require('path'),
    cors = require('cors'),
    swig = require('swig');

module.exports = function (app) {

    //Compress all requests
    app.use(compression());

    //BodyParser should be above MethodOverride
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(function (req, res, next) {
        res.set('X-Powered-By', 'Webrtc-Hack');
        next();
    });

    //Set views path, Template engine and Default layout
    app.engine('html', swig.renderFile);
    app.set('view engine', 'html');
    app.use('/apps', serveStatic(path.resolve(__dirname + './../../views')));

    //Session Store Init
    var storeMongoDBStore = new mongoDBStore({uri: config.db.release, collection: 'sessions'}
        , function (error) {
            // Should have gotten an error
        }
    );
    storeMongoDBStore.on('error', function (error) {
        // Also get an error here
    });

    //CookieParser
    app.use(cookieParser());
    var TwoHours = 3600000 * 2;
    app.use(sessions({
        resave: false,
        saveUninitialized: true,
        secret: 'keyboard cat',
        cookie: {secure: true, maxAge: TwoHours},
        store: storeMongoDBStore
    }));

    //Enable All CORS Requests
    app.use(cors());

};