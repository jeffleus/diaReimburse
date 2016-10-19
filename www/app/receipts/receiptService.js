angular.module('starter.services')

.service('ReceiptSvc', function(Pouch) {
    var self = this;
    self.currentReceipt = [];
})

.factory('Receipt', function(Pouch) {
    var Receipt = function(data) {
        var self = this;
        this.date = moment().toDate();
        this.vendor = "";
        this.title = "";
        this.description = "";
        this.image = "";
        this.tripId;

        if (data) {
            self.vendor = data.vendor;
            self.title = data.title;
            self.description = data.description;
            self.image = data.image;
            self.attachmentId = data.attachmentId;
//			self.imageUrl = data.imageUrl;

//            Receipt.defineProperty(this, "imageUrl", {
//                get: function() {
//                        return Pouch.db.getAttachment(this.tripId, this.attachmentId)
//                            .then(function(imgBlob) {
//                                self.imageUrl = URL.createObjectURL(imgBlob);
//                                return self.imageUrl;
//                            }).catch(function(err) {
//                                console.error('Receipt_getImageUrl: ' + err);
//                                return;
//                            });        
//                }
//            });
            
            //date attributes hydrated as dates from JSON using moment
            self.date = moment(data['date']).toDate();
            
//            return Pouch.db.getAttachment(TripSvc.currentTrip._id, imageFile).then(function(imgBlob) {
//                return self.imageUrl = URL.createObjectURL(blob);
//            })
        }
    }    
    
    Receipt.prototype.getImageUrl = function(t) {
        console.info('getAttachemnt: ' + t._id + ', ' + this.attachmentId);
            TripSvc.currentTrip._rev = result.rev;
            return Pouch.db.getAttachment(TripSvc.currentTrip._id, imageFile).then(function(imgBlob) {
                blob = imgBlob;
            });
        return Pouch.db.getAttachment(t._id, this.attachmentId)
            .then(function(imgBlob) {
                self.imageUrl = URL.createObjectURL(imgBlob);
                return self.imageUrl;
            }).catch(function(err) {
                console.error('Receipt_getImageUrl: ' + err);
                return;
            });        
    }

    return Receipt;
});