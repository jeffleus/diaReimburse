angular.module('starter.services')

.service('MealSvc', function(MealExp) {
    var self = this;
    self.mealExpenses = [];
    
    self.addMeal = _addMeal;
    self.deleteMeal = _deleteMeal;
    _init();
    
    function _init() {
    }
    
    function _addMeal(e) {
    }
    
    function _deleteMeal(e) {
    }

    return self;
})

.factory('MealExp', function() {
    var MealExp = function() {
        this.expenseCategory = "Meal";
        this.date = "";
        this.guestNames = "";
        this.restaurant = "";
        this.amount = "";
        this.isStudentAllowance = false;
    }
    
    MealExp.prototype.info = function() {
        console.log('MealExp: ' + this.title);
    }
    
    return MealExp;
});