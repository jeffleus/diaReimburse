angular.module('starter.services')

.service('ReceiptSvc', function() {
    var self = this;
    self.currentReceipt = [];
})

.factory('Receipt', function() {
    var Receipt = function(data) {
        var self = this;
        this.title = "";
        this.description = "";
        this.image = "";
        if (data) {
            self.title = data.title;
            self.description = data.description;
            self.image = data.image;
        }
    }

    return Receipt;
});