var request = require('request'),
    config = require('../config/index'),
    base = 'https://' + config.restcomm.account_sid + ':' + config.restcomm.auth_token + '@tadhack.restcomm.com/restcomm/2012-04-24/',
    clientsApi = base + 'Accounts/' + config.restcomm.account_sid + '/Clients.json';

function getClient(parent, callback) {
    callback = callback || function () {
        };

    request.get(clientsApi, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var myClients = [];
            JSON.parse(body).forEach(function (user) {
                var name = user.login.split('@');
                if (name[0] == parent.username) {
                    myClients.push(user);
                }
            });
            callback(null, myClients);
        }
        else callback(error);
    });
}

function createClient(deviceId, parent, callback) {
    callback = callback || function () {
        };

    request.post({
        url: clientsApi,
        form: {Login: parent.username + '@' + deviceId, Password: parent.username + '@' + deviceId}
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(null, JSON.parse(body));
        }
        else callback(error);
    });
}

module.exports = {
    createClient: createClient
};