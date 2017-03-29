'use strict';

angular.module('newCart').service('Auth', function Auth($http, API_URL, authToken, $state) {
    function authSuccessful(res) {
        authToken.setToken(res.token);
        $state.go('home');
    };

    // function verifyEmail(res) {
    //     bootbox.alert("Please check your inbox for the confirmation email. Kindly confirm your email address before log in.")
    //     $state.go('home');
    // };

    this.login = function(email, password) {
        return $http.post(API_URL + 'login', {
            email: email,
            password: password
        }).success(authSuccessful);
    };

    this.register = function(email, password) {
        return $http.post(API_URL + 'register', {
            email: email,
            password: password
        }).success(authSuccessful);
    };
});