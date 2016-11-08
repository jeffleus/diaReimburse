angular.module('starter.controllers')

.controller('SettingsCtrl', function($scope, $log, SettingsSvc) {
    var self = this;
    $scope.vm = {};
    $scope.settingsSvc = SettingsSvc;
    
    $scope.$on('$ionicView.enter', function() { 
        _init(); 
    });
    $scope.$on('$ionicView.leave', function() { 
        _save(); 
    });    
	    
    function _init() {
        $log.log('SettingsCtrl_init()');
    };
    
    function _save() {
        var isDirty = $scope.vm.settingsForm.$dirty;
        if (isDirty) { 
            $log.log('SettingsCtrl_save()');    
            SettingsSvc.pause()
                .then(function(isSaved) {
                    //reset the form to pristine after a successful save
                    $scope.vm.settingsForm.$setPristine();
                }); 
        }
    }
});

