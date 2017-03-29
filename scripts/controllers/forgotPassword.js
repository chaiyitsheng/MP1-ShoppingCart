angular.module('newCart')
    .controller('forgotPasswordCtrl', function($scope, $http, Auth) {

        $scope.loginErr = null;
        $scope.user = {};
        $scope.master = {};

        $scope.submit = function() {

            Auth.forgotPassword($scope.user.email)
                .success(function(res) {})
                .error(function(err) {
                    $scope.loginErr = 'Wrong username or password';
                    $scope.user = {};
                });
        };

    });