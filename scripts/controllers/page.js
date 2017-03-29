'use strict';

angular.module('newCart').controller('pageslideCtrl', function($window, $scope, $state,authToken, API_URL) {
    $scope.url=API_URL;
    $scope.showSearch=false;
    $scope.searchTerm = {};

    $scope.checked1 = false; // This will be binded using the ps-open attribute
    $scope.toggle1 = function() {
        $scope.checked1 = !$scope.checked1;
        if ($scope.checked2 = true) {
            $scope.checked2 = !$scope.checked2;
        }
    };
    $scope.checked2 = false; // This will be binded using the ps-open attribute
    
    $scope.toggle2 = function() {
        $scope.checked2 = !$scope.checked2;
        if ($scope.checked1 = true) {
            $scope.checked1 = !$scope.checked1;
        }
    };

    // $scope.toggleSearch = function(){
    //     $scope.showSearch = !$scope.showSearch;
    // };

    $scope.postSearch= function(){
        bootbox.alert($scope.searchTerm.search+" :  cannot be found");
    }

    $scope.productDetail = function(name) {
        $state.go('productDetail',{name:name});
    };

    $scope.login = function() {
        $state.go('login');
        $scope.checked2 = !$scope.checked2;
    };
    $scope.logout = function() {
        $state.go('logout');
        $scope.checked2 = !$scope.checked2;
    };
    $scope.main = function() {
        $state.go('main');
    };

    $scope.stick = $window.innerWidth;


$scope.isAuthenticated = authToken.isAuthenticated;
});

// $scope.superDeals = function()
// babyMilkPowder
// babyDiapers
// coupons