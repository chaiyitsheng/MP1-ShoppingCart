angular.module('newCart')

.factory('Products', function($http, API_URL) {

    return {
        load: function(category) {
            return $http.get(API_URL + 'product/cat/' + category);
        },
        all: function() {
            return products;
        },
        get: function(id) {
            // Simple index lookup
            return products[id];
        },
        search:function(){
            return "OKOK";
        }
    }
})