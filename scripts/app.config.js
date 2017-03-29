'use strict';

angular.module('newCart').config(function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('menu', {
        url: '/menu',
        templateUrl: 'frontend/views/menu.html'
    });

    $stateProvider.state('settings', {
        url: '/settings',
        templateUrl: 'frontend/views/settings.html'
    });

    $stateProvider.state('search', {
        url: '/search',
        templateUrl: 'frontend/views/search.html'
    });


    $stateProvider.state('pay', {
        url: '/pay',
        templateUrl: 'frontend/views/pay.html',
        controller: 'PayCtrl'
    });

    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'frontend/views/home.html',
        controller: 'HomeCtrl'
    });

    $stateProvider.state('register', {
        url: '/register',
        templateUrl: 'frontend/views/register.html',
        controller: 'RegisterCtrl'
    });

    $stateProvider.state('forgotPassword', {
        url: '/forgotPassword',
        templateUrl: 'frontend/views/forgotPassword.html',
        controller: 'forgotPasswordCtrl'
    });

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'frontend/views/login.html',
        controller: 'LoginCtrl'
    });

    $stateProvider.state('userProfile', {
        url: '/userProfile',
        templateUrl: 'frontend/views/userProfile.html',
        controller: 'UserprofileCtrl'
    });

    $stateProvider.state('product', {
        url: '/products/:category/:pageState',
        templateUrl: 'frontend/views/product.html',
        // params:{category:null,pageState:null},
        controller: 'ProductsCtrl'
    });

    $stateProvider.state('productDetail', {
        url: '/productDetail/:productId',
        templateUrl: 'frontend/views/productDetail.html',
        params: {
            productId: null,
        },
        controller: 'ProductDetailCtrl'
    });

    $stateProvider.state('shoppingCart', {
        url: '/shoppingCart',
        abstract: true,
        template: '<ui-view></ui-view>',
        controller: 'ShoppingCartCtrl'
    });

    $stateProvider.state('shoppingCart.view', {
        url: '/',
        parent: 'shoppingCart',
        templateUrl: 'frontend/views/shoppingCart.view.html'
    });

    $stateProvider.state('shoppingCart.userInfo', {
        url: '/',
        parent: 'shoppingCart',
        templateUrl: 'frontend/views/shoppingCart.userInfo.html'
    });

    $stateProvider.state('shoppingCart.payment', {
        url: '/',
        parent: 'shoppingCart',
        templateUrl: 'frontend/views/shoppingCart.payment.html'
    });

    $stateProvider.state('shoppingCart.success', {
        url: '/',
        parent: 'shoppingCart',
        templateUrl: 'frontend/views/shoppingCart.success.html'
    });

    $stateProvider.state('paySuccess', {
        url: '/paySuccess',
        templateUrl: 'frontend/views/paySuccess.html',
        controller: 'PaySuccessCtrl'
    });

    $stateProvider.state('payFailure', {
        url: '/payFailure',
        templateUrl: 'frontend/views/payFailure.html',
        controller: 'PaySuccessCtrl'
    });

    $stateProvider.state('orderHistory', {
        url: '/orderHistory',
        templateUrl: 'frontend/views/orderHistory.html',
        controller: 'OrderHistoryCtrl'
    });


    $stateProvider.state('orderHistoryDetail', {
        url: '/orderHistoryDetail/:orderId',
        templateUrl: 'frontend/views/orderHistoryDetail.html',
        params: {
            orderId: null,
        },
        controller: 'OrderHistoryDetailCtrl'
    });

    $stateProvider.state('aboutUs', {
        url: '/aboutUs',
        templateUrl: 'frontend/views/aboutUs.html'
    });

    $stateProvider.state('privacyPolicy', {
        url: '/privacyPolicy',
        templateUrl: 'frontend/views/privacyPolicy.html'
    });

    $stateProvider.state('contactUs', {
        url: '/contactUs',
        templateUrl: 'frontend/views/contactUs.html'
    });

    $stateProvider.state('bankAccount', {
        url: '/bankAccount',
        templateUrl: 'frontend/views/bankAccount.html'
    });

    $stateProvider.state('sellOn21Cart', {
        url: '/sellOn21Cart',
        templateUrl: 'frontend/views/sellOn21Cart.html'
    });

    $stateProvider.state('shippingPolicy', {
        url: '/shippingPolicy',
        templateUrl: 'frontend/views/shippingPolicy.html'
    });

    $stateProvider.state('returnPolicy', {
        url: '/returnPolicy',
        templateUrl: 'frontend/views/returnPolicy.html'
    });

    $stateProvider.state('logout', {
        url: '/logout',
        controller: 'LogoutCtrl'
    });

    $stateProvider.state('payghl', {
        url: '/payghl',
        controller: 'payghlCtrl',
        templateUrl: 'frontend/views/payghl.html'
    });

    $stateProvider.state('map', {
        url: '/map',
        controller: 'MapCtrl',
        templateUrl: 'frontend/views/map.html'
    });
})

.config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
})

// .config(["$locationProvider", function($locationProvider) {
//   $locationProvider.html5Mode(true);
// }])

// .run(function($window) {
//     console.log($window.location);
// })

.run(function($rootScope) {
    $rootScope.$on('$viewContentLoaded', function() {
        jQuery('html, body').animate({
            scrollTop: -110
        }, 50);
    });
})

.run(function($rootScope, authToken, $state, $http, API_URL) {
    // var position;
    // var options = {
    //     enableHighAccuracy: true
    // };
    // navigator.geolocation.getCurrentPosition(function(pos) {
    //         position = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    //         console.log(JSON.stringify(position));
    //     },
    //     function(error) {
    //         alert('Unable to get location: ' + error.message);
    //     }, options);

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        // $http.post(API_URL + 'analyse', {
        //         toState: toState,
        //         toParams: toParams,
        //         date: Date.now()
        //         ,gps: position
        //     })
        //     .success(function(data) {})
        //     .error(function(data, status, headers, config) {});

        if (authToken.getToken() === null && toState.name === 'shoppingCart.view') {
            event.preventDefault()
            bootbox.alert('Please log in to view shopping cart');
            $state.go('login');
        } else if (authToken.getToken() === null && toState.name === 'orderHistory') {
            event.preventDefault()
            bootbox.alert('Please log in to view order history');
            $state.go('login');
        };
    });
})



// .constant('API_URL', 'http://www.21cart.com/')
// .constant('API_URL', 'http://54.169.81.158:3000/')
.constant('API_URL', 'http://localhost:3000/')
    // .constant('API_URL', 'http://52.74.205.207/')