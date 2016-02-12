angular.module('starter.controllers', ['ngCookies', 'ionic-timepicker'])

.controller('AppCtrl', function($scope, VersionSvc, $ionicModal, $timeout, $http, $cookies) {
    $scope.versionSvc = VersionSvc;
//.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, TokenSvc, $cookies) {
//  // Form data for the login modal
//  $scope.loginData = { username:'admin@example.com', password:'Admin@123456' };
//
//  // Create the login modal that we will use later
//  $ionicModal.fromTemplateUrl('templates/login.html', {
//    scope: $scope
//  }).then(function(modal) {
//    $scope.modal = modal;
//  });
//
//  // Triggered in the login modal to close it
//  $scope.closeLogin = function() {
//    $scope.modal.hide();
//  };
//
//  // Open the login modal
//  $scope.login = function() {
//    $scope.modal.show();
//  };
//    
//  $scope.logoff = function() {
//      $http.defaults.headers.common['RequestVerificationToken'] = TokenSvc.Token;
//      $http.post('http://reimburse.athletics.ucla.edu/account/logoff/', { })
//        .then(function() {
//            console.log('logoff request returned');
//        });
//  };
//
//  // Perform the login action when the user submits the login form
//  $scope.doLogin = function() {
//    console.log('Doing login', $scope.loginData);
//
//      $http.defaults.headers.common['RequestVerificationToken'] = TokenSvc.Token;
//      $http.post('http://reimburse.athletics.ucla.edu/account/login/', 
//                 { Email:$scope.loginData.username, Password:$scope.loginData.password, RememberMe:true })
//        .then(function() {
//            console.log('login request returned');
//            $scope.modal.hide();
//        });
//      
//  };
})

.controller('BrowseCtrl', function($scope, $state, $ionicScrollDelegate, $timeout
                                    , TripSvc, ImageSvc, ReceiptSvc) {
    (document.getElementById('page')).style.width = (screen.width) + "px";
    $scope.tripSvc = TripSvc;
    $scope.receiptSvc = ReceiptSvc;
    $scope.imageSvc = ImageSvc;
    $scope.gotoReceipts = _gotoReceipts;
    $scope.docFolder = cordova.file.documentsDirectory;
    
    $scope.$on('$ionicView.beforeEnter', function() {
        //timeout addresses issue where delegate could not find elem because compile not complete
        $timeout(function() {
            $ionicScrollDelegate.$getByHandle('inner').zoomTo(6);
            $ionicScrollDelegate.$getByHandle('inner').zoomBy(0.4);
            $ionicScrollDelegate.$getByHandle('inner').zoomTo(0.5);
        }, 250);
    });
    
    function _gotoReceipts(t) {
        TripSvc.pause();
        $state.go('app.single.receipts', {'playlistId':TripSvc.currentTrip.id});
    }
    
    $scope.zoomLevel = function() {
        var view = $ionicScrollDelegate.$getByHandle('inner').getScrollView();
        return view.__zoomLevel;
    }
    $scope.zoomIn = function() {
        $ionicScrollDelegate.$getByHandle('inner').zoomBy(2);
    };
    
    $scope.zoomOut = function() {
        $ionicScrollDelegate.$getByHandle('inner').zoomBy(0.5);
    };
})

.controller('PlaylistsCtrl', function($scope, $http, $cookies, $ionicPopup, $ionicModal, TokenSvc, AuthSvc, TripSvc, Trip) {
  $scope.playlists = [
    { title: 'Oregon', id: 1, startDate: '1/15/15', endDate: '1/19/15' },
    { title: 'Washington St', id: 2, startDate: '2/15/15', endDate: '2/18/15' },
    { title: 'Smith Invitational', id: 3, startDate: '2/21/15', endDate: '2/24/15' },
    { title: 'Stanford', id: 4, startDate: '2/25/15', endDate: '2/27/15' },
    { title: 'California', id: 5, startDate: '3/1/15', endDate: '3/7/15' },
    { title: 'Recruting-TEX', id: 6, startDate: '3/9/15', endDate: '3/14/15' }
  ];
    $scope.tripSvc = TripSvc;
    $scope.addTrip = function() {
        var trip = new Trip('jeffs test trip');
        TripSvc.addTrip(trip);
        $scope.modal.hide();
    };
    $scope.destinations = [{id:1,title:'Jeff'}, {id:2,title:'John'}, 
                           {id:3,title:'Dave'}, {id:4,title:'Bob'}];

    $scope.lookupPlayers = _lookupPlayers;
    function _lookupPlayers() {
        AuthSvc.IsAuthenticated().then(function(isAuth) {
            if ( isAuth ) {
                $http.defaults.headers.common['RequestVerificationToken'] = TokenSvc.Token;
                $http.get('http://reimburse.athletics.ucla.edu/api/players')
                    .then(function(resp) {
                        showAlert(resp.data);
                        console.log(resp.data);
                });
            } else { 
                showAlert('you are not logged in!');
                console.log('not logged in'); 
            }
        });
        // An alert dialog
        function showAlert(msg) {
            var alertPopup = $ionicPopup.alert({
                title: 'Lookup Player Result',
                template: msg
            });
            alertPopup.then(function(res) {
                console.log('Alert Closed...');
            });
        }
    }
    
    $scope.addDestination = function() {
        var d = { id: $scope.destinations.length + 1, title: 'another' };
        $scope.destinations.push(d);
    };
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
})

.controller('PlaylistCtrl', function($scope, $state) {
    $scope.gotoTrips = function() {
        $state.go('app.trips');
    };
})

.controller('NotesCtrl', function($scope, $timeout, $ionicActionSheet) {
})

.controller('SearchCtrl', function($scope, $timeout, $ionicActionSheet) {
    $scope.items = [
        { title: 'testing' },
        { title: 'testing' },
        { title: 'anohter' },
        { title: 'testing' },
        { title: 'still' },
        { title: 'testing' },
        { title: 'testing' },
        { title: 'testing' },
        { title: 'some' },
        { title: 'testing' },
        { title: 'info' },
        { title: 'testing' },
        { title: 'trying' },
        { title: 'and looking' },
        { title: 'testing' }
    ];
})
;
