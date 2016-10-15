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
     * @apiParam {String} password Mandatory Password
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *      "response": {
     *       "success": "true",
     *       "message": {"token": "token", "user": "User object"}
     *       }
     *     }
     */
    app.post('/api/auth/login', api.auth.login);

    //---------------Packages API------------------
    /**
     * @api {get} /api/packages/all Get All Packages
     * @apiName GetPackages
     * @apiGroup Package
     *
     * @apiHeader {String} x-access-token Users unique access-key.
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *      "response": {
     *       "success": "true",
     *       "message": {"packages": "Array of packages"}
     *       }
     *     }
     */
    app.get('/api/packages/all', auth.isAuth, api.packages.all);

    /**
     * @api {post} /api/packages/add Add Package
     * @apiName AddPackage
     * @apiGroup Package
     *
     * @apiHeader {String} x-access-token Users unique access-key.
     *
     * @apiParam {String} name Mandatory Name
     * @apiParam {String} description Mandatory Description
     * @apiParam {Number} hours Mandatory Hours
     * @apiParam {String} devices Mandatory Number of Devices
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *      "response": {
     *       "success": "true",
     *       "message": {"package": "Package object"}
     *       }
     *     }
     */
    app.post('/api/packages/add', auth.isAuth, api.packages.add);

    //---------------User API-------------------
    /**
     * @api {post} /api/user/current Get Current User
     * @apiName CurrentUser
     * @apiGroup User
     *
     * @apiHeader {String} x-access-token Users unique access-key.
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *      "response": {
     *       "success": "true",
     *       "message": {"user": "User object"}
     *       }
     *     }
     */
    app.get('/api/user/current', auth.isAuth, api.users.currentUser);

    /**
     * @api {post} /api/user/purchase Purchase Package
     * @apiName PurchasePackage
     * @apiGroup User
     *
     * @apiHeader {String} x-access-token Users unique access-key.
     *
     * @apiParam {String} packageId Mandatory Package Id
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *      "response": {
     *       "success": "true",
     *       "message": {"user": "User object"}
     *       }
     *     }
     */
    app.post('/api/user/purchase', auth.isAuth, api.users.purchase);

    /**
     * @api {post} /api/user/register/slave Register Slave Device
     * @apiName RegisterSlaveDevice
     * @apiGroup User
     *
     * @apiHeader {String} x-access-token Users unique access-key.
     *
     * @apiParam {String} deviceId Mandatory Device Id
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *      "response": {
     *       "success": "true",
     *       "message": {"user": "User Object"}
     *       }
     *     }
     */
    app.post('/api/user/register/slave', auth.isAuth, api.users.registerSlave);

    /**
     * @api {post} /api/user/register/master Register Master Device
     * @apiName RegisterMaserDevice
     * @apiGroup User
     *
     * @apiHeader {String} x-access-token Users unique access-key.
     *
     * @apiParam {String} deviceId Mandatory Device Id
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *      "response": {
     *       "success": "true",
     *       "message": {"user": "User Object"}
     *       }
     *     }
     */
    app.post('/api/user/register/master', auth.isAuth, api.users.registerMaster);

    //----------------Error Handler-------------------
    app.use(api.error.error);
};