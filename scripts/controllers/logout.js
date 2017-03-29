'use strict';

/**
 * @ngdoc function
 * @name newCard1App.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the newCard1App
 */
angular.module('newCart')
  .controller('LogoutCtrl', function ($scope,authToken,$state) {
authToken.removeToken();
$state.go('home');
  });
