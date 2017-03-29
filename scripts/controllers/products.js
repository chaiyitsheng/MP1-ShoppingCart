'use strict';

angular.module('newCart')
    .controller('ProductsCtrl', function(API_URL,$stateParams, $scope, Products, ShoppingCart, $location,$http) {

        $scope.url=API_URL;
        $scope.pageState = $stateParams.pageState;
        $scope.category = $stateParams.category;

        $scope.filterCategory = function() {
            if ($scope.category === 'superDeals') {
                return {};
            } else {
                return {
                    category: $scope.category
                };
            }
        };

        $scope.scrollToTop = function () {
            window.scrollTo(0, 0)
        }

        $scope.alert = function(id) {
            alert(id);
        };


        $scope.cart = ShoppingCart.cart();

        $scope.total = {
            price: 0
        };

        $scope.insert = function(i, n, p, s) {
            var cartItem = {
                id: i,
                name: n,
                price: p,
                source: s
            };
            $scope.cart.push(cartItem);
            $scope.total.price = $scope.total.price + p;
        };

        $scope.getTotal = function() {
            var total = 0;
            for (var i = 0; i < $scope.cart.length; i++) {
                var product = $scope.cart[i];
                total += (product.price * 1);
                console.log($scope);
            }
            return total;
        };

        // Products.load($scope.category).success(function(data) {
        //     $scope.products = data;
        // }).error(function(err) {
        //     alert(err)
        // });

        $http.get(API_URL + 'product/cat/' + $scope.category).success(function(data) {
            $scope.products = data;
        }).error(function(err) {
            alert(err)
        });

        // $scope.products= [{
        //     id: 0,
        //     category: "babyMilk",
        //     name: "Dumex Mamex Cherish 1.5kg",
        //     price: "158.50",
        //     source: "http://assets.ap-tescoassets.com/assets/MY/007/9556098825007/ShotType1_328x328.jpg"
        // }, {
        //     id: 1,
        //     category: "babyMilk",
        //     name: "Pediasure Complete Vanilla Flavoured Formulation Milk 1.6kg",
        //     price: "150.70",
        //     source: "http://assets.ap-tescoassets.com/assets/MY/312/9557478412312/ShotType1_328x328.jpg"
        // },
        // {
        //     id: 2,
        //     category: "babyMilk",
        //     name: "Similac Gain Plus Eye Q 1.8kg",
        //     price: "134.70",
        //     source: "http://assets.ap-tescoassets.com/assets/MY/456/5391523050456/ShotType1_328x328.jpg"
        // },
        // {
        //     id: 3,
        //     category: "babyMilk",
        //     name: "Pediasure Complete Vanilla Flavoured Formulation Milk 1.6kg",
        //     price: "150.70",
        //     source: "http://assets.ap-tescoassets.com/assets/MY/312/9557478412312/ShotType1_328x328.jpg"
        // },
        // {
        //     id: 4,
        //     category: "babyMilk",
        //     name: "Pediasure Complete Vanilla Flavoured Formulation Milk 1.6kg",
        //     price: "150.70",
        //     source: "http://assets.ap-tescoassets.com/assets/MY/312/9557478412312/ShotType1_328x328.jpg"
        // },
        //  {
        //     id: 5,
        //     category: "Diaper",
        //     name: "MamyPoko Extra Soft M 7-12kg Baby Pants Diapers 64pcs",
        //     price: "71.90",
        //     source: "http://assets.ap-tescoassets.com/assets/MY/093/8851111401093/ShotType1_328x328.jpg"
        // },
        // {
        //     id: 6,
        //     category: "Diaper",
        //     name: "MamyPoko Extra Soft M 7-12kg Baby Pants Diapers 64pcs",
        //     price: "71.90",
        //     source: "http://assets.ap-tescoassets.com/assets/MY/093/8851111401093/ShotType1_328x328.jpg"
        // },
        // {
        //     id: 7,
        //     category: "Diaper",
        //     name: "MamyPoko Extra Soft M 7-12kg Baby Pants Diapers 64pcs",
        //     price: "71.90",
        //     source: "http://assets.ap-tescoassets.com/assets/MY/093/8851111401093/ShotType1_328x328.jpg"
        // }
        // ];
    });