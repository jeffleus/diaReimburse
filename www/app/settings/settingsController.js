angular.module('starter.controllers')

.controller('SettingsCtrl', function($scope, SettingsSvc) {
    var self = this;
    $scope.settingsSvc = SettingsSvc;
    
    function _init() {
        console.log('SettingsCtrl_init()');
    };
});

