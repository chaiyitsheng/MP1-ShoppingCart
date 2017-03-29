angular.module('newCart')
    .controller('OrderHistoryCtrl', function($scope,$http,API_URL) {
    	$scope.test=function(data){
    	alert(data);	
    	}
        $scope.history = null;
        $http.post(API_URL + 'orderHistory', {}).
        success(function(data, status, headers, config) {
            $scope.history = data;
        }).
        error(function(data, status, headers, config) {
            bootbox.alert('Error');
        });
    });