'use strict';

angular.module('newCart')
    .controller('ProductDetailCtrl', ['$state', '$sce', '$filter', '$http', '$stateParams', '$scope', '$window', 'API_URL', 'ShoppingCart', 'authToken', function($state, $sce, $filter, $http, $stateParams, $scope, $window, API_URL, ShoppingCart, authToken) {
        // console.log($stateParams);

        $scope.url = API_URL;

        $scope.option = null;

        $scope.add = function(productDetail) {
            if (!authToken.isAuthenticated()) {
                bootbox.alert('Please log in to add item to shopping cart');
                $state.go('login');
            } else if (productDetail.infoObj.pdOptions.length >= 1 && !productDetail.infoObj.option) {
                bootbox.alert('Please select option');
            } else if (ShoppingCart.count() >= 10) {
                bootbox.alert('Each order has a maximum limit of 10 items. Please create another order to buy more items');
            }
            // else starts here
            else {
                console.log(productDetail);
                var addItem = {
                    id: productDetail._id,
                    code: productDetail.pdCode,
                    name: productDetail.infoObj.pdName,
                    image: productDetail.infoObj.pdImages.pdImg1,
                    sellingprice: productDetail.infoObj.pdSellingPrice,
                    retailprice: productDetail.infoObj.pdRetailPrice,
                    qty: 1,
                    option: productDetail.infoObj.option
                };

                var cartArrayJson = ShoppingCart.cart().map(
                    function(item) {
                        return JSON.stringify({
                            id: item.id,
                            option: item.option
                        })
                    });

                var cartArray = ShoppingCart.cart().map(
                    function(item) {
                        return item.id
                    });

                var cart = ShoppingCart.cart();


                var cartFunc = function(addItem) {
                    for (var i = 0; i < cart.length; i++) {

                    }
                };

                if (cartArray.indexOf(addItem.id) == -1) {
                    ShoppingCart.insert(addItem);
                    bootbox.alert('Item added to Shopping Cart');
                } else if (cartArray.indexOf(addItem.id) !== -1) {
                    // ShoppingCart.quantity(addItem, addItem.id);
                    var data = JSON.stringify({
                        id: addItem.id,
                        option: addItem.option
                    });
                    if (cartArrayJson.indexOf(data) == -1) {
                        ShoppingCart.insert(addItem);
                    } else if (cartArrayJson.indexOf(data) !== -1) {
                        cart[cartArrayJson.indexOf(data)].qty++
                    }
                    bootbox.alert('Item added to Shopping Cart');

                };
            }
            // else ends here
        };

        $scope.thumbnail = {};

        $scope.selectedIndex = 0;

        $scope.selected = function(image, index) {
            $scope.thumbnail = image;
            $scope.selectedIndex = index;
        };

        $scope.productDetail = {};

        $http.get(API_URL + 'product/details/' + $stateParams.productId).
        success(function(data, status, headers, config) {
            $scope.productDetail = data;
            $scope.thumbnail = $scope.productDetail.infoObj.pdImages.pdImg1;
        }).
        error(function(data, status, headers, config) {
            alert("error");
        });

        $scope.alertMe = function() {
            setTimeout(function() {
                $window.alert('You\'ve selected the alert tab!');
            });
        };

        $scope.to_trusted = function(html_code) {
            return $sce.trustAsHtml(html_code);
        };

        $scope.people = ['Dan', 'Stephanie', 'Tim', 'George'];

        $scope.currentPerson = $scope.people[1];

    }]);