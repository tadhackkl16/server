var request = require('request'),
    uuid = require('uuid'),
    config = require('../config/index'),
    base_payment = "https://api.axiata.com/payment/v1/60191122333/transactions/amount",
    base_sms = "https://api.axiata.com/smsmessaging/v1/outbound/33221/requests";


var header = {'Authorization': 'Bearer a99c14f6f716eabea562bb4254618817'};


Date.prototype.myTime = function() {
    var yyyy = this.getFullYear().toString();
    var MM = pad(this.getMonth() + 1,2);
    var dd = pad(this.getDate(), 2);
    var hh = pad(this.getHours(), 2);
    var mm = pad(this.getMinutes(), 2);
    var ss = pad(this.getSeconds(), 2);
    return yyyy + MM + dd+  hh + mm + ss;
};


function pad(number, length) {var str = '' + number;while (str.length < length) {str = '0' + str;}return str;}

function sms(msisdn, message, callback) {
    callback = callback || function () {
        };

    var date = new Date().myTime()+"-1012-"+uuid.v4();

    var payload_sms = {
        outboundSMSMessageRequest: {
            senderAddress: "tel:+33221",
            senderName: "MoniCam",
            clientCorrelator: date,
            outboundSMSTextMessage: {
                message: message
            },
            address: [
                "tel:+60191122333"
            ],
            receiptRequest: {
                notifyURL: "http://application.example.com/notifications/DeliveryInfoNotification",
                callbackData: "some-data-useful-to-the-requester"
            }
        }
    };

    request({
            url: base_sms,
            method: 'POST',
            json: payload_sms,
            headers: header},
        function (error, response, body) {
            if (!error) {
                console.log("Sending to: "+ msisdn);
                console.log("Url: "+base_sms);
                console.log("Response code axiata sms: "+response.statusCode);
                console.log("Response form axiata sms: "+body);
                callback(null, body);
            }
            else callback(error);
        });
}


function charge(msidn, amount, callback) {
    callback = callback || function () {
        };

    var date = new Date().myTime()+"-0946-"+uuid.v4();
    var payload_payment = {
        amountTransaction: {
            clientCorrelator: date,
            endUserId: "tel:+60191122333",
            paymentAmount: {
                chargingInformation: {
                    amount: amount,
                    currency: "USD",
                    description: "MoniCam plan"
                },
                chargingMetaData: {
                    onBehalfOf: "MoniCam",
                    purchaseCategoryCode: "Default",
                    channel: "WAP",
                    taxAmount: "0"
                }
            },
            referenceCode: "REF-12345",
            transactionOperationStatus: "Charged"
        }
    };

    request({
            url: base_payment,
            method: 'POST',
            json: payload_payment,
            headers: header},
        function (error, response, body) {
            if (!error) {
                console.log("Sending to: "+ msisdn);
                console.log("Url: "+base_payment);
                console.log("Response code axiata charge: "+response.statusCode);
                console.log("Response form axiata charge: "+body);
                callback(null, body);
            }
            else callback(error);
        });
}

module.exports = {
    charge: charge,
    sms: sms
};