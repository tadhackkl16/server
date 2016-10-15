var api = require('./api'),
    auth = require('../security/auth');

module.exports = function (app) {

    //-----------------Views-------------------
    app.get('/', api.views.index);
    app.get('/api', api.views.api);

    //-------------------Auth API----------------------
    /**
     * @api {post} /api/auth/login SignUp&Login
     * @apiName SignUp&Login
     * @apiGroup Auth
     *
     * @apiParam {String} username Mandatory UserName
     * @apiParam {String} passowrd Mandatory Password
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *      "response": {
     *       "success": "true",
     *       "message": {"token": "token"}
     *       }
     *     }
     */
    app.post('/api/auth/login', api.auth.login);

    //---------------Packages API------------------
    app.get('/api/packages/all', auth.isAuth, api.packages.all);
    app.post('/api/packages/purchase', auth.isAuth, api.packages.purchase);


    //----------------Error Handler-------------------
    app.use(api.error.error);
};