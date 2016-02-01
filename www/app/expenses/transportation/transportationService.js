angular.module('starter.services')

.factory('TransportationExp', function() {
    var TransportationExp = function() {
        this.expenseCategory = "Transportation";
        this.date = new Date();
        this.company = "";
        this.amount = "";
    }
    
    TransportationExp.prototype.info = function() {
        console.log('TransportationExp: ' + this.company);
    }
    
    return TransportationExp;
});