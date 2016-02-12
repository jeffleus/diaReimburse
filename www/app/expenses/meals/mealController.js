angular.module('starter.controllers')

.controller('MealCtrl', function($scope, MealExp, MealSvc, TripSvc) {
    
    console.log('Meal Controller...');
    $scope.$on('modal.shown', function() {
        if (!$scope.newMeal) {
            $scope.newMeal = new MealExp();
        }
    });

    $scope.saveNew = function() {
        console.log('MealCtrl: save new expense');
        if ($scope.isNewExpense) {
            TripSvc.currentTrip.addExpense($scope.newMeal);
        }
        TripSvc.pause();
        $scope.modal.hide();			
    };
});
