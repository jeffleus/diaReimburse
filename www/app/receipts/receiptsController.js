angular.module('starter.controllers')

.controller('ReceiptsCtrl', function($scope, $q, $state, $timeout, $ionicActionSheet, $cordovaCamera, $cordovaFile
                                      , TripSvc, ImageSvc, ReceiptSvc, ReportSvc, EmailSvc, Receipt, Pouch) {
    $scope.addReceiptSheet = _addReceiptSheet;  
    $scope.deleteReceipt = _deleteReceipt;
    $scope.selectImage = _selectImage;
    $scope.takePicture = _takePicture;
    $scope.sendTrip = _sendTrip;
    $scope.tripSvc = TripSvc;
    $scope.imageSvc = ImageSvc;
    $scope.docFolder = cordova.file.documentsDirectory;
    
    $scope.$on('$ionicView.enter', function() {
        console.log('Enter Receipts Ctrl...');
        console.info('cordova.docsDir: ' + cordova.file.documentsDirectory);
        $cordovaFile.checkDir(cordova.file.documentsDirectory, '')
        .then(function(success) {
            console.info('checkDir: ' + success.toURL());
        })
        if (TripSvc.currentTrip.receipts && TripSvc.currentTrip.receipts.length > 0) {
            console.info('image dir: ' + TripSvc.currentTrip.receipts[0].image);
        }
    });    
    
    $scope.$on('$ionicView.leave', function() {
        console.log('Leave Receipts Ctrl...');
        TripSvc.pause();
    });    
    
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
        TripSvc.pause();
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
        var outputFile = "";
        var imgData = "";
        
        $cordovaFile.checkDir(cordova.file.documentsDirectory, '')
        .then(function(success) {
            console.log('checkDir directory found: ' + cordova.file.documentsDirectory);
            //create a reader and list direcotry contents
            return getMaxFilename(success);
        }).then(function(maxfile) {
            //pass the maxfile to the routine to increment maxfilename
            return incrementMaxFilename(maxfile);
        }).then(function(newFilename) {
            outputFile = newFilename;
            //now that a suitable filename is available, kickoff the picture takings (camera or library)
            return $cordovaCamera.getPicture(options);
        }).then(function(imageData) {
            //placeholder for now to allow passing thru the promise chain...
            imgData = imageData;
            return _getImageFileEntry(imageData)
            .then(function(fileEntry) {
                return _getImageFile(fileEntry);
            }).then(function(file) {
                return Pouch.db.put({
                    _id: moment().format(''),
                    _attachments: {
                        filename: {
                            type: 'image/jpeg',
                            data: file
                        }
                    }
                });
            });
        }).then(function() {
            //links up back to the initial response from getPic...
            return movePhoto(imgData, outputFile);
                
        }).then(function(success) {
            console.log('image moved: ' + success);
            //update the receipt object, and persist to tripSvc, receiptSvc, and imgSvc
            var r = new Receipt();
            r.image = success.name;
            TripSvc.currentTrip.addReceipt(r);
            ReceiptSvc.currentReceipt = r;
            ImageSvc.currentImage = r.image;
            TripSvc.pause();
            //navigate to the receipt viewer at the 'app.browse' route
            $state.go('app.browse');            
        })
        .catch(function(error) {
            console.error('_takePicture error: ' + error);
        });        
    }
    
    function _getImageFileEntry(fileUri) {        
        return $q(function(resolve, reject) {
            window.resolveLocalFileSystemURI(fileUri,function(fileEntry) {
                resolve(fileEntry);
            }, function(error) {
                reject(error);
            });
        });
    }
    function _getImageFile(fileEntry) {        
        return $q(function(resolve, reject) {
            fileEntry.file(function(file) {
                resolve(file);
            }, function(error) {
                reject(error);
            });
        });
    }
    
    function _sendTrip() {
		ReportSvc
			.runReportAsync(TripSvc.currentTrip)
			.then(function(filePath) {
				console.log('drafting email to send report');
                TripSvc.currentTrip.isSubmitted = true;
                EmailSvc
                    .sendEmail(TripSvc.currentTrip, filePath)
                    .then(function() {
                        $state.go('app.trips');
                    });
			});
	}
              
    function getMaxFilename(dirEntry) {
        //create a reader and list direcotry contents
        console.log('create dir reader: ' + dirEntry.fullPath);
        var defer = $q.defer();
        var rdr = dirEntry.createReader();
        //execute reader and wrap in an angular promise        
        rdr.readEntries(function(entries) {
            if (entries) {
                console.log('directory count: ' + entries.length);
                //filter the entry list to only files and eliminate sysFiles and dotfiles
                var files = _.filter(entries, function(e) {
                    return e.isFile && e.name.substring(0,3) == 'cdv'; 
                });
                console.log('filtered files: ' + files.length);
                if (files.length == 0) {
                    //first time, so init the filename to get started...
                    defer.resolve('cdv_photo_000.jpg');
                } else {
                    // sort and grab the max file to use for incrementing
                    var maxFile = _.chain(files).sortBy('name').last().value();
                    console.log('max file: ' + maxFile.name);
                    defer.resolve(maxFile.name);                    
                }
            }
        }, function(error) {
            defer.reject(error);
        });
        return defer.promise;
        //did not place catch clause here because not sure how to handle here...
        // but I think it should bubble up to be processed higher up in the chain
    }
    
    function incrementMaxFilename(filename) {
        //filename parts and the xtension parts on '_' and '.' respectively
        var nameParts = filename.split('_');
        var extensionParts = nameParts[2].split('.');
        //parse, increment and reinsert the updated file index
        var number = parseInt(extensionParts[0]) + 1;
        var index = '000' + number.toString();
        index = index.substring(index.length-3);            
        extensionParts[0] = index;
        //rejoin the extension parts, and then rejoin the filename parts
        nameParts[2] = extensionParts.join('.');            
        var newFilename = nameParts.join('_');

        return newFilename;        
    }
    
    function movePhoto(file, newFilename){
        var origFilename = file.replace(/^.*[\\\/]/, '');
        
        return $cordovaFile.moveFile(cordova.file.tempDirectory, origFilename
                                     , cordova.file.documentsDirectory, newFilename)
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
