angular.module('starter.controllers')

.controller('SettingsCtrl', function($scope, SettingsSvc) {
    var self = this;
    $scope.settingsSvc = SettingsSvc;
    
    $scope.$on('$ionicView.enter', function() { 
        _init(); 
    });
    $scope.$on('$ionicView.leave', function() { 
        _save(); 
    });    
    
    function _init() {
        console.log('SettingsCtrl_init()');
    };
    
    function _save() {
        console.log('SettingsCtrl_save()');    
        SettingsSvc.pause();
    }
});

