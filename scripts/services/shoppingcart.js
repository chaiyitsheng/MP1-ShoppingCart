'use strict';

/**
 * @ngdoc service
 * @name newCard1App.shoppingCart
 * @description
 * # shoppingCart
 * Factory in the newCard1App.
 */
angular.module('newCart')
    .factory('ShoppingCart', function($http, API_URL) {
        // Service logic
        // ...
        var cartItems = [];
        var cartItemsLength = cartItems.length;
        // Public API here
        return {
            cart: function() {
                return cartItems;
            },
            clearCart: function() {
                cartItems = [];
            },
            insert: function(item) {
                cartItems.push(item);
            },
            quantity: function(item, id, option) {
                cartItems.map(function(item) {
                    if (item.id == id) {
                        item.qty += 1;
                    }
                })
            },
            count: function() {
                var arrayCount = 0;
                cartItems.map(function(item) {
                    if (!item.qty) {
                        item.qty = 1;
                        arrayCount += item.qty;
                    } else
                    if (item.qty) {
                        arrayCount += item.qty;
                    };
                });
                return arrayCount;
            },
            totalSelling: function() {
                var totalSelling = 0;
                cartItems.map(function(item) {
                    if (item) {
                        var subTotal = item.sellingprice * item.qty;
                        totalSelling += subTotal;
                    };
                });
                return totalSelling;
            },
            totalRetail: function() {
                var totalRetail = 0;
                cartItems.map(function(item) {
                    if (item) {
                        var subTotal = item.retailprice * item.qty;
                        totalRetail += subTotal;
                    };
                });
                return totalRetail;
            },
            shippingCost: function(checkOutDataObject) {
                $http.post(API_URL + 'shippingcost', checkOutDataObject).
                success(function(data, status, headers, config) {
                    alert(JSON.stringify(data));
                }).
                error(function(data, status, headers, config) {
                    bootbox.alert('Error');
                });
            }
        };
    });