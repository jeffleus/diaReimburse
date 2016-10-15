angular.module('starter.services')

.service('ReceiptSvc', function() {
    var self = this;
    self.currentReceipt = [];
})

.factory('Receipt', function() {
    var Receipt = function(data) {
        var self = this;
        this.date = new Date();
        this.vendor = "";
        this.title = "";
        this.description = "";
        this.image = "";
        this.imageUrl = "";

        if (data) {
            self.vendor = data.vendor;
            self.title = data.title;
            self.description = data.description;
            self.image = data.image;
            //date attributes hydrated as dates from JSON using moment
            self.date = moment(data['date']).toDate();
        }
    }

    return Receipt;
});