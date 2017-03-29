'use strict';

angular.module('newCart')
    .factory('authInterceptor', function(authToken, $q) {
        return {
            request: function(config) {
                var token = authToken.getToken();
                if (token) {
                    config.headers.Authorization = 'Bearer ' + token;
                } else {
                    config.headers = config.headers
                };
                return config;
            },
            response: function(response) {
                return response
            }
        };
    });