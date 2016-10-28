angular.module('starter.services')

.service('TripSvc', function($q, Trip, Pouch) {
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
        t._id = moment().format('YYYYMMDD.hhmmss.SSS');
        Pouch.db.put(t).then(function(result) {
            self.trips.push(t);
            console.log(result);
        }).catch(function(err) {
            console.log(err);
        });
    }
    
    function _deleteTrip(t) {
        console.log('TripSvc::deleteTrip - ' + t.title);
        Pouch.db.remove(t._id, t._rev);
        var index = self.trips.indexOf(t);
        if (index >-1) {
            self.trips.splice(index,1);
        } else {
            console.log('trip not found in tripSvc');
        }
    }	
	
	function _migrateResume() {
        _hydrateFromPouch();
//		//check for localStorage in the 'trips' key
//		var isLocal = !!localStorage['trips'];
//        //check for the pouch serve and db object
//        var isPouch = (Pouch && Pouch.db);
//		
//        
//        $q.when( isPouch ).then( function(isPouch) {
//            if (isPouch) {
//                return Pouch.db.info();
//            } else return;
//        }).then(function(info) {
//
//            if (isLocal) {
//                if (info && info.update_seq == 0) {
//            //Case1: localStorage and a NEW pouchdb
//                    _hydrateFromLocal();
//                    //pause to store in pouchDB and start migration
//                    _pause();                    
//                } else if (info && info.update_seq !== 0) {
//            //Case2: localStorage and a data in pouchdb
//                    //clear the local store to complete the migration
//                    localStorage.removeItem('trips');
//                    _hydrateFromPouch();
//                } else {
//            //Case3: no pouchdb so carry on w/ localStorage
//                    _hydrateFromLocal();
//                }                
//            } else {
//                if (isPouch) {
//                    _hydrateFromPouch();
//                } else {
//                    throw new Error('There is no localStorage and no PouchDB for trips.');
//                }                
//            }
//        });
	}
	
    function _hydrateFromLocal() {
        if (localStorage['trips']) {
            //parse the localStorage for trips and then extend the current service to overwrite data
            var serviceData = JSON.parse(localStorage['trips']);
            //angular.extend(self, settings);
            return _hydrate(serviceData);
        } else { 
            throw new Error('hydrateFromLocal: There is no localStorage of trips.');
        }
    }
    
    function _hydrateFromPouch() {
        return Pouch.db.allDocs({include_docs:true, attachments:true}).then(function(result) {
            //Pouch.db.delete(self.trips[0]._id);
            return _hydrate(result);
        }).catch(function(err) {
            console.error(err);
        });
    }
    
    function _resume() {
//        if (Pouch && Pouch.db) {
//			if (localStorage['trips']) {
//				//parse the localStorage for trips and then extend the current service to overwrite data
//				var serviceData = JSON.parse(localStorage['trips']);
//
//			}
//			Pouch.db.info().then(function(info) {
//				if (info.update_seq === 0) {
//					_pause();
//				} else {
//					localStorage.removeItem('trips');
//				}
//			});
//
//			return Pouch.db.allDocs({include_docs:true}).then(function(result) {
//                _hydrate(result);
//            }).catch(function(err) {
//                console.error(err);
//            });
//        }
        _migrateResume();

        
//        if (localStorage['trips']) {
//            //parse the localStorage for trips and then extend the current service to overwrite data
//            var serviceData = JSON.parse(localStorage['trips']);
//            //angular.extend(self, settings);
//            _hydrate(serviceData);
//        }
    }
    
    function _hydrate(data) {
        //check for an array of trips in the json data provided
        if (data) {
            var trips = data.trips?data.trips:data.rows;
            //reset the internal array of trips in the service, then loop each trip
            self.trips.length = 0;
            trips.forEach(function(tripData) {
                //pass the trip JSON to the constrcutor of the Trip class
                var trip = new Trip(tripData.doc);
//                trip.id = tripData.doc._id;
//                trip.rev = tripData.doc._rev
                
                //and add the trip to the collection in the service
                self.trips.push(trip)
                //_addTrip(trip);
            })
        }
    }
    
    function _saveTrip(t) {
        t.receipts.forEach(function(r) {
            delete r.imageUrl;
        })
        
        return Pouch.db.put(t).then(function(result) {
            console.info('trip saved to db');
            console.log(result);
        });
    }    
    
    function _pause() {
//        //stringify and stuff in localStorage
//        var settings = JSON.stringify(self);
//        localStorage['trips'] = settings;
        
//        self.trips.forEach(function(trip) {
//            Pouch.db.put(trip._id, trip._rev)
//        })

        
        
//        var chain = $q.when();
//        self.trips.forEach(function(t) {
//            chain = chain.then(_saveTrip(t));
//        })
//        
//        return chain.then(function() {
//            console.log('trips saved to database');
//        });
//        self.trips.forEach(function(t) {
//            t.receipts.forEach(function(r) {
//                delete r.imageUrl;
//            });
//        });
        
//        return Pouch.db.bulkDocs(self.trips).then(function(result) {
//            console.info('tripService.pause()');
//            return;
//        }).catch(function(err) {
//            console.error('ERR: tripService.pause()');
//            return;
//        });
    }
    
    return self;
})

.factory('Trip', function($log, AirfareExp, HotelExp, TransportationExp, MileageExp, MealExp
                           , MiscExp, TravelDate, Receipt, Note, Pouch) {
    var Trip = function(data) {
        var self = this;
        //check the data param to check for a JSON object
        var isDataObject = (typeof data === "object") && (data !== null);
        
        this.id = -1;
		this._id = moment().format('YYYYMMDD.hhmmss.SSS');
        //if data is not JSON, it is the string for the title
        this.title = (!!data && !isDataObject)?data:"";
        this.purpose = "";
        
        this.traveler = "";
        this.travelerEmail = "";
        this.travelerDepartment = "";
        this.destinations = "";
        this.homeCity = "";
        this.vehicleUsed = "";
        this.statDate = new Date();
        this.endDate = new Date() + 1;
        this.travelDates = [];
        this.expenses = [];

        this.receiptDocId = 'rcpts_' + this._id;
        this.receiptRev = '0-0';
        this.receiptIndex = 0;
        this.receipts = [];

		this.notes = [];
        this.isSubmitted = false;
        //if data is JSON, then use extend to copy in all the values
        if (data && isDataObject) {
            self._id = data._id;
            self._rev = data._rev;
            //this needs to be improved to do a deeper copy so expenses are objects w/ class methods
            //angular.extend(self, data);
            self.traveler = data['traveler'];
            self.travelerEmail = data['travelerEmail'];
            self.travelerDepartment = data['travelerDepartment'];
            self.title = data['title'];
            self.purpose = data['purpose'];
            self.destinations = data['destinations'];
            self.homeCity = data['homeCity'];
            self.vehicleUsed = data['vehicleUsed'];
            self.startDate = moment(data['startDate']).toDate();
            self.endDate = moment(data['endDate']).toDate();
            self.receiptIndex = data['receiptIndex'];
            self.receiptDocId = data['receiptDocId'];
            self.receiptRev = data['receiptRev'];
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
//                    self.addReceipt(rcpt);
					self.receipts.push(rcpt);
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
	Trip.prototype.save = _save;
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
    
	function _save() {
		return Pouch.db.put(this).then(function(result) {
			console.info('Trip.saved: ' + result);
		});
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
        return sum.toFixed(2);
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

	function _addReceipt(r, file) {
		var self = this;
		r.attachId = 'receipt_' + (++self.receiptIndex) + '.jpg';
		var receiptResult = {};
		return _saveAttachment.call( self, r.attachId, file )
			.then(function(result){
				self.receiptIndex++;
				self.receiptRev = result.receiptRev;
				self.receipts.push(r);
				receiptResult.imageUrl = result.imageUrl;
				return Pouch.db.put(self);
			}).then(function(result) {
				self._rev = result.rev;
				return receiptResult.imageUrl; 
			}).catch(function(err) {
				self.receiptIndex--;
				$log.error(err);
			});
		
//		return Pouch.db.putAttachment(this._id, imageFile, this._rev, r.imageUrl, 'image/jpeg')
//		.then(function(result) {
//			return Pouch.db.get(this._id, {rev:result.rev, attachments:true});
//		}).then(function(tripWithAttachments) {
//			this._rev = tripWithAttachments._rev;
//			this._attachments = tripWithAttachments._attachments;
//			this.receipts.push(r);
//			return this.save();
//		}).catch(function(err) {
//			console.error(err);
//		});
	}
        
	function _saveAttachment(attachId, file) {
		//grab the docId for receipt master doc from this trip object
		var docId = this.receiptDocId;
		//setup the latest document revision nunmber if not new
		var attachmentResult = {};
		var rev = (this.receiptRev!=="0-0")?this.receiptRev:undefined;
		//put the image file in the receipt master doc
		return Pouch.db.putAttachment(docId, attachId, rev, file, 'image/jpeg')
			.then(function (result) {
				//log the result and update the trip to hold the latest revision for the master doc
				$log.log(result);
				attachmentResult.receiptRev = result.rev;
				//then, grab the image file blob using getAttachment
				return Pouch.db.getAttachment(docId, attachId);
			}).then(function(blob) {
				if (blob) {
//                        $log.info(blob);
//                        //set the imageUrl of the current image as an object URL for the blob data
//                        ImageSvc.currentImage.imageUrl = URL.createObjectURL(blob);
//                        $log.info(ImageSvc.currentImage.imageUrl);
					attachmentResult.imageUrl = URL.createObjectURL(blob);
					return attachmentResult;
				}
			}).catch(function (err) {
				$log.log(err);
			});            
	}
    
    function _deleteReceipt(r) {
        console.log('Trip::deleteReceipt - ' + r);
        var index = this.receipts.indexOf(r);
        if (index >-1) {
			_deleteAttachment.then(function(rev) {
				this.receiptRev = rev;
				this.receipts.splice(index,1);
			});
        } else {
            console.log('receipt not found in trip object');
        }
    }
	
	function _deleteAttachment(docId, attachId, rev) {
		return Pouch.db.removeAttachment(docId, attachId, rev)
			.then(function(result) {
				return result.rev;
			}).catch(function(err) {			
				$log.error(err);
			});
	}

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