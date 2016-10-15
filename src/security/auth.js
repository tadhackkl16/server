var authToken = require('./authToken');

module.exports = {
    isAuth: function (req, res, next) {
        var token = req.headers['x-access-token'];
        //var token = req.query.token;
        console.log("Token: " + (token || "Empty"));
        if (token) {
            authToken.verifyToken(token, function (err, decoded) {
                if (err) res.status(401).json({response: {success: false, message: 'Not authenticated!'}});
                else {
                    req.decoded = req.user = decoded;
                    next();
                }
            })
        }
        else res.status(401).json({response: {success: false, message: 'Not authenticated!'}});
    }
};