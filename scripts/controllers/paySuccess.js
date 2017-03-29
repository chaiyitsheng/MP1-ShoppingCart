'use strict';

/**
 * @ngdoc function
 * @name newCard1App.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the newCard1App
 */
angular.module('newCart').controller('PaySuccessCtrl', function($state,$window, $scope, $http, API_URL) {

$scope.orderHistory = function () {
	$state.go('orderHistory');
}

$scope.home= function () {
	$state.go('home');
}

});