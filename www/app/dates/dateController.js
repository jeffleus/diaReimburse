angular.module('starter.controllers')

.controller('DatesCtrl', function($scope, $ionicModal, $cordovaDatePicker, TravelDate, TripSvc) {
    // use tripSvc to access currentTrip and collection of travel dates
	$scope.tripSvc = TripSvc;
//PUBLIC METHODS
	$scope.showTravelDateModal = _showTravelDateModal;
	$scope.addTravelDate = _addTravelDate;
    $scope.saveNew = _saveTravelDate;
    $scope.deleteTravelDate = _deleteTravelDate;
    $scope.closeModal = _closeModal;
    //log the controller instantiation
    console.log('DatesCtrl Controller...');
//MODAL EVENTS
    $scope.$on('modal.shown', function() {
        if (!$scope.newTravelDate) {
            $scope.newTravelDate = new TravelDate();
        }
    });
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
				           
    function _saveTravelDate() {
        console.log('DatesCtrl: save new travel date');
        if ($scope.isNewTravelDate) {
            TripSvc.currentTrip.addTravelDate($scope.newTravelDate);
        }
        TripSvc.pause();
        $scope.modal.hide();			
    };
    
    function _deleteTravelDate(d) {
        TripSvc.currentTrip.deleteTravelDate(d);
        TripSvc.pause();
    }

    function _showTravelDateModal(d) {
        if (!d) { 
            $scope.isNewTravelDate = true;
        } else $scope.isNewTravelDate = false;

		$scope.newTravelDate = d;
		_loadTravelDateModal();
    }
	
	function _addTravelDate() {
		_showTravelDateModal();
	}

    function _closeModal() {
		$scope.newTravelDate = null;
		$scope.modal.hide();
	};
				
	function _loadTravelDateModal() {
		$ionicModal.fromTemplateUrl('app/dates/travelDateModal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
			modal.show();
		});
	}
});