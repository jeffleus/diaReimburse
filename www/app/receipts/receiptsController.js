angular.module('starter.controllers')

.controller('ReceiptsCtrl', function($scope, $state, $timeout, $ionicActionSheet, $cordovaCamera, $cordovaFile
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
        
        
        $cordovaFile.checkDir(cordova.file.documentsDirectory, '')
        .then(function(success) {
            console.log('checkDir directory found: ' + cordova.file.documentsDirectory);
            //create a reader and list direcotry contents
            var rdr = success.createReader();
            $q.when(rdr.readEntries())
            .then(function(entries) {
                console.log('directory read: ' + entries.length);
                //filter the entry list to only files and eliminate sysFiles and dotfiles
                var files = _.filter(entries, function(e) {
                    return e.isFile && e.name.charAt(0) !== '.'; 
                });
                console.log('filtered files: ' + files.length);
                // sort and grab the max file to use for incrementing
                var maxFile = _.chain(files).sortBy('name').last().value();
                console.log('max file: ' + maxFile.name);
                return maxFile.name;
        }).then(function(maxfile) {
            //filename parts and the xtension parts on '_' and '.' respectively
            var nameParts = origFilename.split('_');
            var extensionParts = nameParts[2].split('.');
            //parse, increment and reinsert the updated file index
            var number = parseInt(extensionParts[0]) + 1;
            var index = '000' + number.toString();
            index = index.substring(index.length-3);            
            extensionParts[0] = index;
            //rejoin the extension parts, and then rejoin the filename parts
            nameParts[2] = extensionParts.join('.');            
            newFilename = nameParts.join('_');
            
            return newFilename;
        }).then (function(newFilename) {
            $cordovaCamera.getPicture(options).then(function(imageData) {
                var r = new Receipt();
                r.title = "";
                r.description = "";
                r.image = imageData;

                movePhoto(imageData, newFilename).then(function(success) {
                    console.log(success);
                    r.image = success.nativeURL;
                    TripSvc.currentTrip.addReceipt(r);                
                    ReceiptSvc.currentReceipt = r;
                    ImageSvc.currentImage = r.image;        

                    $state.go('app.browse');
                }).catch(function(error) {
                    console.log('error w/ the move;')
                });

            }, function(err) {
              // error
            });
                
        })
        .catch(function(error) {
            console.log(error);
        });
        

//        $cordovaCamera.getPicture(options).then(function(imageData) {
//            var r = new Receipt();
//            r.title = "";
//            r.description = "";
////            r.image = "data:image/jpeg;base64," + imageData;
//            r.image = imageData;
//            
//            movePhoto(imageData).then(function(success) {
//                console.log(success);
//                r.image = success.nativeURL;
//                TripSvc.currentTrip.addReceipt(r);                
//                ReceiptSvc.currentReceipt = r;
//                ImageSvc.currentImage = r.image;        
//                
//                $state.go('app.browse');
//            }).catch(function(error) {
//                console.log('error w/ the move;')
//            });
//            
//        }, function(err) {
//          // error
//        });
    }
    
    function movePhoto(file, newFilename){
        var origFilename = file.replace(/^.*[\\\/]/, '');
//        var newFilename = file.replace(/^.*[\\\/]/, '');
        
        return $cordovaFile
        .checkFile(cordova.file.documentsDirectory, origFilename)
        .then(function(success) {
            //filename parts and the xtension parts on '_' and '.' respectively
            var nameParts = origFilename.split('_');
            var extensionParts = nameParts[2].split('.');
            //parse, increment and reinsert the updated file index
            var number = parseInt(extensionParts[0]) + 1;
            var index = '000' + number.toString();
            index = index.substring(index.length-3);            
            extensionParts[0] = index;
            //rejoin the extension parts, and then rejoin the filename parts
            nameParts[2] = extensionParts.join('.');            
            newFilename = nameParts.join('_');
            
            return $cordovaFile
                .moveFile(cordova.file.tempDirectory, origFilename, cordova.file.documentsDirectory, newFilename);
        }, function(error) {
            return $cordovaFile
                .moveFile(cordova.file.tempDirectory, origFilename, cordova.file.documentsDirectory, newFilename);
        })
        .then(function (success) {
            // success
            console.log('successfully moved');
            return success;
        })
        .catch(function (error) {
            // error
            console.log('error moving: ' + error);
        });
    }    
});
