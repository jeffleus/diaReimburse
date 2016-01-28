angular.module('starter.controllers')

.controller('TransportationCtrl', function($scope, TransportationExp, TripSvc) {
    
    console.log('Transportation Controller...');
    $scope.$on('modal.shown', function() {
        if (!$scope.newTransportation) {
            $scope.newTransportation = new TransportationExp();
        }
    });
    
    $scope.saveNew = function() {
        console.log('TransportationCtrl: save new expense');
        if ($scope.isNewExpense) {
            TripSvc.currentTrip.addExpense($scope.newTransportation);
        }
        $scope.modal.hide();			
    };
});
