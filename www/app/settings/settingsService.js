angular.module('starter.services')

.service('SettingsSvc', function() {
    var self = this;
    self.firstName = "";
    self.lastName = "";
    self.email = "";
    self.department = "";
    self.homeCity = "";
    self.defaultPurpose = "";
    self.defaultTitle = "";
    
    _init();
    function _init() {
        console.log('SettingsCtrl_init()');
        self.firstName = "Joe";
        self.lastName = "Bruin";
        self.email = "jeffl@athletics.ucla.edu";
        self.department = "Information Tech";
        self.homeCity = "Westwood, CA";
        self.defaultTitle = self.firstName.substring(0,1) + self.lastName + ' Trip'
        self.defaultPurpose = "recruiting travel";
    };
});

