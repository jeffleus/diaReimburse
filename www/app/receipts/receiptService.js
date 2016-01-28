angular.module('starter.services')

.service('ReceiptSvc', function() {
    var self = this;
    self.currentReceipt = [];
})

.factory('Receipt', function() {
    var Receipt = function() {
        this.title = "";
        this.description = "";
        this.image = "";
    }

    return Receipt;
});