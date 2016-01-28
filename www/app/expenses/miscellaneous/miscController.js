angular.module('starter.controllers')

.controller('MiscCtrl', function($scope, MiscExp, MiscSvc, TripSvc) {
    
    console.log('Misc Controller...');
    $scope.$on('modal.shown', function() {
        if (!$scope.newMisc) {
            $scope.newMisc = new MiscExp();
        }
    });

    $scope.saveNew = function() {
        console.log('MiscCtrl: save new expense');
        if ($scope.isNewExpense) {
            TripSvc.currentTrip.addExpense($scope.newMisc);
        }
        $scope.modal.hide();			
    };
});
