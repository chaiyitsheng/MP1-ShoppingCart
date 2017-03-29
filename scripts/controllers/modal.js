angular.module('newCart').controller('ModalDemoCtrl', function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('newCart').controller('ModalInstanceCtrl', function ($scope, $modalInstance,Products,items,$state) {

  // $scope.items = items;
  // $scope.selected = {
  //   item: $scope.items[0]
  // };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.searchTerm={};
  $scope.search= function(){
    // bootbox.alert($scope.searchTerm.search +" "+ Products.search());
    if ($scope.searchTerm.search!=null){
    $state.go('product',{category:$scope.searchTerm.search,pageState:$scope.searchTerm.search});
    $modalInstance.close();
    }
    else{
    $modalInstance.close();  
    }
  }
});