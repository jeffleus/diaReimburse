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
        if (t.id == -1) t.id = self.trips.length;
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
        //check for an array of trips in the json data provided
        if (data.trips) {
            //reset the internal array of trips in the service, then loop each trip
            self.trips.length = 0;
            data.trips.forEach(function(tripData) {
                //pass the trip JSON to the constrcutor of the Trip class
                var trip = new Trip(tripData);
                //and add the trip to the collection in the service
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

.factory('Trip', function(AirfareExp, HotelExp, TransportationExp, MileageExp, MealExp
                           , MiscExp, TravelDate, Receipt, Note) {
    var Trip = function(data) {
        var self = this;
        //check the data param to check for a JSON object
        var isDataObject = (typeof data === "object") && (data !== null);
        
        this.id = -1;
        //if data is not JSON, it is the string for the title
        this.title = (!!data && !isDataObject)?data:"";
        this.purpose = "";
        
        this.traveler = "";
        this.travelerEmail = "";
        this.travelerDepartment = "";
        this.desinations = "";
        this.homeCity = "";
        this.vehicleUsed = "";
        this.statDate = new Date();
        this.endDate = new Date() + 1;
        this.travelDates = [];
        this.expenses = [];
        this.receipts = [];
        this.notes = [];
        this.isSubmitted = false;
        //if data is JSON, then use extend to copy in all the values
        if (data && isDataObject) {
            //this needs to be improved to do a deeper copy so expenses are objects w/ class methods
            //angular.extend(self, data);
            self.traveler = data['traveler'];
            self.travelerEmail = data['travelerEmail'];
            self.travelerDepartment = data['travelerDepartment'];
            self.title = data['title'];
            self.purpose = data['purpose'];
            self.desinations = data['desinations'];
            self.homeCity = data['homeCity'];
            self.vehicleUsed = data['vehicleUsed'];
            self.startDate = moment(data['startDate']).toDate();
            self.endDate = moment(data['endDate']).toDate();
            self.isSubmitted = data['isSubmitted'];
            if (data.expenses && data.expenses.length > 0) {
                var expenses = data.expenses;
                self.expenses = [];
                expenses.forEach(function(expenseData) {
                    if (expenseData['expenseCategory'] === 'Airfare') {
                        var expense = new AirfareExp(expenseData);
                    }
                    else if(expenseData['expenseCategory'] === 'Hotel') {
                        var expense = new HotelExp(expenseData);                        
                    }
                    else if(expenseData['expenseCategory'] === 'Transportation') {
                        var expense = new TransportationExp(expenseData);                        
                    }
                    else if(expenseData['expenseCategory'] === 'Mileage') {
                        var expense = new MileageExp(expenseData);                        
                    }
                    else if(expenseData['expenseCategory'] === 'Meal') {
                        var expense = new MealExp(expenseData);                        
                    }
                    else if(expenseData['expenseCategory'] === 'Misc') {
                        var expense = new MiscExp(expenseData);                        
                    }
                    self.addExpense(expense);
                })
            }
            if (data.travelDates && data.travelDates.length > 0) {
                var dates = data.travelDates;
                self.travelDates = [];
                dates.forEach(function(d) {
                    var travelDate = new TravelDate(d);
                    self.addTravelDate(d);
                })
            }
            if (data.receipts && data.receipts.length > 0) {
                var receipts = data.receipts;
                self.receipts = [];
                receipts.forEach(function(r) {
                    var rcpt = new Receipt(r);
                    self.addReceipt(rcpt);
                })
            }
            if (data.notes && data.notes.length > 0) {
                var notes = data.notes;
                self.notes = [];
                notes.forEach(function(n) {
                    var note = new Note(n);
                    self.addNote(note);
                })
            }
        }
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
    var TravelDate = function(data) {
        var self = this;
        this.travelDate = new Date();
            this.travelDate.setHours(12,0,0,0);
        this.departTime = new Date();
            this.departTime.setHours(8,0,0,0);
        this.returnTime = new Date();
            this.returnTime.setHours(17,0,0,0);
        this.isBreakfast = false;
        this.isLunch = false;
        this.isDinner = false;
        if (data) {
            //boolean attributes from the JSON data
            self.isBreakfast = data['isBreakfast'];
            self.isLunch = data['isLunch'];
            self.isDinner = data['isDinner'];
            //date attributes hydrated as dates from JSON using moment
            self.travelDate = moment(data['travelDate']).toDate();
            self.departTime = moment(data['departTime']).toDate();
            self.returnTime = moment(data['returnTime']).toDate();
        }
    }

    return TravelDate;
});