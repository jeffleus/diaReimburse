angular.module('starter.controllers')

.controller('ReceiptsCtrl', function($scope, $state, $timeout, $ionicActionSheet, $cordovaCamera
                                      , TripSvc, ImageSvc, ReceiptSvc, Receipt) {
    $scope.addReceiptSheet = _addReceiptSheet;  
    $scope.deleteReceipt = _deleteReceipt;
    $scope.selectImage = _selectImage;
    $scope.takePicture = _takePicture;
    $scope.tripSvc = TripSvc;
    $scope.imageSvc = ImageSvc;
    
    function _addReceiptSheet() {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: '<b>Take New Photo</b>' },
                { text: 'Exisiting Photo' }
            ],
            titleText: 'Add Receipt',
            cancelText: 'Cancel',
            cancelFunc: function() {
            },
            buttonClicked: function(index) {
                hideSheet();
                _takePicture(index);
                return true;
            }
        });
        //safety net timeout call to hide the action sheet if no input after 3sec
        $timeout(function() {
            hideSheet();
        }, 3000);
    }
    
    function _deleteReceipt(r) {
        TripSvc.currentTrip.deleteReceipt(r);
    }
    
    function _selectImage(r) {
        ReceiptSvc.currentReceipt = r;
        ImageSvc.currentImage = r.image;        
//        ImageSvc.currentImage = ImageSvc.images[$index];
        $state.go('app.browse');
    }
    
    function _takePicture(useLibrary) {
        var options = {
          quality: 80,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: (useLibrary==0)?Camera.PictureSourceType.CAMERA:Camera.PictureSourceType.PHOTOLIBRARY,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 850,
          targetHeight: 1100,
          saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            var r = new Receipt();
            r.title = "";
            r.description = "";
//            r.image = "data:image/jpeg;base64," + imageData;
            r.image = imageData;
            TripSvc.currentTrip.addReceipt(r);
            ReceiptSvc.currentReceipt = r;
            ImageSvc.currentImage = r.image;        
            
            $state.go('app.browse');
        }, function(err) {
          // error
        });
    }    
});
