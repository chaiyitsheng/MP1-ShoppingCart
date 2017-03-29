'use strict';

/**
 * @ngdoc function
 * @name newCard1App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the newCard1App
 */
angular.module('newCart')
    .controller('HomeCtrl', function($scope, API_URL) {
        $scope.url = API_URL;

    });