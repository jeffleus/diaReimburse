angular.module('starter.services')

.service('MiscSvc', function(MiscExp) {
    var self = this;
    self.miscExpenses = [];
    
    self.addMisc = _addMisc;
    self.deleteMisc = _deleteMisc;
    _init();
    
    function _init() {
    }
    
    function _addMisc(e) {
    }
    
    function _deleteMisc(e) {
    }

    return self;
})

.factory('MiscExp', function() {
    var MiscExp = function() {
        this.expenseCategory = "Misc";
        this.date = "";
        this.description = "";
        this.amount = "";
    }
    
    MiscExp.prototype.info = function() {
        console.log('MiscExp: ' + this.title);
    }
    
    return MiscExp;
});