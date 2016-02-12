angular.module('starter.controllers')

.controller('HotelCtrl', function($scope, HotelExp, TripSvc) {
    
    console.log('Hotel Controller...');
    $scope.$on('modal.shown', function() {
        if (!$scope.newHotel) {
            $scope.newHotel = new HotelExp();
        }
    });

    $scope.saveNew = function() {
        console.log('ExpensesCtrl: save new expense');
        if ($scope.isNewExpense) {
            TripSvc.currentTrip.addExpense($scope.newHotel);
        }
        TripSvc.pause();
        $scope.modal.hide();			
    };
});
