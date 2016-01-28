angular.module('starter.services')

.service('NotesSvc', function() {
    var self = this;
    self.currentReceipt = [];
})

.factory('Note', function() {
    var Note = function() {
        this.noteDate = new Date();
            this.noteDate.setHours(12,0,0,0);
        this.notes = "";
    }

    return Note;
});