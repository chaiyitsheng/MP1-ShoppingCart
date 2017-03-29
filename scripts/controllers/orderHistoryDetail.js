angular.module('newCart')
    .controller('OrderHistoryDetailCtrl', function($scope, $stateParams, $http, API_URL) {
        $scope.OrderSuccessDataObject={};
        $scope.submitObj={_id:$stateParams.orderId};
        $http.post(API_URL + 'orderHistoryDetail', $scope.submitObj).
        success(function(data, status, headers, config) {
            $scope.OrderSuccessDataObject = data[0];
            console.log($scope.OrderSuccessDataObject);
        }).
        error(function(data, status, headers, config) {
            bootbox.alert('Error');
        });
    });