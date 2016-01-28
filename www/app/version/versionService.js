angular.module('starter.services')

.service('VersionSvc', function($cordovaAppVersion) {
    var self = this;
    self.version = "0.0.1";
    
    _init();
    function _init() {
        document.addEventListener("deviceready", function () {
            $cordovaAppVersion.getVersionNumber().then(function (version) {
                var self.version = version;
            }).catch(function(error) {
                console.log('VersionSvc::_init - ' + error);
            });
        }, false);        
    }
});