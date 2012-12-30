
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
	var textZip = {};	// @textField
	var textState = {};	// @textField
	var textCity = {};	// @textField
	var textAddress2 = {};	// @textField
	var textAddress1 = {};	// @textField
// @endregion// @endlock

// @region global declarations
	var containers = ['containerWelcome','containerAddress','containerSettings','containerElectionMain','containerStatewide','containerLocal','containerMyBallot','containerIR','containerHorseRace', 'homeButton', 'containerElection','containerTotals','containerEmail','containerEmailHistory'];
	var stack = [];
	var containerMargin = 2;
	var homeLeft = 280;
	var homeTop = 6;
	var bpWindow = null;
	var msgAddressVerified = 'Address verified - click button to start';
	var msgAddressUnverified = 'This address has not been verified';
	var msgAddressInvalid = 'This address is not valid';
	var msgVerifyingAddress = 'Verifying address - please wait...';

//	String.prototype.toTitleCase = function(s) {return s.replace(/\b([a-z])/g, function (_, i) { return i.toUpperCase();}); }
	  
  	function toTitleCase(s) {
		return s.replace(/\b([a-z])/g, 
			function (_, i) {
  				return i.toUpperCase();
  			});
	}

// @endregion

// @region general functions

	function slideLeft(newPage) {
		stack.push(newPage);
		$('#' + newPage).addClass('spStack' + stack.length);
		$$(newPage).show();
		$('#' + stack[stack.length-2]).hide('slide', {direction: 'left'}, function() {
				$$('homeButton').show();
			});
	}

	function slideRight() {
		$('#' + stack[stack.length-2]).show('slide', {direction: 'left'}, function() {
				$$(stack[stack.length-1]).hide();
				$('#' + stack[stack.length-1]).removeClass('spStack' + stack.length);
				stack.pop();
				if (stack.length == 1)
					$$('homeButton').hide();
				else
					$$('homeButton').show();
			});
	}

	function numberToWord(num) {
		switch (num) {
			case 1:
				return 'one';
				break;
			case 2:
				return 'two';
				break;
			case 3:
				return 'three';
				break;
			case 4:
				return 'four';
				break;
			case 5:
				return 'five';
				break;
			case 6:
				return 'six';
				break;
			case 7:
				return 'seven';
				break;
			case 8:
				return 'eight';
				break;
			case 9:
				return 'nine';
				break;
			default:
				return 'Error!';
		}
	}

	function buildElection(year, type) {
		spFunctions.loadElectionInfoAsync({
			onSuccess: function(response) {
				var c = response.candidates;
				var b = $$('containerBallot');
				var w = b.getChildren();
				for (var i = 0; i < w.length; i++) {
					if (w[i].kind == 'checkbox') {
						var cb = w[i];
						var indx = w[i].id.split('_')[1]
						var icon = $$('iconBP_' + indx);
						if (c !== undefined && indx < c.length) {
							cb.getLabel().setValue(c[indx].candidateName + ' (' + c[indx].candidateParty + ')' + ((c[indx].incumbent)?' [I]':''));
							cb.candidateID = c[indx].ID;
							cb.setValue(c[indx].selected);
							icon.bpURL = c[indx].url;
							cb.show();
							icon.show();
						}
						else {
							cb.getLabel().setValue('');
							cb.candidateID = null;
							cb.uncheck();
							icon.bpURL = '';
							cb.hide();
							icon.hide();
						}
					}
				}
				$$('titleElection').setValue(response.election.name);
				if (response.election.numberOfReps == 0)
					$$('textSelectNum').setValue('Election info not found');
				else
					$$('textSelectNum').setValue('Select ' + numberToWord(response.election.numberOfReps) + ':');
				b.election = response.election;
				b.show();
				slideLeft('containerElection');
			},
			onError: function(error) {
				var b = $$('containerBallot');
				var w = b.getChildren();
				for (var i = 0; i < w.length; i++) {
					if (w[i].kind == 'checkbox') {
						var indx = w[i].id.split('_')[1]
						var cb = $$('checkbox_' + indx);
						var icon = $$('iconBP_' + indx);
						cb.getLabel().setValue('');
						cb.candidateID = null;
						icon.bpURL = '';
						cb.hide();
						icon.hide();
					}
				}
				$$('titleElection').setValue(type);
				$$('textSelectNum').setValue('Election info not found');
				$$('containerBallot').show();
				b.numberOfReps = null;
				b.election = null;
				slideLeft('containerElection');
			},
			params: [ currentPerson.ID, year, type, false ]
		});
	}
	
	function setElectionButtonStatus(enable) {
		if (enable)
			$$('containerElectionMain').enable();
		else {
			$$('containerElectionMain').disable();
			$$('buttonBack_main').enable();
		}
	}
	
	function getBPPage(icon) {
		var strWindowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
		var a = icon.id.split('_');
		var name = $$('checkbox_' + a[1]).getLabel().getValue();
		if (icon.bpURL != '')
			if (bpWindow == null)
				bpWindow = window.open(icon.bpURL, name, strWindowFeatures);
			else {
				bpWindow.location = name;
				bpWindow.focus();
			}
	}
	
	function processCheckboxClick(cb) {
		if (cb.getValue()) {
			var maxChecks = $$('containerBallot').election.numberOfReps;
			for (var i = 0; i < 10; i++) {
				var c = $$('checkbox_' + i);
				if (c != cb && c.getValue())
					if (maxChecks > 1)
						maxChecks--;
					else
						c.uncheck();
			}
		}
	}
	
	function updateVotes(goToTotals) {
		var b = $$('containerBallot');
		var w = b.getChildren();
		var r = [];
		
		for (var i = 0; i < w.length; i++) {
			if (w[i].kind == 'checkbox' && w[i].isVisible()) {
				r.push({
					candidateID: w[i].candidateID,
					selected: w[i].getValue()
				});
			}
		}
		
		spFunctions.updateVoteInfoAsync({
			onSuccess: function(response) {
				if (goToTotals) {
					source.election.query('ID = :1', {
						onSuccess: function(event) {
							slideLeft('containerTotals');
						},
						autoExpand: 'campaigns',
						params: [b.election.ID]
					});
				}
			},
			onError: function(error) {
				alert(error.message);
			},
			params: [ currentPerson.ID, r, false ]	
		});
	}
	
	
	function shareMyBallot() {
		alert('Not yet implemented');
	}
	
	function emailMyBallot() {		
		var from = $$('textEmailFrom').getValue();
		var to = $$('textEmailTo').getValue();
		var subject = $$('textEmailSubject').getValue();
		var body = $$('textEmailBody').getValue();
		var separate = $$('checkboxMailSendSeparate').getValue();
		
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
				$$('textEmailResult').setValue('Finished: ' + good + ' sent, ' + bad + ' fail');
			},
			onError: function(error) {
				$$('textEmailResult').setValue('Email attempt failed!');
			},
			params: [ currentPerson.ID, from, to, subject, body, separate, true ]	
		});
	}
	
	function printMyBallot() {
		alert('Not yet implemented');
	}
	
	function verifyAddress() {
		$$('textVerified').setValue(msgVerifyingAddress);
		$$('textVerified').setTextColor('blue');
		$$('buttonVerify').disable();
		spFunctions.getZip9andPersonRecordAsync({
			onSuccess: function(response) {
				if (response) {
					currentPerson = response.person;
					if (response.zip9 == 'none' || response.USPS.length == 0) {
						currentPerson = null;
						invalidAddress();
					}
					else {
						$$('textZip').setValue(response.zip9);
						$$('textUSPSAddress1').setValue(response.USPS[0]);
						$$('textUSPSAddress2').setValue(response.USPS[1]);
						$$('textVerified').setValue(msgAddressVerified);
						$$('textVerified').setTextColor('green');
						$$('buttonVote').enable();
						$$('buttonVoteHistory').enable();
						$$('buttonVerify').disable();
					}
				}
				else {
					currentPerson = null;
					unverifyAddress();
				}
			},
			onError: function(error) {
				currentPerson = null;
				unverifyAddress();
				$$('textVerified').setValue(error);
			},
			params: [ personAddress1, personAddress2, personCity, personState, personZip, false ]
		});
	}
	
	function unverifyAddress() {
		$$('textUSPSAddress1').setValue('');
		$$('textUSPSAddress2').setValue('');
		$$('textVerified').setValue(msgAddressUnverified);
		$$('textVerified').setTextColor('blue');
		$$('buttonVote').disable();
		$$('buttonVoteHistory').disable();
		$$('buttonVerify').enable();
	}
	
	function invalidAddress() {
		$$('textUSPSAddress1').setValue('');
		$$('textUSPSAddress2').setValue('');
		$$('textVerified').setValue(msgAddressInvalid);
		$$('textVerified').setTextColor('red');
		$$('buttonVote').disable();
		$$('buttonVoteHistory').disable();
		$$('buttonVerify').enable();
	}
	
	function setupHorseRaceInfo(slide) {
		var s = personState;
		var eQuery1 = '';
		var eQuery2 = '';

		if ($$('checkboxFederal').getValue())
			var eQuery1 = 'districtName = POTUS OR districtName = US-' + s + '-* OR districtName = ' + s + '-CD-*';

		if ($$('checkboxState').getValue())
			var eQuery2 = 'districtName = ' + s + '-SD-* OR districtName = ' + s + '-HD-*';
		
		if (eQuery1 == '')
			if (eQuery2 == '')
				eQuery0 = 'ID = null';
			else
				eQuery0 = 'year = 2012 AND (' + eQuery2 + ')';
		else
			if (eQuery2 == '')
				eQuery0 = 'year = 2012 AND (' + eQuery1 + ')';
			else
				eQuery0 = 'year = 2012 AND (' + eQuery1 + ' OR ' + eQuery2 + ')';
		
		source.election.query(eQuery0, {
			onSuccess: function(result) {
					if (slide)
						slideLeft('containerHorseRace');
				}
		});
	}
	
// @endregion


// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		aScreens.push( { name: 'Address', suffix: 'Address', action: {} } );
		aScreens.push( { name: 'Election', suffix: 'Election', action: {} } );
		aScreens.push( { name: 'My Ballot', suffix: 'MyBallot', action: {} } );
		aScreens.push( { name: 'Horse Race', suffix: 'HorseRace', action: {} } );
		aScreens.push( { name: 'Facebook', suffix: 'Facebook', action: {} } );
		aScreens.push( { name: 'Email', suffix: 'Email', action: {} } );
		sources.aScreens.sync();
	};// @lock

	textZip.change = function textZip_change (event)// @startlock
	{// @endlock
		unverifyAddress();
	};// @lock

	textState.change = function textState_change (event)// @startlock
	{// @endlock
		personState = personState.substr(0,2).toUpperCase();
		source.personState.sync();
		unverifyAddress();
	};// @lock

	textCity.change = function textCity_change (event)// @startlock
	{// @endlock
		personCity = toTitleCase(personCity);
		source.personCity.sync();
		unverifyAddress();
	};// @lock

	textAddress2.change = function textAddress2_change (event)// @startlock
	{// @endlock
		personAddress2 = toTitleCase(personAddress2);
		source.personAddress2.sync();
		unverifyAddress();
	};// @lock

	textAddress1.change = function textAddress1_change (event)// @startlock
	{// @endlock
		personAddress1 = toTitleCase(personAddress1);
		source.personAddress1.sync();
		unverifyAddress();
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("textZip", "change", textZip.change, "WAF");
	WAF.addListener("textState", "change", textState.change, "WAF");
	WAF.addListener("textCity", "change", textCity.change, "WAF");
	WAF.addListener("textAddress2", "change", textAddress2.change, "WAF");
	WAF.addListener("textAddress1", "change", textAddress1.change, "WAF");
// @endregion
};// @endlock
