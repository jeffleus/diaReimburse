angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $cordovaDatePicker) {
    $scope.travelDate = { depart: {}, return: {} };
    
  $scope.settings = {
    enableFriends: true
  };
  
  $scope.pickDepart = function() {
    $cordovaDatePicker.show().then(function(date){
        $scope.travelDate.depart = date;
        $scope.$apply();
    });
  };
    
  $scope.pickReturn = function() {
    $cordovaDatePicker.show().then(function(date){
        $scope.travelDate.return = date;
        $scope.$apply();
    });
  };

});
