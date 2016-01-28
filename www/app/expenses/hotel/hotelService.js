angular.module('starter.services')

.service('HotelSvc', function(AirfareExp) {
    var self = this;
    self.airExpenses = [];
    
    self.addAirfare = _addAirfare;
    self.deleteAirfare = _deleteAirfare;
    _init();
    
    function _init() {
        var initExp = new AirfareExp();
        initExp.date = new Date('2011-04-11');
        initExp.airline = "United Airlines";
        initExp.amount = "$453.21";
        initExp.destinations = "CHI";
        
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

.factory('HotelExp', function() {
    var HotelExp = function() {
        this.expenseCategory = "Hotel";
        this.date = "";
        this.hotelName = "";
        this.amount = "";
        this.notes = "";
    }
    
    HotelExp.prototype.info = function() {
        console.log('HotelExp: ' + this.title);
    }
    
    return HotelExp;
});