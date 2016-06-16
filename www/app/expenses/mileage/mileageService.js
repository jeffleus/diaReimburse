angular.module('starter.services')

.factory('MileageExp', function() {
    var MileageExp = function(data) {
        var self = this;
        this.expenseCategory = "Mileage";
        this.date = new Date();
        this.startLocation = "";
        this.endLocation = "";
        this.mileage = 0;
        this.isCourtesyCar = false;
        this.placesVisited = "";
        if (data) {
            //text attributes from the JSON data
            self.expenseCategory = data['expenseCategory'];
            self.startLocation = data['startLocation'];
            self.endLocation = data['endLocation'];
            self.placesVisited = data['placesVisited'];
            //numeric attributes from the JSON data
            self.mileage = data['mileage'];
            //boolean values
            self.isCourtesyCar = data['isCourtesyCar'];
            //date attributes hydrated as dates from JSON using moment
            self.date = moment(data['date']).toDate();
        }
    }
    
    MileageExp.prototype.info = function() {
        console.log('MileageExp: ' + this.company);
    }
    
    return MileageExp;
});