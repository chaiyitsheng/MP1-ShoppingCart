'use strict';

/**
 * @ngdoc function
 * @name newCard1App.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the newCard1App
 */
angular.module('newCart')
    .controller('LoginCtrl', function($scope, $http, Auth) {

        $scope.loginErr = null;
        $scope.user = {};
        $scope.master = {};

        $scope.submit = function() {

            Auth.login($scope.user.email, $scope.user.password)
                .success(function(res) {})
                .error(function(err) {
                    $scope.loginErr = 'Wrong username or password';
                    $scope.user = {};
                });
        };

    });