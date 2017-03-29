'use strict';

angular.module('newCart')
    .controller('ShoppingCartCtrl', function(authToken, $window, $state, $scope, $http, ShoppingCart, API_URL, usSpinnerService) {

        $scope.url = API_URL;
        $scope.checkShippingDataObject = {};
        $scope.confirmOrderDataObject = {};
        $scope.OrderSuccessDataObject = {};
        $scope.shippingInfo = {};
        $scope.payObj = {
            // odDate: null,
            // odPayMethod: null,
            // odPayDate: null,
            // odCardType: null,
            // odCardNumber: null,
            // odCVV: null
        };
        // $scope.payButtonPressed = false;
        // $scope.payObj.odCardNumber = 4111111111111111;


        $scope.cartLength = function() {
            return ShoppingCart.cart().length;
        };

        $scope.cart = function() {
            return ShoppingCart.cart();
        };

        $scope.cartCount = function() {
            return ShoppingCart.count();
        };

        $scope.cartTotalSelling = function() {
            return ShoppingCart.totalSelling();
        };

        $scope.cartTotalRetail = function() {
            return ShoppingCart.totalRetail();
        };

        $scope.cartSavings = function() {
            return ShoppingCart.totalRetail() - ShoppingCart.totalSelling();
        }

        $scope.remove = function(index) {
            delete ShoppingCart.cart().splice(index, 1);
        };

        $http.get(API_URL + 'userProfile')
            .success(function(user) {
                $scope.user = user.infoObj;
                $scope.email = user.email;
            })
            .error(function(data, status, headers, config) {
                if (status == 401) {
                    authToken.removeToken();
                }
            })


        $scope.submituserProfile = function() {
            $http.post(API_URL + 'userProfileUpdate', $scope.user).
            success(function(data, status, headers, config) {
                $scope.checkShipping();
            }).
            error(function(data, status, headers, config) {
                bootbox.alert('Error');
            });
        };

        $scope.checkShipping = function() {
            $scope.checkShippingDataObject = {
                c: authToken.getToken(),
                cc: $scope.cart()
            };

            $http.post(API_URL + 'checkShipping', $scope.checkShippingDataObject).
            success(function(data, status, headers, config) {
                $scope.shippingInfo = data;
                $scope.confirmOrder();
                // $state.go('shoppingCart.payment');
            }).
            error(function(data, status, headers, config) {
                if (status == 401) {
                    authToken.removeToken();
                    bootbox.alert('Please Login Again');
                    $state.go('login');
                } else {
                    bootbox.alert('You order could not be completed.Please try again later');
                }
            });
        };

        $scope.confirmOrder = function() {
            // console.log($scope.payObj.odPayMethod);
            // $scope.payButtonPressed = true;
            usSpinnerService.spin('spinner-1');
            $scope.confirmOrderDataObject = {
                c: authToken.getToken(),
                cc: $scope.cart(),
                ccc: $scope.cartTotalSelling(),
                cccc: $scope.payObj,
                ship: $scope.shippingInfo,
            };

            $http.post(API_URL + 'productOrder', $scope.confirmOrderDataObject).
            success(function(data, status, headers, config) {
                $scope.OrderSuccessDataObject = data;
                usSpinnerService.stop('spinner-1');
                ShoppingCart.clearCart();
                $state.go('shoppingCart.success');
            }).
            error(function(data, status, headers, config) {
                if (status == 401) {
                    authToken.removeToken();
                    bootbox.alert('Please Login Again');
                    $state.go('login');
                } else {
                    bootbox.alert('Your order could not be completed. This could be due to network issues or card was declined. Please try again later');
                }
            });
        };


        // GHL Payment
        $scope.ghlUrl = "https://test2pay.ghl.com/IPGSG/Payment.aspx";

        $scope.pay = function() {
            usSpinnerService.spin('spinner-1');
            bootbox.confirm("You will be taken to our payment provider's secure site for payment. Please enter your payment details.", function() {
                $http.post(API_URL + "ghl_token", $scope.OrderSuccessDataObject).
                success(function(data, status, headers, config) {
                    var urlBuilder =
                        $scope.ghlUrl +
                        "?TransactionType=" + data.TransactionType + "&" +
                        "PymtMethod=" + data.PymtMethod + "&" +
                        "ServiceID=" + data.ServiceID + "&" +
                        "PaymentID=" + data.PaymentID + "&" +
                        "OrderNumber=" + data.OrderNumber + "&" +
                        "PaymentDesc=" + data.PaymentDesc + "&" +
                        "MerchantReturnURL=" + data.MerchantReturnURL + "&" +
                        "Amount=" + data.Amount + "&" +
                        "CurrencyCode=" + data.CurrencyCode + "&" +
                        "HashValue=" + data.HashValue + "&" +
                        "CustIP=" + data.CustIP + "&" +
                        "PageTimeout=" + data.PageTimeout + "&" +
                        "CustName=" + data.CustName + "&" +
                        "CustEmail=" + data.CustEmail + "&" +
                        "CustPhone=" + data.CustPhone + "&" +
                        "CardHolder=" + data.CardHolder;
                    $window.location.assign(urlBuilder);
                }).
                error(function(data, status, headers, config) {});
            });

            // bootbox.alert("You will be taken to our payment provider's secure site for payment. Please enter your payment details.");
            // usSpinnerService.spin('spinner-1');



        };
    });