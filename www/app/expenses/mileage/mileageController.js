angular.module('starter.controllers')

.controller('MileageCtrl', function($scope, MileageExp, TripSvc) {
    
    console.log('Mileage Controller...');
    $scope.$on('modal.shown', function() {
        if (!$scope.newMileage) {
            $scope.newMileage = new MileageExp();
        }
    });
    
    $scope.saveNew = function() {
        console.log('MileageCtrl: save new expense');
        if ($scope.isNewExpense) {
            TripSvc.currentTrip.addExpense($scope.newMileage);
        }
        TripSvc.pause();
        $scope.modal.hide();			
    };
});
