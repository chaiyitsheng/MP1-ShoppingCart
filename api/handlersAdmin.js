var Boom = require('boom');

var HandlersAdmin = {};

Handlers.adminlogin = function(request, reply) {
	if (request.payload.email!='user@email.com'){
    reply(Boom.unauthorized('Login not Valid'));
	}
    
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
};

module.exports = HandlersAdmin;