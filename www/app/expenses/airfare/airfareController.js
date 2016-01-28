angular.module('starter.controllers')

.controller('AirfareCtrl', function($scope, AirfareExp, AirfareSvc, TripSvc) {
    
    console.log('Airfare Controller...');
//    $scope.newAirfare = new AirfareExp();
    $scope.$on('modal.shown', function() {
        if (!$scope.newAirfare) {
            $scope.newAirfare = new AirfareExp();
        }
    });

    $scope.saveNew = function() {
        console.log('ExpensesCtrl: save new expense');
//        AirfareSvc.addAirfare($scope.newAirfare);
        if ($scope.isNewExpense) {
            TripSvc.currentTrip.addExpense($scope.newAirfare);
        }
        $scope.modal.hide();			
    };
    
    $scope.saveAirfare = function() {        
        console.log('save updates to expense: ' + $scope.newAirfare);
    };
    
    $scope.addReceipt = function() {
        console.log('add a receipt for this expense: ' + $scope.newAirfare);
    };

});
