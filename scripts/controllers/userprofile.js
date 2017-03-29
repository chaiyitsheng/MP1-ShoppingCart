'use strict';

/**
 * @ngdoc function
 * @name newCard1App.controller:UserprofileCtrl
 * @description
 * # UserprofileCtrl
 * Controller of the newCard1App
 */
angular.module('newCart')
    .controller('UserprofileCtrl', function($state, $scope, $http, API_URL, authToken) {
        $http.get(API_URL + 'userProfile')
            .success(function(user) {
                $scope.user = user.infoObj;
                $scope.email = user.email;
            })
            .error(function(data, status, headers, config) {
                if (status == 401) {
                    authToken.removeToken();
                    // bootbox.alert('Please Login Again');
                    $state.go('login');}
            })

        $scope.submituserProfile = function() {
            $scope.user.uuDob=Date.parse($scope.user.uuDob);
            $http.post(API_URL + 'userProfileUpdate', $scope.user).
            success(function(data, status, headers, config) {
                bootbox.alert('User Profile Updated');
            }).
            error(function(data, status, headers, config) {
                bootbox.alert('Error');
            });
        };

        $scope.isAuthenticated = authToken.isAuthenticated;

        // DatePicker Code

        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.user.uuDob = null;
        };

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 2);
        $scope.events = [{
            date: tomorrow,
            status: 'full'
        }, {
            date: afterTomorrow,
            status: 'partially'
        }];

        $scope.getDayClass = function(date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        };

    });