'use strict';

/**
 * @ngdoc function
 * @name newCard1App.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the newCard1App
 */
angular.module('newCart').controller('HeaderCtrl', function($window,$scope, authToken) {
        $scope.isAuthenticated = authToken.isAuthenticated;
    });
