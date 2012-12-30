
(function Component (id) {// @lock

// Add the code that needs to be shared between components here

function constructor (id) {

	// @region beginComponentDeclaration// @startlock
	var $comp = this;
	this.name = 'emailBallotToFriends';
	// @endregion// @endlock

//	var emailMyBallot = function emailMyBallot() {
//		var msg = { type: 'send', data: {} };
//			
//		msg.data.msgFrom = $$(getHtmlId('textEmailFrom')).getValue();
//		msg.data.msgTo = $$(getHtmlId('textEmailTo')).getValue();
//		msg.data.msgSubject = $$(getHtmlId('textEmailSubject')).getValue();
//		msg.data.msgBody = $$(getHtmlId('textEmailBody')).getValue();
//		
//		var theWorker = new SharedWorker('../Workers/sendEmailWorker.js', 'SendEmail');
//		var thePort = theWorker.port;
//		
//		thePort.onmessage = function(event) {
//			var msg = event.data
//			switch(msg.status) {
//				case 'error':
//					debugger;
//					break;
//				case 'fail':
//					break;
//				case 'success':
//		            var r = msg.result;
//					break;
//			}
//		}
//		thePort.postMessage(msg);
//	}
	
	var emailMyBallot = function emailMyBallot() {		
		var msg = { type: 'send', personID: sources.currentPerson.ID, separate: true, data: {} };
			
		msg.data.msgFrom = $$(getHtmlId('textEmailFrom')).getValue();
		msg.data.msgTo = $$(getHtmlId('textEmailTo')).getValue();
		msg.data.msgSubject = $$(getHtmlId('textEmailSubject')).getValue();
		msg.data.msgBody = $$(getHtmlId('textEmailBody')).getValue();
		
		spFunctions.sendEmailAsync({
			onSuccess: function(response) {
				var good = 0;
				var bad = 0;
				for (var i = 0; i < response.length; i++) {
					if (response[i])
						good++;
					else
						bad++;
				}
			},
			params: [ msg, true ]	
		});
	}

	this.loadEmailInfo = function loadEmailInfo() {
		$$(getHtmlId('textEmailSubject')).setValue('StrawPoll™ Recommendations!');
		
		var body = 'Hello! I thought you would like to know who I think you should vote for!\n\nMY VOTES:\n\n';

		var eQuery0 = 'votes.person.ID = "' + sources.currentPerson.ID + '"';
		$comp.sources.campaign.query(eQuery0, {
			onSuccess: function(event) {
				event.dataSource.toArray('districtType, districtName, candidateName, candidateParty, incumbent', {
					onSuccess: function(event) {
						var c = event.result;
						for (var i = 0; i < c.length; i++)
							body = body + c[i].districtType.trim() + ' (' + c[i].districtName.trim() + '): ' + c[i].candidateName.trim() + ' (' + c[i].candidateParty.trim() + ')' + (c[i].incumbent?' [I]':'') + '\n' ;
						$$(getHtmlId('textEmailBody')).setValue(body);
					}
				});
			}
		});
	}

	this.load = function (data) {// @lock

	// @region namespaceDeclaration// @startlock
	var buttonLoad = {};	// @button
	var buttonToFind = {};	// @button
	var buttonClear = {};	// @button
	var buttonSendEmail = {};	// @button
	// @endregion// @endlock

	// eventHandlers// @lock

	buttonLoad.click = function buttonLoad_click (event)// @startlock
	{// @endlock
		$comp.loadEmailInfo();
	};// @lock

	buttonToFind.click = function buttonToFind_click (event)// @startlock
	{// @endlock
		var t = $$(getHtmlId('textEmailToQuery')).getValue();
		if (c == '')
			var q = 'person.ID = ' + sources.currentPerson.ID;
		else {
			t = '*' + t + '*';
			var q = 'person.ID = ' + sources.currentPerson.ID + ' AND to = "*' + t + '*"';
		}
		
		$comp.sources.email.query(q, {
			onSuccess: function(event) {
					return;
				},
			onError: function(error) {
					alert(error.message);
				}
		});

	};// @lock

	buttonClear.click = function buttonClear_click (event)// @startlock
	{// @endlock
		$$(getHtmlId('textEmailTo')).setValue('');
		$$(getHtmlId('textEmailFrom')).setValue('');
		$$(getHtmlId('textEmailSubject')).setValue('');
		$$(getHtmlId('textEmailBody')).setValue('');
	};// @lock

	buttonSendEmail.click = function buttonSendEmail_click (event)// @startlock
	{// @endlock
		emailMyBallot();
	};// @lock

	// @region eventManager// @startlock
	WAF.addListener(this.id + "_buttonLoad", "click", buttonLoad.click, "WAF");
	WAF.addListener(this.id + "_buttonToFind", "click", buttonToFind.click, "WAF");
	WAF.addListener(this.id + "_buttonClear", "click", buttonClear.click, "WAF");
	WAF.addListener(this.id + "_buttonSendEmail", "click", buttonSendEmail.click, "WAF");
	// @endregion// @endlock

	};// @lock

	this.loaded = true;

}// @startlock
return constructor;
})();// @endlock
