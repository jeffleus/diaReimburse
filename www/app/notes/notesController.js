angular.module('starter.controllers')

.controller('NotesCtrl', function($scope, $ionicModal, $cordovaDatePicker
                                   , TripSvc, NotesSvc, Note) {
    $scope.tripSvc = TripSvc;
    $scope.noteSvc = NotesSvc;

    $scope.addNote = _loadNotesModal;
    $scope.closeModal = _closeModal;
    $scope.editNote = _editNote;
    $scope.addNote = _addNote;
    $scope.deleteNote = _deleteNote;

    $scope.newNote = null;

    function _addNote() {
        var n = new Note();
        TripSvc.currentTrip.addNote(n);
        _editNote(n);
    }
    
    function _editNote(n) {
        $scope.newNote = n;
        _loadNotesModal();
    }
    
    function _deleteNote(n) {
        TripSvc.currentTrip.deleteNote(n);
        TripSvc.pause();
    }
    
    function _closeModal() {
        $scope.modal.hide();
        TripSvc.pause();
    }
    
	function _loadNotesModal() {
		$ionicModal.fromTemplateUrl('app/notes/notesModal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
			modal.show();
		});
	}
});