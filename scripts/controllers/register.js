'use strict';

/**
 * @ngdoc function
 * @name newCard1App.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the newCard1App
 */
angular.module('newCart')
    .controller('RegisterCtrl', function($scope, Alert, Auth) {
        $scope.user = {};

        $scope.submit = function() {
            Auth.register($scope.user.email, $scope.user.password).success(function(res) {
                // Alert('success', 'Account Created! ', 'Welcome ' + res.user.email + '!');
            }).error(function(data, status, headers, config) {
                bootbox.alert(data.message)
                $scope.user={};
            });
        };
    });