angular.module('starter.services', ['ngCookies'])

.service('TokenSvc', function($http, $q) {
    var myToken = null;

    var promise = $http.get('http://reimburse.athletics.ucla.edu/api/token/')
        .success(function (resp) {
            console.log('token retrieved from reimburse API server');
            myToken = resp.data;
        });

    return {
      promise:promise,
      setData: function (data) {
          myToken = data;
      },
      Token: function () {
          return myToken;
      }
    };
})

.service('AuthSvc', function($q, $http) {
    var self = this;
    
    self.IsAuthenticated = function() {
        return $http.get('http://reimburse.athletics.ucla.edu/api/isauthenticated')
            .then(function(response) {
                return response.data;
            });
    };
});