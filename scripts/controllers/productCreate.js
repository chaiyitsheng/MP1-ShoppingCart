'use strict';

angular.module('newCart')
    .controller('ProductCreateCtrl', function($stateParams, $scope, $http, $state, authToken, API_URL) {
        console.log("started");
        $scope.product = {};
        $scope.stepOne = false;
        $scope.stepTwo = false;
        $scope.stepThree = false;

        $scope.success = function($file, $message) {
            $file.msg = $message;
            console.log('resp', $message);
        };

        $scope.create = function() {
            $scope.product.msgType = "productCreate.one";
            console.log($scope.product.name);
            $http.post(API_URL + 'productCreateNew', $scope.product).
            success(function(data, status, headers, config) {
                console.log(data);
                $scope.product = data;
                $scope.stepOne = true;
                $state.go('productCreate.two');
            }).
            error(function(data, status, headers, config) {
                alert("error");
            });
        };

        $scope.productData = function() {
            alert(JSON.stringify($scope.product));
            $scope.stepTwo = true;
            $state.go('productCreate.three');
        };

        $scope.obj = {};
        $scope.config = {
            target: API_URL + 'productCreate',
            testChunks: false,
            data: {
                id: 1235555
            },
            headers: {
                Authorization: 'Bearer ' + authToken.getToken()
            }
        };

        $scope.test1 = function() {
            alert("test1")
        };
        $scope.test2 = function() {
            alert("test2")
        };
        $scope.test3 = function() {
            alert("test3")
        };
        $scope.test4 = function() {
            alert("test4")
        };

        // $scope.$on('flow::fileSuccess', function (event, $flow, flowFile) {
        //   alert("Success");
        //   event.preventDefault();
        // });
        $scope.flowFileArray = [];
        $scope.flowFileArrayCount = 0;
        $scope.flowSuccessHandler = function($file, $message, $flow) {

            if ($file.name.indexOf('image1') != -1) {
                $scope.product.pdImages.pdImg1 = $file.name;
            } else if ($file.name.indexOf('image2') != -1) {
                $scope.product.pdImages.pdImg2 = $file.name;
            } else if ($file.name.indexOf('image3') != -1) {
                $scope.product.pdImages.pdImg3 = $file.name;
            } else if ($file.name.indexOf('image4') != -1) {
                $scope.product.pdImages.pdImg4 = $file.name;
            } else if ($file.name.indexOf('image5') != -1) {
                $scope.product.pdImages.pdImg5 = $file.name;
            } else if ($file.name.indexOf('image6') != -1) {
                $scope.product.pdImages.pdImg6 = $file.name;
            } else if ($file.name.indexOf('image7') != -1) {
                $scope.product.pdImages.pdImg7 = $file.name;
            } else if ($file.name.indexOf('image8') != -1) {
                $scope.product.pdImages.pdImg8 = $file.name;
            };

            console.log($scope.flowFileArray.length + ' of ' + $scope.flowFileArrayCount + ' uploaded');
            $scope.flowFileArray.pop($file.name);

            if ($scope.flowFileArray.length == 0) {
                $http.post(API_URL + 'productUpdate', $scope.product).
                success(function(data, status, headers, config) {
                    alert($scope.flowFileArrayCount + ' Files Uploaded');
                    $scope.stepThree = true;
                    $state.go('productCreate.four');
                }).
                error(function(data, status, headers, config) {
                    alert("error");
                });
            };
        };

        $scope.out = function() {
            console.log($scope.obj.flow);
            if ($scope.obj.flow.files[0]) {
                $scope.obj.flow.files[0].name = $scope.product._id + "image1.jpg";
                $scope.flowFileArray.push($scope.obj.flow.files[0].name);
            };
            if ($scope.obj.flow.files[1]) {
                $scope.obj.flow.files[1].name = $scope.product._id + "image2.jpg";
                $scope.flowFileArray.push($scope.obj.flow.files[1].name);
            };
            if ($scope.obj.flow.files[2]) {
                $scope.obj.flow.files[2].name = $scope.product._id + "image3.jpg";
                $scope.flowFileArray.push($scope.obj.flow.files[2].name);
            };
            if ($scope.obj.flow.files[3]) {
                $scope.obj.flow.files[3].name = $scope.product._id + "image4.jpg";
                $scope.flowFileArray.push($scope.obj.flow.files[3].name);
            };
            if ($scope.obj.flow.files[4]) {
                $scope.obj.flow.files[4].name = $scope.product._id + "image5.jpg";
                $scope.flowFileArray.push($scope.obj.flow.files[4].name);
            };
            if ($scope.obj.flow.files[5]) {
                $scope.obj.flow.files[5].name = $scope.product._id + "image6.jpg";
                $scope.flowFileArray.push($scope.obj.flow.files[5].name);
            };
            if ($scope.obj.flow.files[6]) {
                $scope.obj.flow.files[6].name = $scope.product._id + "image7.jpg";
                $scope.flowFileArray.push($scope.obj.flow.files[6].name);
            };
            if ($scope.obj.flow.files[7]) {
                $scope.obj.flow.files[7].name = $scope.product._id + "image8.jpg";
                $scope.flowFileArray.push($scope.obj.flow.files[7].name);
            };
            $scope.obj.flow.files = $scope.obj.flow.files.slice(0, 8);
            $scope.flowFileArrayCount = $scope.flowFileArray.length;
            $scope.obj.flow.upload();
            // alert($scope.flowFileArrayCount + " images to be uploaded!")
        };

    });