angular.module('starter.services')

.factory('MileageExp', function() {
    var MileageExp = function() {
        this.expenseCategory = "Mileage";
        this.date = new Date();
        this.location = "";
        this.mileage = 0;
    }
    
    MileageExp.prototype.info = function() {
        console.log('MileageExp: ' + this.company);
    }
    
    return MileageExp;
});