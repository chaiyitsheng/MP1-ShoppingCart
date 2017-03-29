var Hapi = require('hapi');
var jwt = require('jsonwebtoken');
var Ref = require('./ref.js');
var multipart = require('connect-multiparty');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    port: 3000,
    routes: { cors: true }
});

// Serve Static Assets and related routes
server.register(require('inert'), function(err) {
    if (err) {
        throw err;
    };
    server.route([{
        method: 'GET',
        path: '/',
        handler: function(request, reply) {
            reply.file('../frontend/app/index.html');
        },
        config: {
            auth: false
        }
    }, {
        method: 'GET',
        path: '/frontend/bower_components/{params*}',
        handler: {
            directory: {
                path: '../frontend/bower_components/',
                listing: true
            }
        },
        config: {
            auth: false
        }
    }, {
        method: 'GET',
        path: '/frontend/{params*}',
        handler: {
            directory: {
                path: ['../frontend/app/'],
                listing: true
            }
        },
        config: {
            auth: false
        }
    }, {
        method: 'GET',
        path: '/{params*}',
        handler: {
            directory: {
                path: ['../../pics/images/', '../../pics/resized/'],
                listing: true
            }
        },
        config: {
            auth: false
        }
    }, {
        method: 'GET',
        path: '/admin21cart',
        handler: function(request, reply) {
            reply.file('../frontendAdmin/app/index.html');
        },
        config: {
            auth: false
        }
    }, {
        method: 'GET',
        path: '/frontendAdmin/bower_components/{params*}',
        handler: {
            directory: {
                path: '../frontendAdmin/bower_components/',
                listing: true
            }
        },
        config: {
            auth: false
        }
    }, {
        method: 'GET',
        path: '/frontendAdmin/{params*}',
        handler: {
            directory: {
                path: ['../frontendAdmin/app/'],
                listing: true
            }
        },
        config: {
            auth: false
        }
    }]);
});


// Register hapi-auth-jwt
var privateKey = Ref;
server.register(require('hapi-auth-jwt'), function(error) {

    var validate = function(request, decodedToken, callback) {
        // console.log(decodedToken);
        if (decodedToken.iat + 60 * 60 * 24 * 1000 > Date.now()) {
            return callback(error, true, decodedToken);
        } else {
            return callback(error, false, decodedToken);
        }

    };

    server.auth.strategy('token', 'jwt', {
        key: privateKey,
        validateFunc: validate
    });

    server.auth.default('token')

    // server.route({
    //     method: 'GET',
    //     path: '/',
    //     config: {
    //         auth: 'token'
    //     }
    // });

    // // With scope requirements
    // server.route({
    //     method: 'GET',
    //     path: '/withScope',
    //     config: {
    //         auth: {
    //             strategy: 'token',
    //             scope: ['a']
    //         }
    //     }
    // });
});


// Register hapi-rbac
server.register({register: require('hapi-rbac')}, function(err) {
    if (err) {
        console.log(err);
    };
});


// Add the routes
server.route(require('./routes.js'));

// server.ext('onRequest', function (request, reply) {
// multipart(request.raw.req);
//     return reply.continue();
// });


// Start the server
server.start(function() {
    console.log('Server running at:', server.info.uri);
});