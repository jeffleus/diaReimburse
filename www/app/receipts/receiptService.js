angular.module('starter.services')

.service('ReceiptSvc', function(Pouch) {
    var self = this;
    self.currentReceipt = [];
})

.factory('Receipt', function(Pouch) {
    var Receipt = function(data) {
        var self = this;
        this.date = moment().toDate();
        this.title = "";
        this.vendor = "";
        this.description = "";
        this.image = "";

        if (data) {
            self.title = data.title;
            self.vendor = data.vendor;
            self.description = data.description;
            self.image = data.image;
            //date attributes hydrated as dates from JSON using moment
            self.date = moment(data['date']).toDate();
            //picked up once saved to the pouchdb w/ an attachment
            self.attachId = data['attachId'];
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
            
//            return Pouch.db.getAttachment(TripSvc.currentTrip._id, imageFile).then(function(imgBlob) {
//                return self.imageUrl = URL.createObjectURL(blob);
//            })
        }
    }    

//
// on hold while integrating logic from prototype
//	
//    Receipt.prototype.getImageUrl = function(t) {
//        console.info('getAttachemnt: ' + t._id + ', ' + this.attachmentId);
//		Pouch.db.get(t._id, {attachments:true}).then(function(result) {
//			console.info(result);
//		});
//		
//        return Pouch.db.getAttachment(t._id, this.attachmentId)
//            .then(function(imgBlob) {
//                self.imageUrl = URL.createObjectURL(imgBlob);
//                return self.imageUrl;
//            }).catch(function(err) {
//                console.error('Receipt_getImageUrl: ' + err);
//                return;
//            });        
//    }

    return Receipt;
});