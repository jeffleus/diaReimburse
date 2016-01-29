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
    self.lastSaved = new Date();
    
    self.resume = _resume;
    self.pause = _pause;
    
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
        if (localStorage['lastSaved']) {
            self.lastSaved = moment(localStorage['lastSaved']).toDate();
        }
    };
    
    function _resume() {
        if (localStorage['settings']) {
            //parse the localStorage for settings and then extend the current service to overwrite data
            var settings = JSON.parse(localStorage['settings']);
            angular.extend(self, settings);                    
        }
    }
    
    function _pause() {
        //timestamp the settings before saving
        self.lastSaved = new Date();
        //then stringify and stuff in localStorage
        var settings = JSON.stringify(self);
        localStorage['settings'] = settings;
    }
});

