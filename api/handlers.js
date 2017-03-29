var Joi = require('joi');
var Boom = require('boom');
var uuid = require('uuid');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var gm = require('gm').subClass({
    imageMagick: true
});
var async = require('async');
var Ref = require('./ref.js');
var flow = require('./lib/flow-node.js')('tmp');

var EnvOpts = {
    url:"http://1.1.1.1",
    mongourl:"mongodb://1.1.1.1:27017",
    PaymentGateWay:"https://pay.url",
    password : "password",
    ServiceID:"serviceID"
};

var crypto = require('crypto');

var Handlers = {};

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'user@email.com',
        pass: 'password'
    }
});

var hbsoptions = {
    viewEngine: hbs,
    viewPath: 'emailTemplates'
};

hbs.helpers = {
    decimal: function(text) {
        return text.toFixed(2);
    },
    formatdate: function(unixTime) {
        return new Date(+unixTime.replace(/\/Date\((\d+)\)\//, '$1'));
    }
};

transporter.use('compile', hbs(hbsoptions));


Handlers.register = function(request, reply) {
    var newUser = new User({
        "uuidv1": uuid.v1(),
        "uuCreationDate": Date.now(),
        "email": request.payload.email,
        "password": request.payload.password,
        "controlObj": {
            uuRole: null,
            isVerified: false
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
    });

    User.findOne({
        email: request.payload.email
    }, function(err, user) {
        if (err) {
            throw err;
        } else if (user) {
            reply(Boom.badRequest('email already exists'));
        } else {
            newUser.save(function(err, user) {
                if (err) {
                    reply(Boom.badRequest('Data not Valid'));
                } else {
                    // Send Token
                    var token = jwt.sign({
                        sub: user._id,
                        email: user.email,
                        iss: "21Cart",
                        iat: Date.now(),
                        scope: ['user']
                    }, Ref, {
                        algorithm: 'HS512'
                    });
                    reply({
                        token: token
                    });
                }
            });
        }
    });
};

Handlers.adminlogin = function(request, reply) {
    if (request.payload.email == 'yschai@riscmicro.com' || request.payload.email == 'ooi.dorothea@gmail.com') {
        User.findOne({
            email: request.payload.email
        }, function(err, user) {
            if (err) {
                throw err;
            } else if (user) {
                user.comparePasswords(request.payload.password, function(err, isMatch) {
                    if (err) {
                        return reply(Boom.badRequest(err));
                    } else if (!isMatch) {
                        return reply(Boom.unauthorized('Login not Valid'));
                    } else {
                        var token = jwt.sign({
                            sub: user._id,
                            email: user.email,
                            iss: "21Cart",
                            iat: Date.now(),
                            scope: ['admin']
                        }, Ref, {
                            algorithm: 'HS512'
                        });
                        reply({
                            token: token
                        });
                    }
                })
            } else {
                reply(Boom.unauthorized('Login not Valid'));
            }
        });
    } else {
        reply(Boom.unauthorized('Login not Valid yo'));
    };
};

Handlers.login = function(request, reply) {
    User.findOne({
        email: request.payload.email
    }, function(err, user) {
        if (err) {
            throw err;
        } else if (user) {
            user.comparePasswords(request.payload.password, function(err, isMatch) {
                if (err) {
                    return reply(Boom.badRequest(err));
                } else if (!isMatch) {
                    return reply(Boom.unauthorized('Login not Valid'));
                } else {
                    var token = jwt.sign({
                        sub: user._id,
                        email: user.email,
                        iss: "21Cart",
                        iat: Date.now(),
                        scope: ['user']
                    }, Ref, {
                        algorithm: 'HS512'
                    });
                    reply({
                        token: token
                    });
                }
            })
        } else {
            reply(Boom.unauthorized('Login not Valid'));
        }
    });
};

Handlers.getProduct = function(request, reply) {
    // request.headers.referer == 'http://localhost:3000/admin21cart' || request.headers.referer == 'http://localhost:3000/'
    if (request.headers.referer) {
        if (request.params.category == 'all') {
            obj = {}
        } else {
            obj = {
                'infoObj.pdCategory': request.params.category
            }
        }
        Product.find(obj, 'infoObj pdCode pdName pdImages.pdImg1 _id pdSellingPrice pdRetailPrice', function(err, product) {
            reply(product);
        });
    } else {
        reply(Boom.unauthorized('Not Authorized'));
    }
};

Handlers.getProductDetails = function(request, reply) {
    Product.findOne({
        _id: request.params.id
    }, 'infoObj pdName pdCode pdImages.pdImg1 pdImages.pdImg2 pdImages.pdImg3 pdImages.pdImg4 pdImages.pdImg5 pdImages.pdImg6 pdImages.pdImg7 pdImages.pdImg8 _id pdSellingPrice pdRetailPrice pdOverview pdDescription pdFinePrint pdShippingInfo pdWarranty pdOptions', function(err, product) {
        reply(product);
    })
};

Handlers.userProfile = function(request, reply) {
    var obj = {
        email: request.auth.credentials.email
    };
    User.findOne(obj, function(err, user) {
        if (err) {
            throw err;
        } else if (user) {
            reply(user);
        };
    });
};

Handlers.userProfileUpdate = function(request, reply) {
    var obj = {
        email: request.auth.credentials.email
    };
    User.update(obj, {
        infoObj: {
            "uuLastName": request.payload.uuLastName,
            "uuFirstName": request.payload.uuFirstName,
            "uuGender": request.payload.uuGender,
            "uuDob": request.payload.uuDob,
            "uuIcNo": request.payload.uuIcNo,
            "uuAdd1": request.payload.uuAdd1,
            "uuAdd2": request.payload.uuAdd2,
            "uuAdd3": request.payload.uuAdd3,
            "uuAdd4": request.payload.uuAdd4,
            "uuPostcode": request.payload.uuPostcode,
            "uuTowncity": request.payload.uuTowncity,
            "uuState": request.payload.uuState,
            "uuHomeTelNo": request.payload.uuHomeTelNo,
            "uuMobileTelNo": request.payload.uuMobileTelNo,
            "uuShipAdd1": request.payload.uuShipAdd1,
            "uuShipAdd2": request.payload.uuShipAdd2,
            "uuShipAdd3": request.payload.uuShipAdd3,
            "uuShipAdd4": request.payload.uuShipAdd4,
            "uuShipPostcode": request.payload.uuShipPostcode,
            "uuShipTowncity": request.payload.uuShipTowncity,
            "uuShipState": request.payload.uuShipState
        }
    }, function(err) {
        if (err) {
            reply(Boom.badRequest({
                message: "error"
            }));
        } else
            reply({
                message: "ok1"
            });
    });
};

Handlers.writeFile = function(request, reply) {
    // console.log(request.payload);
    // var path = "./" + request.payload.id + "Image.jpg";
    // var file = fs.createWriteStream(path);
    // request.payload.file.pipe(file);
    // request.payload.file.on('end', function() {
    //     console.log("file saved");
    //     gm("./" + request.payload.id + "Image.jpg")
    //         .resize(240, 240)
    //         .noProfile()
    //         .write("./thumbnail" + request.payload.id + "Image.jpg", function(err) {
    //             if (!err) console.log('thumbnail saved');
    //         });
    //     reply('ok');
    // })
    reply('ok');
};

Handlers.productCreateObject = function(request, reply) {
    var newProduct = new Product({
        uuidv1: uuid.v1(),
        pdCode: null,
        controlObj: {},
        infoObj: {
            pdName: request.payload.name,
            pdCodeUpc: null,
            pdCategory: null,
            pdSubCategory: null,
            pdAvailableQty: null,
            pdRetailPrice: null,
            pdSellingPrice: null,
            pdCostPrice: null,
            pdShipWeight: {
                actual: null,
                length: null,
                width: null,
                height: null
            },
            pdSize: {
                measure: {
                    weight: null,
                    volume: null,
                    size: null
                },
                measureOptions: {}
            },
            pdExpiryDate: null,
            pdMfgDate: null,
            pdCreationDate: Date.now(),
            pdCreatorId: request.auth.credentials.email,
            pdImages: {
                pdImg1: null,
                pdImg2: null,
                pdImg3: null,
                pdImg4: null,
                pdImg5: null,
                pdImg6: null,
                pdImg7: null,
                pdImg8: null
            },
            pdDescription: {
                text: null
            },
            pdFinePrint: {
                text: null
            },
            pdShippingInfo: {
                text: null
            },
            pdCollectionInfo: {
                text: null
            },
            pdWarranty: {
                text: null
            },
            pdOverview: {
                text: null
            },
            pdOptions: []
        }
    });
    newProduct.save(function(err) {
        if (err) {
            console.log(err);
            reply(Boom.badRequest({
                message: "error"
            }));
        } else {
            reply(newProduct);
        }
    });
};

Handlers.productCreateFlow = function(request, reply) {
    // console.log("flow!!!!!!!!!!!!!!!!!!");
    // console.log(request.payload.flowFilename);
    // var name = request.payload.file.hapi.filename;
    var path = "../../pics/./images/" + request.payload.flowFilename;
    var file = fs.createWriteStream(path);
    request.payload.file.pipe(file);
    request.payload.file.on('end', function() {
        // console.log("file saved");
        gm("../../pics/./images/" + request.payload.flowFilename)
            .resize(240, 240)
            .noProfile()
            .write("../../pics/./resized/" + "thumbnail" + request.payload.flowFilename, function(err) {
                if (!err) console.log('thumbnail saved');
            });
        reply('ok');
    });

    // flow.post(request.raw.req, function(status, filename, original_filename, identifier) {
    //     var stream = fs.createWriteStream("../../pics/./images/" + filename);
    //     flow.write(identifier, stream, {}, function(err, state) {
    //         console.log("writing!!");
    //         if (err) {
    //             console.log(err);
    //         } else if (state == true) {
    //             console.log(state);
    //             gm("../../pics/./images/" + filename)
    //                 .resize('200', '200', "!")
    //                 .write("../../pics/./resized/"+"thumbnail" + filename, function(err) {
    //                     if (!err) console.log('done' + filename);
    //                 });
    //         }
    //     });
    //     flow.clean(identifier);

    //     reply({
    //         filename: filename
    //     });
    // });    
};

Handlers.productUpdate = function(request, reply) {
    var obj = {
        _id: request.payload._id
    };
    // console.log(request.payload);
    Product.findOneAndUpdate(obj, request.payload, function(err, product) {
        if (err) {
            reply(Boom.badRequest({
                message: "productUpdateError!"
            }))
        } else if (product) {
            reply('productUpdateOK!');
        };
    });
};

Handlers.productEdit = function(request, reply) {
    console.log(request.payload);
    var obj = {
        _id: request.payload._id
    }
    Product.find(obj, function(err, product) {
        console.log(product);
        reply(product);
    })
};

Handlers.productDelete = function(request, reply) {
    var obj = {
        _id: request.payload._id
    }
    Product.findOneAndRemove(obj, function(err, product) {
        if (err) {
            reply(Boom.badRequest({
                message: "productDeleteError!"
            }));
        } else {
            if (product.infoObj.pdImages.pdImg1) {
                fs.unlink('../../pics/./images/' + product.infoObj.pdImages.pdImg1);
                fs.unlink('../../pics/./resized/' + 'thumbnail' + product.infoObj.pdImages.pdImg1);
            }
            if (product.infoObj.pdImages.pdImg2) {
                fs.unlink('../../pics/./images/' + product.infoObj.pdImages.pdImg2);
                fs.unlink('../../pics/./resized/' + 'thumbnail' + product.infoObj.pdImages.pdImg2);
            }
            if (product.infoObj.pdImages.pdImg3) {
                fs.unlink('../../pics/./images/' + product.infoObj.pdImages.pdImg3);
                fs.unlink('../../pics/./resized/' + 'thumbnail' + product.infoObj.pdImages.pdImg3);
            }
            if (product.infoObj.pdImages.pdImg4) {
                fs.unlink('../../pics/./images/' + product.infoObj.pdImages.pdImg4);
                fs.unlink('../../pics/./resized/' + 'thumbnail' + product.infoObj.pdImages.pdImg4);
            }
            if (product.infoObj.pdImages.pdImg5) {
                fs.unlink('../../pics/./images/' + product.infoObj.pdImages.pdImg5);
                fs.unlink('../../pics/./resized/' + 'thumbnail' + product.infoObj.pdImages.pdImg5);
            }
            if (product.infoObj.pdImages.pdImg6) {
                fs.unlink('../../pics/./images/' + product.infoObj.pdImages.pdImg6);
                fs.unlink('../../pics/./resized/' + 'thumbnail' + product.infoObj.pdImages.pdImg6);
            }
            if (product.infoObj.pdImages.pdImg7) {
                fs.unlink('../../pics/./images/' + product.infoObj.pdImages.pdImg7);
                fs.unlink('../../pics/./resized/' + 'thumbnail' + product.infoObj.pdImages.pdImg7);
            }
            if (product.infoObj.pdImages.pdImg8) {
                fs.unlink('../../pics/./images/' + product.infoObj.pdImages.pdImg8);
                fs.unlink('../../pics/./resized/' + 'thumbnail' + product.infoObj.pdImages.pdImg8);
            }
            reply('productDeleteOK!');
        };
    });
};

Handlers.checkShipping = function(request, reply) {
    User.findOne({
        email: request.auth.credentials.email
    }, function(err, user) {
        var rawOrderObject = request.payload;
        rawOrderObject.odUser = user;
        // console.log(request.auth.credentials);
        var returnOrderObject = {};
        var shippingZone = 0;

        function verifyShipping(item, callback) {
            if (item) {
                Product.findOne({
                    _id: item.id
                }, function(err, product) {
                    if (err) {
                        throw err;
                    } else {
                        if (item.price == product.infoObj.pdSellingPrice) {
                            item.check = true;
                            item.checksubTotal = item.qty * product.infoObj.pdSellingPrice;
                            item.weight = Math.max(product.infoObj.pdShipWeight.actual, product.infoObj.pdShipWeight.length * product.infoObj.pdShipWeight.height * product.infoObj.pdShipWeight.width / 6000);
                            item.actualWeight = product.infoObj.pdShipWeight.actual;
                            item.volumetricWeight = product.infoObj.pdShipWeight.length * product.infoObj.pdShipWeight.height * product.infoObj.pdShipWeight.width / 6000;
                            item.destination = rawOrderObject.odUser.uuShipState;
                            item.weightSubTotal = item.qty * item.weight
                            callback(null, item);
                        } else {
                            item.check = false;
                            item.checksubTotal = item.qty * product.infoObj.pdSellingPrice;
                            item.weight = Math.max(product.infoObj.pdShipWeight.actual, product.infoObj.pdShipWeight.length * product.infoObj.pdShipWeight.height * product.infoObj.pdShipWeight.width / 6000);
                            item.actualWeight = product.infoObj.pdShipWeight.actual;
                            item.volumetricWeight = product.infoObj.pdShipWeight.length * product.infoObj.pdShipWeight.height * product.infoObj.pdShipWeight.width / 6000;
                            item.destination = rawOrderObject.odUser.uuShipState;
                            item.weightSubTotal = item.qty * item.weight
                            callback(null, item);
                        }
                    }
                });
            };
        };
        async.map(rawOrderObject.cc, verifyShipping, function(e, r) {
            var TotalCheckSum = 0;
            var TotalShippingWeight = 0;

            for (i = 0; i < r.length; i++) {
                TotalCheckSum = TotalCheckSum + r[i].checksubTotal;
                TotalShippingWeight = TotalShippingWeight + r[i].weightSubTotal;
            };

            var weightBand = function(weight) {
                switch (true) {
                    case (weight <= 0.500):
                        returnOrderObject.weightBand = 1;
                        break;
                    case (0.501 <= weight && weight <= 0.750):
                        returnOrderObject.weightBand = 2;
                        break;
                    case (0.751 <= weight && weight <= 1.000):
                        returnOrderObject.weightBand = 3;
                        break;
                    case (1.001 <= weight && weight <= 1.25):
                        returnOrderObject.weightBand = 4;
                        break;
                    case (1.251 <= weight && weight <= 1.500):
                        returnOrderObject.weightBand = 5;
                        break;
                    case (1.501 <= weight && weight <= 1.750):
                        returnOrderObject.weightBand = 6;
                        break;
                    case (1.751 <= weight && weight <= 2.000):
                        returnOrderObject.weightBand = 7;
                        break;
                    case (2.001 <= weight && weight <= 2.500):
                        returnOrderObject.weightBand = 8;
                        break;
                    case (2.501 <= weight && weight <= 3.000):
                        returnOrderObject.weightBand = 9;
                        break;
                    case (3.001 <= weight && weight <= 3.500):
                        returnOrderObject.weightBand = 10;
                        break;
                    case (3.501 <= weight):
                        returnOrderObject.weightBand = 10;
                        break;
                };
            };

            weightBand(TotalShippingWeight);

            var shippingZoneCalc = function(ship) {
                switch (ship) {
                    case "Wilayah Persekutuan Kuala Lumpur":
                        returnOrderObject.zone = "a"
                        break;
                    case "Wilayah Persekutuan Labuan":
                        returnOrderObject.zone = "e"
                        break;
                    case "Wilayah Persekutuan Putrajaya":
                        returnOrderObject.zone = "b"
                        break;
                    case "Selangor":
                        returnOrderObject.zone = "a"
                        break;
                    case "Pulau Pinang":
                        returnOrderObject.zone = "b"
                        break;
                    case "Perak":
                        returnOrderObject.zone = "b"
                        break;
                    case "Johor":
                        returnOrderObject.zone = "b"
                        break;
                    case "Melaka":
                        returnOrderObject.zone = "b"
                        break;
                    case "Negeri Sembilan":
                        returnOrderObject.zone = "b"
                        break;
                    case "Perlis":
                        returnOrderObject.zone = "b"
                        break;
                    case "Kedah":
                        returnOrderObject.zone = "b"
                        break;
                    case "Kelantan":
                        returnOrderObject.zone = "b"
                        break;
                    case "Terengganu":
                        returnOrderObject.zone = "b"
                        break;
                    case "Pahang":
                        returnOrderObject.zone = "b"
                        break;
                    case "Sabah":
                        returnOrderObject.zone = "e"
                        break;
                    case "Sarawak":
                        returnOrderObject.zone = "d"
                        break;
                };
            };

            shippingZoneCalc(user.infoObj.uuShipState);
            returnOrderObject.weightCode = returnOrderObject.weightBand + returnOrderObject.zone;
            var shippingRateCalc = function(weightCode) {
                switch (weightCode) {
                    case "1a":
                        // returnOrderObject.cost = 0
                        returnOrderObject.cost = 4.65
                        break;
                    case "1b":
                        returnOrderObject.cost = 5.96
                        break;
                    case "1c":
                        returnOrderObject.cost = 7.95
                        break;
                    case "1d":
                        returnOrderObject.cost = 8.60
                        break;
                    case "1e":
                        returnOrderObject.cost = 9.30
                        break;
                    case "2a":
                        returnOrderObject.cost = 5.70
                        break;
                    case "2b":
                        returnOrderObject.cost = 7.30
                        break;
                    case "2c":
                        returnOrderObject.cost = 9.95
                        break;
                    case "2d":
                        returnOrderObject.cost = 10.60
                        break;
                    case "2e":
                        returnOrderObject.cost = 11.95
                        break;
                    case "3a":
                        returnOrderObject.cost = 6.75
                        break;
                    case "3b":
                        returnOrderObject.cost = 8.60
                        break;
                    case "3c":
                        returnOrderObject.cost = 11.95
                        break;
                    case "3d":
                        returnOrderObject.cost = 12.60
                        break;
                    case "3e":
                        returnOrderObject.cost = 14.60
                        break;
                    case "4a":
                        returnOrderObject.cost = 7.80
                        break;
                    case "4b":
                        returnOrderObject.cost = 9.95
                        break;
                    case "4c":
                        returnOrderObject.cost = 13.90
                        break;
                    case "4d":
                        returnOrderObject.cost = 14.60
                        break;
                    case "4e":
                        returnOrderObject.cost = 17.25
                        break;
                    case "5a":
                        returnOrderObject.cost = 8.90
                        break;
                    case "5b":
                        returnOrderObject.cost = 11.25
                        break;
                    case "5c":
                        returnOrderObject.cost = 15.90
                        break;
                    case "5d":
                        returnOrderObject.cost = 16.55
                        break;
                    case "5e":
                        returnOrderObject.cost = 19.90
                        break;
                    case "6a":
                        returnOrderObject.cost = 9.95
                        break;
                    case "6b":
                        returnOrderObject.cost = 12.60
                        break;
                    case "6c":
                        returnOrderObject.cost = 17.90
                        break;
                    case "6d":
                        returnOrderObject.cost = 18.55
                        break;
                    case "6e":
                        returnOrderObject.cost = 22.55
                        break;
                    case "7a":
                        returnOrderObject.cost = 11.00
                        break;
                    case "7b":
                        returnOrderObject.cost = 13.90
                        break;
                    case "7c":
                        returnOrderObject.cost = 19.90
                        break;
                    case "7d":
                        returnOrderObject.cost = 20.55
                        break;
                    case "7e":
                        returnOrderObject.cost = 25.20
                        break;
                    case "8a":
                        returnOrderObject.cost = 12.60
                        break;
                    case "8b":
                        returnOrderObject.cost = 21.20
                        break;
                    case "8c":
                        returnOrderObject.cost = 27.85
                        break;
                    case "8d":
                        returnOrderObject.cost = 34.45
                        break;
                    case "8e":
                        returnOrderObject.cost = 41.10
                        break;
                    case "9a":
                        returnOrderObject.cost = 13.25
                        break;
                    case "9b":
                        returnOrderObject.cost = 23.85
                        break;
                    case "9c":
                        returnOrderObject.cost = 31.80
                        break;
                    case "9d":
                        returnOrderObject.cost = 39.10
                        break;
                    case "9e":
                        returnOrderObject.cost = 46.40
                        break;
                    case "10a":
                        returnOrderObject.cost = 13.90
                        break;
                    case "10b":
                        returnOrderObject.cost = 26.50
                        break;
                    case "10c":
                        returnOrderObject.cost = 35.80
                        break;
                    case "10d":
                        returnOrderObject.cost = 43.75
                        break;
                    case "10e":
                        returnOrderObject.cost = 51.70
                        break;
                };
            };
            shippingRateCalc(returnOrderObject.weightCode);
            returnOrderObject.TotalWeight = TotalShippingWeight;
            reply(returnOrderObject);
        });
    });
};


Handlers.productOrder = function(request, reply) {
    // From Client
    //             $scope.confirmOrderDataObject = {
    //                 c: authToken.getToken(),
    //                 cc: $scope.cart(),
    //                 ccc: $scope.cartTotalSelling(),
    //                 cccc: $scope.payObj,
    //                 ship:$scope.shippingInfo,
    //             };

    User.findOne({
        email: request.auth.credentials.email
    }, function(err, user) {
        // Start of Functions
        user.password = null;
        var rawOrderObject = request.payload;
        rawOrderObject.odUser = user;
        rawOrderObject.cccc.odDate = Date.now();

        var getNextSequence = function(name) {
            Counter.findOneAndUpdate({
                'incrementId': name
            }, {
                $inc: {
                    seq: 1
                }
            }, function(err, item) {
                return item.seq;

            })
        };

        function verifyOrder(item, callback) {
            if (item) {
                Product.findOne({
                    _id: item.id
                }, function(err, product) {
                    if (err) {
                        throw err;
                    } else {
                        if (item.sellingprice == product.infoObj.pdSellingPrice) {
                            item.check = true;
                            item.checksubTotal = item.qty * product.infoObj.pdSellingPrice;
                            item.weight = Math.max(product.infoObj.pdShipWeight.actual, product.infoObj.pdShipWeight.length * product.infoObj.pdShipWeight.height * product.infoObj.pdShipWeight.width / 6000);
                            item.actualWeight = product.infoObj.pdShipWeight.actual;
                            item.volumetricWeight = product.infoObj.pdShipWeight.length * product.infoObj.pdShipWeight.height * product.infoObj.pdShipWeight.width / 6000;
                            item.destination = rawOrderObject.odUser.uuShipState;
                            callback(null, item);
                        } else {
                            item.check = false;
                            item.checksubTotal = item.qty * product.infoObj.pdSellingPrice;
                            item.weight = Math.max(product.infoObj.pdShipWeight.actual, product.infoObj.pdShipWeight.length * product.infoObj.pdShipWeight.height * product.infoObj.pdShipWeight.width / 6000);
                            item.actualWeight = product.infoObj.pdShipWeight.actual;
                            item.volumetricWeight = product.infoObj.pdShipWeight.length * product.infoObj.pdShipWeight.height * product.infoObj.pdShipWeight.width / 6000;
                            callback(null, item);
                        }
                    }
                });
            };
        };

        async.map(rawOrderObject.cc, verifyOrder, function(e, r) {
            var TotalCheckSum = 0;
            var returnOrderObject = {};

            for (i = 0; i < r.length; i++) {
                TotalCheckSum = TotalCheckSum + r[i].checksubTotal;
            };

            if (TotalCheckSum == rawOrderObject.ccc) {

                // sendEmail('Order Confirmation', '<h3 style="color:gray">Thank you for your order!</h3><br>' + '<h3> You have ordered: </h3> <br><br>' + req.body.cc[0].name + '   Quantity: ' + req.body.cc[0].qty + '  Price: RM ' + req.body.cc[0].price + '<br>' + 'Total is: ' + req.body.ccc)
                returnOrderObject.odUser = rawOrderObject.odUser;
                returnOrderObject.dd = r;
                returnOrderObject.ddd = TotalCheckSum;
                returnOrderObject.odTotal = TotalCheckSum + rawOrderObject.ship.cost;
                returnOrderObject.shipCost = rawOrderObject.ship.cost;
                returnOrderObject.payMethod = rawOrderObject.cccc.odPayMethod;

                var orderData = {
                    // uuidv1: uuid.v1(),
                    // odCreationDate: Date.now(),
                    odUser: user,
                    odTotal: rawOrderObject.ccc + rawOrderObject.ship.cost,
                    odCart: rawOrderObject.cc,
                    odCartTotalAmount: rawOrderObject.ccc,
                    controlObj: {
                        odToken: rawOrderObject.c,
                        odStatus: 'new'
                    },
                    odShip: {
                        odShipWayBillBarcode: null,
                        odShipWayBillDate: null,
                        odShipOutDate: null,
                        odTotalWeight: rawOrderObject.ship.TotalWeight,
                        odCost: rawOrderObject.ship.cost,
                        odWeightCode: rawOrderObject.ship.weightCode,
                        odZone: rawOrderObject.ship.zone,
                        odWeightBand: rawOrderObject.ship.weightBand
                    },
                    odPayObj: {
                        payment: "none"
                    }
                };

                // var newOrder = new Order({
                //     uuidv1: uuid.v1(),
                //     odCreationDate: Date.now(),
                //     odUser: user,
                //     odTotal: rawOrderObject.ccc + rawOrderObject.ship.cost,
                //     odCart: rawOrderObject.cc,
                //     odCartTotalAmount: rawOrderObject.ccc,
                //     controlObj: {
                //         odToken: rawOrderObject.c,
                //         odStatus: 'new'
                //     },
                //     odShip: {
                //         odShipWayBillBarcode: null,
                //         odShipWayBillDate: null,
                //         odShipOutDate: null,
                //         odTotalWeight: rawOrderObject.ship.TotalWeight,
                //         odCost: rawOrderObject.ship.cost,
                //         odWeightCode: rawOrderObject.ship.weightCode,
                //         odZone: rawOrderObject.ship.zone,
                //         odWeightBand: rawOrderObject.ship.weightBand
                //     },
                //     odPayObj: {payment:"none"}
                // });

                // Insert into Database
                // newOrder.save(function(err, order) {
                //     if (err) {
                //         res.status(400).json({
                //             'order': 'Error!'
                //         });
                //     } else {
                //         order.odUser.password = null;
                //         order.odPayObj.odDate = null;
                //         order.odPayObj.odPayDate = null;
                //         order.odPayObj.odCardType = null;
                //         order.odPayObj.odCardNumber = null;
                //         order.odController = null;
                //         reply(order);
                //     }
                // });
                reply(orderData);
            } else if (TotalCheckSum != rawOrderObject.ccc) {
                reply(Boom.badRequest({
                    'order': 'Error!'
                }));
            }
        });
    });
};
                        // Email Confirmation
                        // transporter.sendMail({
                        //     from: '"21cart Customer Care" <hello@21cart.com>',
                        //     to: user.email,
                        //     subject: 'Your Order ' + 'odm1053' + order.odCode + ' Has Been Received',
                        //     template: 'confirmEmail',
                        //     context: {
                        //         odCode: order.odCode,
                        //         odTotal: function() {
                        //             return order.odTotal.toFixed(2)
                        //         },
                        //         odCartTotalAmount: function() {
                        //             return order.odCartTotalAmount.toFixed(2)
                        //         },
                        //         odShip: function() {
                        //             return order.odShip.odCost.toFixed(2)
                        //         },
                        //         uuFirstName: order.odUser.infoObj.uuFirstName,
                        //         uuLastName: order.odUser.infoObj.uuLastName,
                        //         uuShipAdd1: order.odUser.infoObj.uuShipAdd1,
                        //         uuShipAdd2: order.odUser.infoObj.uuShipAdd2,
                        //         uuShipPostcode: order.odUser.infoObj.uuShipPostcode,
                        //         uuShipTowncity: order.odUser.infoObj.uuShipTowncity,
                        //         uuShipState: order.odUser.infoObj.uuShipState,
                        //         odPayMethod: order.odPayObj.odPayMethod,
                        //         odCart: order.odCart
                        //     }
                        // });

Handlers.productOrderSave = function(request, reply) {
    // From Client
    //             $scope.confirmOrderDataObject = {
    //                 c: authToken.getToken(),
    //                 cc: $scope.cart(),
    //                 ccc: $scope.cartTotalSelling(),
    //                 cccc: $scope.payObj,
    //                 ship:$scope.shippingInfo,
    //             };
    console.log(request.payload);

    User.findOne({
        email: request.auth.credentials.email
    }, function(err, user) {
        // Start of Functions
        user.password = null;
        var rawOrderObject = request.payload;
        rawOrderObject.odUser = user;
        rawOrderObject.cccc.odDate = Date.now();

        var getNextSequence = function(name) {
            Counter.findOneAndUpdate({
                'incrementId': name
            }, {
                $inc: {
                    seq: 1
                }
            }, function(err, item) {
                return item.seq;

            })
        };

        function verifyOrder(item, callback) {
            if (item) {
                Product.findOne({
                    _id: item.id
                }, function(err, product) {
                    if (err) {
                        throw err;
                    } else {
                        if (item.sellingprice == product.infoObj.pdSellingPrice) {
                            item.check = true;
                            item.checksubTotal = item.qty * product.infoObj.pdSellingPrice;
                            item.weight = Math.max(product.infoObj.pdShipWeight.actual, product.infoObj.pdShipWeight.length * product.infoObj.pdShipWeight.height * product.infoObj.pdShipWeight.width / 6000);
                            item.actualWeight = product.infoObj.pdShipWeight.actual;
                            item.volumetricWeight = product.infoObj.pdShipWeight.length * product.infoObj.pdShipWeight.height * product.infoObj.pdShipWeight.width / 6000;
                            item.destination = rawOrderObject.odUser.uuShipState;
                            callback(null, item);
                        } else {
                            item.check = false;
                            item.checksubTotal = item.qty * product.infoObj.pdSellingPrice;
                            item.weight = Math.max(product.infoObj.pdShipWeight.actual, product.infoObj.pdShipWeight.length * product.infoObj.pdShipWeight.height * product.infoObj.pdShipWeight.width / 6000);
                            item.actualWeight = product.infoObj.pdShipWeight.actual;
                            item.volumetricWeight = product.infoObj.pdShipWeight.length * product.infoObj.pdShipWeight.height * product.infoObj.pdShipWeight.width / 6000;
                            callback(null, item);
                        }
                    }
                });
            };
        };

        async.map(rawOrderObject.cc, verifyOrder, function(e, r) {
            var TotalCheckSum = 0;
            var returnOrderObject = {};

            for (i = 0; i < r.length; i++) {
                TotalCheckSum = TotalCheckSum + r[i].checksubTotal;
            };

            if (TotalCheckSum == rawOrderObject.ccc) {

                // sendEmail('Order Confirmation', '<h3 style="color:gray">Thank you for your order!</h3><br>' + '<h3> You have ordered: </h3> <br><br>' + req.body.cc[0].name + '   Quantity: ' + req.body.cc[0].qty + '  Price: RM ' + req.body.cc[0].price + '<br>' + 'Total is: ' + req.body.ccc)
                returnOrderObject.odUser = rawOrderObject.odUser;
                returnOrderObject.dd = r;
                returnOrderObject.ddd = TotalCheckSum;
                returnOrderObject.odTotal = TotalCheckSum + rawOrderObject.ship.cost;
                returnOrderObject.shipCost = rawOrderObject.ship.cost;
                returnOrderObject.payMethod = rawOrderObject.cccc.odPayMethod;

                var newOrder = new Order({
                    uuidv1: uuid.v1(),
                    odCreationDate: Date.now(),
                    odUser: user,
                    odTotal: rawOrderObject.ccc + rawOrderObject.ship.cost,
                    odCart: rawOrderObject.cc,
                    odCartTotalAmount: rawOrderObject.ccc,
                    controlObj: {
                        odToken: rawOrderObject.c,
                        odStatus: 'new'
                    },
                    odShip: {
                        odShipWayBillBarcode: null,
                        odShipWayBillDate: null,
                        odShipOutDate: null,
                        odTotalWeight: rawOrderObject.ship.TotalWeight,
                        odCost: rawOrderObject.ship.cost,
                        odWeightCode: rawOrderObject.ship.weightCode,
                        odZone: rawOrderObject.ship.zone,
                        odWeightBand: rawOrderObject.ship.weightBand
                    },
                    odPayObj: {payment:"none"}
                });

                newOrder.save(function(err, order) {
                    if (err) {
                        res.status(400).json({
                            'order': 'Error!'
                        });
                    } else {
                        order.odUser.password = null;
                        order.odPayObj.odDate = null;
                        order.odPayObj.odPayDate = null;
                        order.odPayObj.odCardType = null;
                        order.odPayObj.odCardNumber = null;
                        order.odController = null;
                        // Email Confirmation
                        // transporter.sendMail({
                        //     from: '"cart Customer Care">',
                        //     to: user.email,
                        //     subject: 'Your Order ' + 'odm1023' + order.odCode + ' Has Been Received',
                        //     template: 'confirmEmail',
                        //     context: {
                        //         odCode: order.odCode,
                        //         odTotal: function() {
                        //             return order.odTotal.toFixed(2)
                        //         },
                        //         odCartTotalAmount: function() {
                        //             return order.odCartTotalAmount.toFixed(2)
                        //         },
                        //         odShip: function() {
                        //             return order.odShip.odCost.toFixed(2)
                        //         },
                        //         uuFirstName: order.odUser.infoObj.uuFirstName,
                        //         uuLastName: order.odUser.infoObj.uuLastName,
                        //         uuShipAdd1: order.odUser.infoObj.uuShipAdd1,
                        //         uuShipAdd2: order.odUser.infoObj.uuShipAdd2,
                        //         uuShipPostcode: order.odUser.infoObj.uuShipPostcode,
                        //         uuShipTowncity: order.odUser.infoObj.uuShipTowncity,
                        //         uuShipState: order.odUser.infoObj.uuShipState,
                        //         odPayMethod: order.odPayObj.odPayMethod,
                        //         odCart: order.odCart
                        //     }
                        // });
                        reply(order);
                    }
                });
            } else if (TotalCheckSum != rawOrderObject.ccc) {
                reply(Boom.badRequest({
                    'order': 'Error!'
                }));
            }
        });
    });
};


// Handlers.client_token = function(request, reply) {
//     gateway.clientToken.generate({}, function(err, tokenresponse) {
//         if (err) {
//             console.log(err)
//         } else {
//             reply(tokenresponse.clientToken);
//         }
//     });
// };

Handlers.ghl_token = function(request,reply){


var password = EnvOpts.password;
var ServiceID=EnvOpts.ServiceID;
var PaymentGateWay = EnvOpts.PaymentGateWay

var TransactionType="SALE";
var PymtMethod="ANY";
var PaymentID="odm1023"+request.payload.odCode;
var OrderNumber="odm1023"+request.payload.odCode;
var PaymentDesc="SALE";
var MerchantReturnURL=EnvOpts.url+"ReturnUrl";
var Amount=String(request.payload.odTotal.toFixed(2));
var CurrencyCode="MYR";
var HashValue= null;
var CustIP= request.info.remoteAddress;
var PageTimeout="780";
var CustName=request.payload.odUser.infoObj.uuFirstName;
var CustEmail= String(request.payload.odUser.email);
var CustPhone= request.payload.odUser.infoObj.uuMobileTelNo;
var CardHolder= null;

payObjOrigin= {
PaymentGateWay:PaymentGateWay,
TransactionType:TransactionType,
PymtMethod:PymtMethod,
ServiceID:ServiceID,
PaymentID:PaymentID,
OrderNumber:OrderNumber,
PaymentDesc:PaymentDesc,
MerchantReturnURL:MerchantReturnURL,
Amount:Amount,
CurrencyCode:CurrencyCode,
HashValue: null,
CustIP: CustIP,
PageTimeout:PageTimeout,
CustName:CustName,
CustEmail: CustEmail,
CustPhone: CustPhone,
CardHolder: CardHolder
}  

.ServiceID + payObjOrigin.PaymentID + payObjOrigin.MerchantReturnURL + payObjOrigin.Amount + payObjOrigin.CurrencyCode + payObjOrigin.CustIP + payObjOrigin.PageTimeout + payObjOrigin.CardNo; 
HashString0 = password + ServiceID + PaymentID + MerchantReturnURL + Amount + CurrencyCode + CustIP + PageTimeout; // console.log("HashString = "+HashString0)

var shaHash = crypto.createHash('sha256');
payObjOrigin.HashValue = shaHash.update(HashString0).digest('hex');
reply(payObjOrigin);


};



Handlers.ghlReturnUrl = function(request, reply) {
    if (request.payload.TxnMessage == "Transaction+Successful") {
        var rawReturnObj = request.payload;
        rawReturnObj.PaymentID = request.payload.PaymentID.slice(7);
        Order.update({
            odCode: rawReturnObj.PaymentID
        }, {
            odPayObj: rawReturnObj
        }, function(err, order) {
            Order.findOne({
                odCode: rawReturnObj.PaymentID
            }, function(err, order) {
                // console.log(order);
                // Email Confirmation
                transporter.sendMail({
                    from: '"Customer Care" <care@email.com>',
                    to: order.odUser.email,
                    subject: 'Your Order ' + 'odm1023' + order.odCode + ' Has Been Received',
                    template: 'confirmEmail',
                    context: {
                        odCode: order.odCode,
                        odTotal: function() {
                            return order.odTotal.toFixed(2)
                        },
                        odCartTotalAmount: function() {
                            return order.odCartTotalAmount.toFixed(2)
                        },
                        odShip: function() {
                            return order.odShip.odCost.toFixed(2)
                        },
                        uuFirstName: order.odUser.infoObj.uuFirstName,
                        uuLastName: order.odUser.infoObj.uuLastName,
                        uuShipAdd1: order.odUser.infoObj.uuShipAdd1,
                        uuShipAdd2: order.odUser.infoObj.uuShipAdd2,
                        uuShipPostcode: order.odUser.infoObj.uuShipPostcode,
                        uuShipTowncity: order.odUser.infoObj.uuShipTowncity,
                        uuShipState: order.odUser.infoObj.uuShipState,
                        odPayMethod: order.odPayObj.odPayMethod,
                        odCart: order.odCart
                    }
                });
                reply('<script>window.location.assign("'+EnvOpts.url+'#/paySuccess")</script>');
            });
        });
    } else {
        reply('<script>window.location.assign("'+EnvOpts.url+'#/payFailure")</script>');
    }
};

// Handlers.checkout = function(request, reply) {
//     console.log(request.payload);
//     var nonce = request.payload.payment_method_nonce;
//     var amount = request.payload.amount;
//     gateway.transaction.sale({
//         amount: amount,
//         paymentMethodNonce: nonce,
//         billing: {
//             postalCode: '60000',
//             streetAddress: "address"
//         },
//         options: {
//             submitForSettlement: true
//         },customFields:{orderid:request.payload.orderid}
//     }, function(err, result) {
//         if (err) {
//             console.log(err)
//         } else {
//             console.log(result.success);
//             reply(result);
//         }
//     });
// };

Handlers.analyse = function(request,reply){
// console.log({id:request.auth.credentials,data:request.payload,ip:request.info.remoteAddress});
reply('ok');    
};

Handlers.orderHistory = function(request,reply){
    var obj = {
        'odUser.email': request.auth.credentials.email
    };
    Order.find(obj, function(err, order) {
        reply(order);
    })
};

Handlers.orderHistoryDetail = function(request,reply){
    // console.log(request.payload);
    var obj = {
        '_id': request.payload._id
    };
    Order.find(obj, function(err, order) {
        reply(order);
    })
   
};

Handlers.orderHistoryAdmin = function(request,reply){
    var obj = {};
if(request.payload.category=='all'){
    var obj = {};
}else {
    var obj = {"controlObj.odStatus":request.payload.category};
};
    Order.find(obj, function(err, order) {
        reply(order);
    })
};

Handlers.orderHistoryDetailAdmin = function(request,reply){
    // console.log(request.payload);
    var obj = {
        '_id': request.payload._id
    };
    Order.find(obj, function(err, order) {
        reply(order);
    })
   
};


Handlers.orderUpdate = function(request,reply){
Order.findOneAndUpdate({
        _id: request.payload._id
    }, request.payload, {
        new: true
    }, function(err, order) {
        if (err) {
            reply(Boom.badRequest('OrderUpdateError!'));
        } else if (order) {
            if (order.controlObj.odStatus == 'shipped') {
                transporter.sendMail({
                    from: '"21cart Customer Care" <hello@21cart.com>',
                    to: order.odUser.email,
                    subject: 'Your Order '+'odm1023'+order.odCode+' Has Been Shipped',
                    template: 'shippedEmail',
                    context: {
                        odCode: order.odCode,
                        odTotal: function() {
                            return order.odTotal.toFixed(2)
                        },
                        odCartTotalAmount: function() {
                            return order.odCartTotalAmount.toFixed(2)
                        },
                        odShip: function() {
                            return order.odShip.odCost.toFixed(2)
                        },
                        uuFirstName: order.odUser.infoObj.uuFirstName,
                        uuLastName: order.odUser.infoObj.uuLastName,
                        uuShipAdd1: order.odUser.infoObj.uuShipAdd1,
                        uuShipAdd2: order.odUser.infoObj.uuShipAdd2,
                        uuShipPostcode: order.odUser.infoObj.uuShipPostcode,
                        uuShipTowncity: order.odUser.infoObj.uuShipTowncity,
                        uuShipState: order.odUser.infoObj.uuShipState,
                        odPayMethod: order.odPayObj.PymtMethod,
                        odCart: order.odCart,
                        odShipInfo:order.odShip
                    }
                });
            }
            reply('OrderUpdateOK!');
        }
    });
};

// Mongoose Stuff
var mongoose = require('mongoose');
var User = require('./models/User.js');
var Product = require('./models/Product.js');
var Order = require('./models/Order.js');
var Counter = require('./models/Counter.js');

var mongoUrl = EnvOpts.mongourl;

var connectWithRetry = function() {
    return mongoose.connect(mongoUrl, function(err) {
        if (err) {
            console.error('Failed to connect to mongo - retrying in 5 sec', err);
            setTimeout(connectWithRetry, 5000);
        } else {
            console.log('Mongo Connected')
        }
    });
};
connectWithRetry();
mongoose.connection.on('error', function() {
    console.log("Mongoose Connection Error")
    mongoose.connection.close();
});
mongoose.connection.on('disconnect', function() {
    console.log("Mongoose Disconnection Error")
});

module.exports = Handlers;