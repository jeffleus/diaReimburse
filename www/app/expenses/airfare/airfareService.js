angular.module('starter.services')

.service('AirfareSvc', function(AirfareExp) {
    var self = this;
    self.airExpenses = [];
    
    self.addAirfare = _addAirfare;
    self.deleteAirfare = _deleteAirfare;
    _init();
    
    function _init() {
        var initExp = new AirfareExp();
        initExp.date = new Date();
        initExp.airline = "United Airlines";
        initExp.amount = "";
        initExp.destinations = "";
        
        _addAirfare(initExp);
    }
    
    function _addAirfare(e) {
        console.log('AirfareSvc::addTrip - ' + e.date + e.airline);
        self.airExpenses.push(e);
    }
    
    function _deleteAirfare(e) {
        console.log('AirfareSvc::deleteTrip - ' + e.date + e.airline);
        var index = self.airExpenses.indexOf(e);
        if (index >-1) {
            self.airExpenses.splice(index,1);
        } else {
            console.log('trip not found in tripSvc');
        }
    }

    return self;
})

.factory('AirfareExp', function() {
    var Airfare = function() {
        this.expenseCategory = "Airfare";
        this.date = "";
        this.airline = "";
        this.depart = "";
        this.arrive = "";
        this.destinations = "";
        this.amount = "";
    }
    
    Airfare.prototype.info = function() {
        console.log('Title: ' + this.title);
    }
    
    return Airfare;
});