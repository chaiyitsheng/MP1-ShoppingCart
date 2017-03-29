var AWS = require('aws-sdk');
var Boom = require('boom');
var uuid = require('uuid');
var Joi = require('joi');

var registerLoginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().max(32).required(),
});

AWS.config.update({
    region: "MALAYSIA"
});
var dynamodbDoc = new AWS.DynamoDB.DocumentClient();

var registration = {};

registration.register = function(request, reply) {
    console.log(request.payload);

    var params = {
        TableName: "Users",
        Key: {
            "email": request.payload.email
        },
        FilterExpression: "email = :emailString",
        ExpressionAttributeValues: {
            ':emailString': request.payload.email
        }
    };

    dynamodbDoc.scan(params, function(err, data) {
        if (err) {
            console.log(JSON.stringify(err, null, 2));
        } else {
            console.log(data);
            if (data.Count === 1) {
                reply(Boom.badRequest('email already exists'));
            } else if (data.Count === 0) {
                var params1 = {
                    TableName: "Users",
                    Item: {
                        "id": uuid.v1(),
                        "email": request.payload.email,
                        "password": request.payload.password,
                        "controlObj": {
                            uuRole: null
                        },
                        "infoObj": {
                            uuLastName: null,
                            uuFirstName: null,
                            uuIcNo: null,
                            uuDob: null,
                            uuAdd1: null,
                            uuAdd2: null,
                            uuPostcode: null,
                            uuTowncity: null,
                            uuState: null,
                            uuHomeTelNo: null,
                            uuMobileTelNo: null,
                            uuGender: null,
                            uuShipAdd1: null,
                            uuShipAdd2: null,
                            uuShipPostcode: null,
                            uuShipTowncity: null,
                            uuShipState: null
                        }
                    }
                };
                dynamodbDoc.put(params1, function(err, data) {
                    if (err) {
                        console.error("Unable to add User", JSON.stringify(err, null, 2));
                    } else {
                        reply('New User Saved')
                    }
                });
            } else {
                reply(Boom.badRequest('email already exists'));
            }
        }
    });
};

module.exports = registration;