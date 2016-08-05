angular.module('starter.controllers')

.controller('TripCtrl', function($scope, $http, $cookies, $ionicPopup, $ionicModal, $state
                                    , $ionicLoading, $cordovaEmailComposer, $ionicListDelegate
                                    , AuthSvc, TripSvc, ImageSvc, ReportSvc, EmailSvc, ReportMock
                                    , Trip, TravelDate, AirfareExp, HotelExp, Receipt, Note
                                    , SettingsSvc) {
    $scope.tripSvc = TripSvc;
    $scope.gotoTrip = _gotoTrip;
    $scope.deleteTrip = _deleteTrip;
    $scope.sendTrip = _sendTrip;
    $scope.$on('$ionicView.enter', function() { _init(); });
    $scope.$on('$ionicView.leave', function() { _save(); });
    _init();
    function _init() {
//
// ReportSvc Event Listeners: Progress/Done
//
		$scope.$on('ReportSvc::Progress', function(event, msg) {
			showLoading(msg);
		});		 
		$scope.$on('ReportSvc::Done', function(event, err) {
			hideLoading();
		});
    }
    
    function _save() {
        console.log('TripCtrl: saving tripSvc data to localStorage');
        TripSvc.pause();
    }

    function _newTrip() {
        //set today as the start date
        var startDate = new Date();
        //and set the endDate default to 5 days from start
        var endDate = new Date();
        endDate.setDate(endDate.getDate() + parseInt(5));
        //create the trip w/ a title, city, start and end
        var trip = new Trip(SettingsSvc.defaultTitle);
        trip.purpose = SettingsSvc.defaultPurpose;
        trip.homeCity = SettingsSvc.homeCity;
        trip.startDate = startDate;
        trip.endDate = endDate;
        trip.vehicleUsed = "Personal";
        //build a default destination list for now
//        trip.destinations = [{id:1,title:'Seattle'}, {id:2,title:'Tacoma'}, 
//                           {id:3,title:'Pullman'}];
        trip.destinations = "";
        
        console.log('start: ' + trip.startDate.toLocaleDateString());
        console.log('end: ' + trip.endDate.toLocaleDateString());
        
//		_mockTravelDates(trip);
//        _mockAirfare(trip);
//        _mockHotel(trip);
//        _mockReceipts(trip);
//        _mockNotes(trip);
        
        return trip;
    }
	
	function _sendTrip(t) {        
        if (_validateTrip(t)) {            
            ReportSvc
                .runReportAsync(t)
                .then(function(filePath) {
//                    console.log('new async report routine');
//    				showLoading('Opening Report...');
                    console.log('drafting email to send report');
//                    _sendEmail(t, filePath);
                    t.isSubmitted = true;
                    EmailSvc
                        .sendEmail(t,filePath)
                        .then(function() {
                            $state.go('app.trips');
                        });;
                
                    $ionicListDelegate.closeOptionButtons();
                });
        }
	}

    function _validateTrip(t) {
        var isValid = true;
        isValid = isValid && (t.purpose && t.purpose.length > 0);
        isValid = isValid && (t.startDate);
        return isValid;
    }
        
    function _mockAirfare(t) {
        var airfare = new AirfareExp();
        airfare.airline = "United Airlines";
        airfare.date = new Date('2011-04-11');
        airfare.amount = 425.61;
        t.addExpense(airfare);
        airfare = new AirfareExp();
        airfare.airline = "American Airlines";
        airfare.date = new Date('2011-04-16');
        airfare.amount = 384.17;
        t.addExpense(airfare);
    }
    
    function _mockHotel(t) {
        var hotel = new HotelExp();
        hotel.hotelName = "Marriot Courtyard";
        hotel.date = new Date('2011-04-12');
        hotel.amount = 143.25;
        hotel.notes = 'this is a test hotel note';
        t.addExpense(hotel);
        hotel = new HotelExp();
        hotel.hotelName = "Marriot Courtyard";
        hotel.date = new Date('2011-04-12');
        hotel.amount = 281.25;
        hotel.notes = 'this is a test hotel note';
        t.addExpense(hotel);
    }
	
	function _mockTravelDates(t) {
		var d = new TravelDate();
		d.travelDate = new Date(2015, 7, 14, 12, 0, 0, 0);
		d.departTime = new Date(2015, 7, 14, 13, 15, 0, 0);
		d.returnTime = new Date(2015, 7, 14, 21, 0, 0, 0);
		d.isBreakfast = false;
		d.isLunch = false;
		d.isDinner = true;
		t.addTravelDate(d);

		d = new TravelDate();
		d.travelDate = new Date(2015, 7, 15, 12, 0, 0, 0);
		d.departTime = new Date(2015, 7, 15, 13, 15, 0, 0);
		d.returnTime = new Date(2015, 7, 15, 21, 0, 0, 0);
		d.isBreakfast = true;
		d.isLunch = true;
		d.isDinner = true;
		t.addTravelDate(d);

		d = new TravelDate();
		d.travelDate = new Date(2015, 7, 16, 12, 0, 0, 0);
		d.departTime = new Date(2015, 7, 16, 13, 15, 0, 0);
		d.returnTime = new Date(2015, 7, 16, 21, 0, 0, 0);
		d.isBreakfast = true;
		d.isLunch = true;
		d.isDinner = false;
		t.addTravelDate(d);
	}
    
    function _mockReceipts(t) {
        var r = new Receipt();
        r.title = "American Flight";
        r.description = "single image of the airfare receipt including my boarding pass";
        r.image = ImageSvc.images[0];
        t.addReceipt(r);
        
        r = new Receipt();
        r.title = "Best Western Hotel";
        r.description = "hotel folio receipt provided at checkout";
        r.image = ImageSvc.images[1];
        t.addReceipt(r);

        r = new Receipt();
        r.title = "Hertz Rental";
        r.image = ImageSvc.images[2];
        t.addReceipt(r);
    }
    
    function _mockNotes(t) {
        var n = new Note();
        n.notes = "this is the first note";
        t.addNote(n);
        
        n = new Note();
        n.noteDate.setDate(n.noteDate.getDate() + 1);
        n.notes = "this is the second note.  I made it longer to see how the text overflow is handled by the UI for listing notes.  This will require a much longer text region to be able to display and allow the user to edit, so I should configure to allow text-wrapping in the text region.";
        t.addNote(n);
    }
    
    $scope.addTrip = function() {
        TripSvc.addTrip($scope.newTrip);
        TripSvc.pause();
        $scope.newTrip = {};
        $scope.modal.hide();
    };
    
    function _gotoTrip(t) {
        console.log('Set Current Trip --> ' + t.title);
        TripSvc.currentTrip = t;
        $state.go('app.single.expenses', {'playlistId':t.id});
    }
    
    function _deleteTrip(t) {
        var confirmPopup = $ionicPopup.confirm({
         title: 'Delete Trip',
         template: 'Are you sure you want to delete the trip:<br/><br/><b>' + t.title + '</b>'
        });
        confirmPopup.then(function(res) {
         if(res) {
           console.log('Delete Trip');
            TripSvc.deleteTrip(t);
         } else {
           console.log('Cancel Delete');
         }
        });
    }
    
//    $scope.addDestination = function() {
//        var d = { id: $scope.newTrip.destinations.length + 1, title: 'another' };
//        $scope.newTrip.destinations.push(d);
//    };
//
// MODAL - Add Trip Form
//    
    $ionicModal.fromTemplateUrl('templates/add-trip.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.newTrip = _newTrip();
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });    
//
// Loading UI Functions: utility functions to show/hide loading UI
//
    function showLoading(msg) {
        $ionicLoading.show({
          template: msg
        });
    }
    function hideLoading(){
        $ionicLoading.hide();
    }
});

