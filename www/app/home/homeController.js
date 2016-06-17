angular.module('starter.controllers')

.controller('HomeCtrl', function($scope, $rootScope, $timeout, $ionicPopup
                                     , $cordovaEmailComposer, ReportSvc, EmailSvc, TripSvc) {
    $scope.data = {};
    $scope.tripSvc = TripSvc;
    $scope.addDestination = _toggleSubmitted;
    $scope.sendTrip = _sendTrip;
    
    $rootScope.$on('$stateChangeSuccess', _save);
    
    function _save() {
        console.log('HomeCtrl: saving tripSvc state to localStorage');
        TripSvc.pause();
    }
	
    function _toggleSubmitted() {
        TripSvc.currentTrip.isSubmitted = !TripSvc.currentTrip.isSubmitted;
    }
    
	function _sendTrip() {
		ReportSvc
			.runReportAsync(TripSvc.currentTrip)
			.then(function(filePath) {
//				console.log('new async report routine');
//				showLoading('Opening Report...');
				console.log('drafting email to send report');
//				_sendEmail(filePath);
                TripSvc.currentTrip.isSubmitted = true;
                EmailSvc.sendEmail(TripSvc.currentTrip, filePath);
			});
	}
  
    function _addDestination() {
        $scope.data = {};        
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.destination">',
            title: 'Enter Wi-Fi Password',
            subTitle: 'Please use normal things',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                { text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.data.destination) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                } else {
                    return $scope.data.destination;
                }}
            }]
        });

        myPopup.then(function(res) {
            console.log('Tapped!', res);
            var d = { id: TripSvc.currentTrip.destinations.length + 1, title: res };
            TripSvc.currentTrip.destinations.push(d);
        });
//        $timeout(function() {
//            myPopup.close(); //close the popup after 3 seconds for some reason
//        }, 3000);
    };
});
