'use strict';

angular.module('newCart').controller('MapCtrl', function(NgMap,$window, $scope, $http, API_URL) {


    $scope.locations = ["3.11978669999997,101.579791", "3.1198866999999997,101.578793","3.1298866999999997,101.578793","3.1218866999999997,101.578793"];
    $scope.pictures =['http://localhost:3000/thumbnail55dda01cebb7421a234d81bcimage1.jpg', 'http://localhost:3000/thumbnail55dda01cebb7421a234d81bcimage2.jpg', 'http://localhost:3000/thumbnail55dda01cebb7421a234d81bcimage3.jpg']
    $scope.string = 
    "<span><img src='http://localhost:3000/thumbnail55dda01cebb7421a234d81bcimage1.jpg'></span>"+"<span><div>Half Priced Lunch!</div><div>Get 50% off all set lunches</div><div>Prices from RM15.90 - RM30.90 before discount</div><div>Valid: 12-2pm 3 Jan 2015</div></span>"

var options = {
                enableHighAccuracy: true
            };

navigator.geolocation.getCurrentPosition(function(pos) {
                $scope.position = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                console.log(JSON.stringify($scope.position));                  
            }, 
            function(error) {                    
                alert('Unable to get location: ' + error.message);
            }, options);


  // NgMap.getMap().then(function(map) {
  //   console.log(map);
  //   console.log(map.getCenter());
  //   console.log('markers', map.markers);
  //   console.log('shapes', map.shapes);
  // });


    $scope.test = function() {
        bootbox.dialog({
            message: $scope.string,
            title: "Deal of the Moment",
            buttons: {
                success: {
                    label: "Get this now",
                    className: "btn-success",
                    callback: function() {
                        Example.show("great success");
                    }
                },
                danger: {
                    label: "Other Deals at this place",
                    className: "btn-danger",
                    callback: function() {
                        Example.show("uh oh, look out!");
                    }
                }
            }
        });
    };

  var vm = this;
    vm.message = 'You can not hide. :)';
    NgMap.getMap().then(function(map) {
      vm.map = map;
    });
    vm.callbackFunc = function(param) {
      console.log('I know where '+ param +' are. ' + vm.message);
      console.log('You are at' + vm.map.getCenter());
    };

});