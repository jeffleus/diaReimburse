angular.module('starter.services')

.service('EmailSvc', function($cordovaEmailComposer) {
    var self = this;    
    self.sendEmail = _sendEmail;    
    
    function _sendEmail(t, file) {
		$cordovaEmailComposer.isAvailable().then(function() {
            var subj = t.title;
            subj += ": " + moment(t.startDate).format("M-D-YY");
            subj += (t.endDate)?" - " + moment(t.endDate).format("M-D-YY"):"";

            var b = 'Attached is a report template for testing email delivery of reimbursement reports.  The details of teh trip are provided in a tabular pdf file.  All supporting receipt documentation is missing for now with the next step to add them as attachments.\n\n';
            b += "Purpose: " + t.purpose;
            
            var email = {
                to: 'expensereport@athletics.ucla.edu', 
				cc: 'akitagawa@athletics.ucla.edu',
				subject: subj,
				body: b, 
				attachments: [ file ]
			};

			return $cordovaEmailComposer.open(email).catch(function(error) {
				// user cancelled email
				console.log('user canceled the email send');
			});

		}).catch(function (error) {
		   // not available
			console.log('trouble with the email composer availability.');
		});
	}
});
