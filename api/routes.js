var Handlers = require('./handlers.js');
// var HandlersAdmin = require('./handlersAdmin.js');
var Validators = require('./validators.js');
var Joi = require('joi');
var jwt = require('jsonwebtoken');

var authorisationRules = {
    rbac: {
        rules: [{
            target: ['any-of', {type: 'email',value: 'yschai@riscmicro.com'}],
            effect: 'permit'
        }]
    }
};

var Routes = [{
    method: 'POST',
    path: '/register',
    handler: Handlers.register,
    config: {
        validate: {
            payload: Validators.register
        },
        auth: false
    }
}, {
    method: 'POST',
    path: '/login',
    handler: Handlers.login,
    config: {
        validate: {
            payload: Validators.register
        },
        auth: false
    }
},{
    method: 'POST',
    path: '/adminlogin',
    handler: Handlers.adminlogin,
    config: {
        validate: {
            payload: Validators.register
        },
        auth: false
    }
},
{
    method: 'GET',
    path: '/product/cat/{category}',
    handler: Handlers.getProduct,
    config: {
        auth: false
    }
},{
    method: 'GET',
    path: '/product/details/{id}',
    handler: Handlers.getProductDetails,
    config: {
        auth: false
    }
},
{
    method: 'GET',
    path: '/userProfile',
    handler: Handlers.userProfile,
    config: {}
},
{
    method: 'POST',
    path: '/userProfileUpdate',
    handler: Handlers.userProfileUpdate,
    config: {}
}
,
{
    method: 'POST',
    path: '/productCreateObject',
    handler: Handlers.productCreateObject,
    config: {
        auth: {
            strategy: 'token',
            scope: ['admin']
        }
    }
},
{
    method: 'POST',
    path: '/productCreateFlow',
    handler: Handlers.productCreateFlow,
    config: {
        payload: {
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data',
            maxBytes: 1048576
        },
        auth: {
            strategy: 'token',
            scope: ['admin']
        }
    }
},{
    method: 'POST',
    path: '/productUpdate',
    handler: Handlers.productUpdate,
    config: {
        auth: {
            strategy: 'token',
            scope: ['admin']
        }
    }
},
{
    method: 'POST',
    path: '/productEdit',
    handler: Handlers.productEdit,
    config: {
        auth: {
            strategy: 'token',
            scope: ['admin']
        }
    }
},
{
    method: 'POST',
    path: '/productDelete',
    handler: Handlers.productDelete,
    config: {
        auth: {
            strategy: 'token',
            scope: ['admin']
        }
    }
},{
    method: 'POST',
    path: '/checkShipping',
    handler: Handlers.checkShipping,
    config: {}
},{
    method: 'POST',
    path: '/productOrder',
    handler: Handlers.productOrder,
    config: {}
},{
    method: 'POST',
    path: '/productOrderSave',
    handler: Handlers.productOrderSave,
    config: {}
},
{
    method: 'POST',
    path: '/ghl_token',
    handler: Handlers.ghl_token,
    config: {auth:false}
},
{
    method: 'POST',
    path: '/ghlReturnUrl',
    handler: Handlers.ghlReturnUrl,
    config: {auth:false}
},
{
    method: 'POST',
    path: '/analyse',
    handler: Handlers.analyse,
    config: {}
},
{
    method: 'POST',
    path: '/orderHistory',
    handler: Handlers.orderHistory,
    config: {}
},
{
    method: 'POST',
    path: '/orderHistoryDetail',
    handler: Handlers.orderHistoryDetail,
    config: {}
},
{
    method: 'POST',
    path: '/orderHistoryAdmin',
    handler: Handlers.orderHistoryAdmin,
        config: {
        auth: {
            strategy: 'token',
            scope: ['admin']
        }
    }
},
{
    method: 'POST',
    path: '/orderHistoryDetailAdmin',
    handler: Handlers.orderHistoryDetailAdmin,
        config: {
        auth: {
            strategy: 'token',
            scope: ['admin']
        }
    }
},
{
    method: 'POST',
    path: '/orderUpdate',
    handler: Handlers.orderUpdate,
        config: {
        auth: {
            strategy: 'token',
            scope: ['admin']
        }
    }
}
];    
// {
//     method: 'GET',
//     path: '/ve/{uuid}',
//     handler: Handlers.verifyEmail,
//     config: {
//         auth: false
//     }
// },{
//     method: 'GET',
//     path: '/emailVerified',
//     handler: function(request,reply){
//         reply("Email Verified")
//     },
//     config: {
//         auth: false
//     }
// },{
//     method: 'POST',
//     path: '/sendEmail',
//     handler: Handlers.test,
//     config: {
//         auth: false
//     }
// },{
//     method: 'POST',
//     path: '/testing',
//     handler: Handlers.writeFile,
//     config: {
//         payload: {
//             output: 'stream',
//             parse: true,
//             allow: 'multipart/form-data',
//             maxBytes: 1048576
//         },
//         plugins: authorisationRules
//     }
// }, {
//     method: 'POST',
//     path: '/register',
//     handler: Handlers.register,
//     config: {
//         validate: {
//             payload: Validators.register
//         },
//         auth: false
//     }
// }, {
//     method: 'POST',
//     path: '/login',
//     handler: Handlers.login,
//     config: {
//         validate: {
//             payload: Validators.register
//         },
//         auth: false
//     }
// }, {
//     method: 'POST',
//     path: '/token',
//     handler: function(request, reply) {
//         console.log('yes');
//         reply(request.auth.credentials);
//     },
//     config: {
//         auth: {
//             strategy: 'token',
//             scope: ['user']
//         }
//     }
// }, {
//     method: 'GET',
//     path: '/ve/{user}/{id}',
//     handler: function(request, reply) {
//         reply(request.params);
//     },
//     config: {
//         auth: false
//     }
// },
// {
//     method: 'POST',
//     path: '/client_token',
//     handler: Handlers.client_token,
//     config: {}
// },
// {
//     method: 'POST',
//     path: '/checkout',
//     handler: Handlers.checkout,
//     config: {}
// },


// plugins: {
//       rbac: {
//         target: ['any-of', {type: 'group', value: 'readers'}],
//         apply: 'deny-overrides', 
//         rules: [
//           {
//             target: ['any-of', {type: 'email', value: 'abc@abc.com'}],
//             effect: 'deny'
//           },
//           {
//             effect: 'permit'
//           }
//         ]
//       }
//     }


module.exports = Routes;