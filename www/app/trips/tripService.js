angular.module('starter.services')

.service('TripSvc', function(Trip) {
    var self = this;    
    self.trips = [];
    self.currentTrip = {};
    self.addTrip = _addTrip;
    self.deleteTrip = _deleteTrip;
    self.resume = _resume;
    self.pause = _pause;
    
    function _addTrip(t) {
        console.log('TripSvc::addTrip - ' + t.title);
        t.id = self.trips.length;
        self.trips.push(t);
    }
    
    function _deleteTrip(t) {
        console.log('TripSvc::deleteTrip - ' + t.title);
        var index = self.trips.indexOf(t);
        if (index >-1) {
            self.trips.splice(index,1);
        } else {
            console.log('trip not found in tripSvc');
        }
    }
    
    function _resume() {
        if (localStorage['trips']) {
            //parse the localStorage for trips and then extend the current service to overwrite data
            var serviceData = JSON.parse(localStorage['trips']);
            //angular.extend(self, settings);
            _hydrate(serviceData);
        }
    }
    
    function _hydrate(data) {
        if (data.trips) {
            self.trips.length = 0;
            data.trips.forEach(function(tripData) {
                var trip = new Trip(tripData.title);
                angular.extend(trip, tripData);
                _addTrip(trip);
            })
        }
    }
    
    function _pause() {
        //stringify and stuff in localStorage
        var settings = JSON.stringify(self);
        localStorage['trips'] = settings;
    }
    
    return self;
})

.factory('Trip', function() {
    var Trip = function(title) {
        this.id = -1;
        this.title = title;
        this.purpose = "";
        
        this.traveler = "";
        this.travelerEmail = "";
        this.travelerDepartment = "";
//        this.destinations = [];
        this.desinations = "";
        this.homeCity = "";
        this.vehicleUsed = "";
        this.travelDates = [];
        this.expenses = [];
        this.receipts = [];
        this.notes = [];
        this.isSubmitted = false;
    }
    Trip.prototype.addExpense = _addExpense;
    Trip.prototype.deleteExpense = _deleteExpense;
    Trip.prototype.addTravelDate = _addTravelDate;
    Trip.prototype.deleteTravelDate = _deleteTravelDate;
    Trip.prototype.addReceipt = _addReceipt;
    Trip.prototype.deleteReceipt = _deleteReceipt;
    Trip.prototype.addNote = _addNote;
    Trip.prototype.deleteNote = _deleteNote;
    Trip.prototype.totalExpenses = _totalExpenses;
    
    Trip.prototype.info = function() {
        console.log('Title: ' + this.title);
    }
    
    function _addExpense(e) {
        this.expenses.push(e);
    }
    
    function _deleteExpense(e) {
        console.log('Trip::deleteExpense - ' + e);
        var index = this.expenses.indexOf(e);
        if (index >-1) {
            this.expenses.splice(index,1);
        } else {
            console.log('expense not found in trip object');
        }
    };
    
    function _totalExpenses() {
        var sum = 0;
        if (this.expenses && (this.expenses.length > 0)) {
            this.expenses.forEach(function(exp) {
                if (exp.amount) sum += exp.amount;
            })
        }
        return sum;
    }
	
	function _addTravelDate(d) {
		this.travelDates.push(d);
	}
    
    function _deleteTravelDate(d) {
        console.log('Trip::deleteTravelDate - ' + d);
        var index = this.travelDates.indexOf(d);
        if (index >-1) {
            this.travelDates.splice(index,1);
        } else {
            console.log('travelDate not found in trip object');
        }
    };

	function _addReceipt(r) {
		this.receipts.push(r);
	}
    
    function _deleteReceipt(r) {
        console.log('Trip::deleteReceipt - ' + r);
        var index = this.receipts.indexOf(r);
        if (index >-1) {
            this.receipts.splice(index,1);
        } else {
            console.log('receipt not found in trip object');
        }
    };

	function _addNote(n) {
		this.notes.push(n);
	}
    
    function _deleteNote(n) {
        console.log('Trip::deleteNote - ' + n);
        var index = this.notes.indexOf(n);
        if (index >-1) {
            this.notes.splice(index,1);
        } else {
            console.log('note not found in trip object');
        }
    };

    return Trip;
})


.factory('TravelDate', function() {
    var TravelDate = function() {
        this.travelDate = new Date();
            this.travelDate.setHours(12,0,0,0);
        this.departTime = new Date();
            this.departTime.setHours(8,0,0,0);
        this.returnTime = new Date();
            this.returnTime.setHours(17,0,0,0);
        this.isBreakfast = false;
        this.isLunch = false;
        this.isDinner = false;
    }

    return TravelDate;
});