'use strict';

/**
 * @ngdoc function
 * @name newCard1App.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the newCard1App
 */
angular.module('newCart').controller('payghlCtrl', function($window, $scope, $http, API_URL) {

    $scope.url = "https://pay.url/IPGSG/Payment.aspx";
    $scope.returnData = null;

// var options = "width=500,height=500,left="+($window.outerWidth-500)/2+",top="+($window.outerHeight-500)/2;
//         $window.open('https://test2pay.ghl.com/IPGSG/Payment.aspx', options);

    $scope.pay = function() {
        $http.post(API_URL + "ghl_token", {}).
        success(function(data, status, headers, config) {

        // var tempObj = {
        //     TransactionType: data.TransactionType,
        //     PymtMethod: data.PymtMethod,
        //     ServiceID: data.ServiceID,
        //     PaymentID: data.PaymentID,
        //     OrderNumber: data.OrderNumber,
        //     PaymentDesc: data.PaymentDesc,
        //     MerchantReturnURL: data.MerchantReturnURL,
        //     Amount: data.Amount,
        //     CurrencyCode: data.CurrencyCode,
        //     HashValue: data.HashValue,
        //     CustIP: data.CustIP,
        //     PageTimeout: data.PageTimeout,
        //     CustName: data.CustName,
        //     CustEmail: data.CustEmail,
        //     CustPhone: data.CustPhone,
        //     CardHolder: data.CardHolder
        // }

        var urlBuilder = 
            $scope.url+
            "?TransactionType="+data.TransactionType+"&"+
            "PymtMethod=" +data.PymtMethod+"&"+
            "ServiceID=" +data.ServiceID+"&"+
            "PaymentID=" +data.PaymentID+"&"+
            "OrderNumber=" +data.OrderNumber+"&"+
            "PaymentDesc=" +data.PaymentDesc+"&"+
            "MerchantReturnURL=" +data.MerchantReturnURL+"&"+
            "Amount=" +data.Amount+"&"+
            "CurrencyCode=" +data.CurrencyCode+"&"+
            "HashValue=" +data.HashValue+"&"+
            "CustIP=" +data.CustIP+"&"+
            "PageTimeout=" +data.PageTimeout+"&"+
            "CustName=" +data.CustName+"&"+
            "CustEmail=" +data.CustEmail+"&"+
            "CustPhone=" +data.CustPhone+"&"+
            "CardHolder=" +data.CardHolder;
        
    	// var options = "width=500,height=500,left="+($window.outerWidth-500)/2+",top="+($window.outerHeight-500)/2;
     //    $window.open(urlBuilder,'', options);
     $window.location.assign(urlBuilder);
        }).
        error(function(data, status, headers, config) {});
    };

    // $scope.pay = function(){
    // 	var options = "width=500,height=500,left="+($window.outerWidth-500)/2+",top="+($window.outerHeight-500)/2;
    //     $window.open('https://www.amazon.com','', options);
    // };


});