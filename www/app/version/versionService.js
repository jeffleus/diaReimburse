angular.module('starter.services')

.service('VersionSvc', function($cordovaAppVersion) {
    var self = this;
    self.version = "0.1.0";
});