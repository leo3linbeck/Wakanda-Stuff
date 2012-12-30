
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var buttonBack_print = {};	// @button
	var buttonFBShareNow = {};	// @button
	var checkboxFBShareWithFriends = {};	// @checkbox
	var checkboxFBPostOnWall = {};	// @checkbox
	var iconCloseLoginDialog = {};	// @icon
	var buttonBack_share = {};	// @button
	var buttonBack_BPInfo = {};	// @button
	var buttonLogin = {};	// @button
	var dataGridSelectElection = {};	// @dataGrid
	var buttonVoteHistory = {};	// @button
	var checkboxLocal = {};	// @checkbox
	var checkboxState = {};	// @checkbox
	var checkboxFederal = {};	// @checkbox
	var textState = {};	// @textField
	var textZip = {};	// @textField
	var textCity = {};	// @textField
	var textAddress2 = {};	// @textField
	var textAddress1 = {};	// @textField
	var iconSettings = {};	// @icon
	var buttonBack_settings = {};	// @button
	var buttonVerify = {};	// @button
	var buttonEmailHistory = {};	// @button
	var buttonBack_emailHistory = {};	// @button
	var buttonShare = {};	// @button
	var buttonBack_myBallot = {};	// @button
	var buttonPrint = {};	// @button
	var buttonEmail = {};	// @button
	var buttonEmailSend = {};	// @button
	var buttonEmailClear = {};	// @button
	var buttonBack_email = {};	// @button
	var buttonHorseRace = {};	// @button
	var checkbox_9 = {};	// @checkbox
	var checkbox_8 = {};	// @checkbox
	var checkbox_7 = {};	// @checkbox
	var checkbox_6 = {};	// @checkbox
	var checkbox_5 = {};	// @checkbox
	var checkbox_4 = {};	// @checkbox
	var checkbox_3 = {};	// @checkbox
	var checkbox_2 = {};	// @checkbox
	var checkbox_1 = {};	// @checkbox
	var checkbox_0 = {};	// @checkbox
	var buttonBack_totals = {};	// @button
	var buttonShowMyBallot = {};	// @button
	var buttonTotals = {};	// @button
	var iconBP_9 = {};	// @icon
	var iconBP_8 = {};	// @icon
	var iconBP_7 = {};	// @icon
	var iconBP_6 = {};	// @icon
	var iconBP_5 = {};	// @icon
	var iconBP_4 = {};	// @icon
	var iconBP_3 = {};	// @icon
	var iconBP_2 = {};	// @icon
	var iconBP_1 = {};	// @icon
	var iconBP_0 = {};	// @icon
	var buttonSaveBallot = {};	// @button
	var buttonBack_horseRace = {};	// @button
	var buttonClearBallot = {};	// @button
	var buttonBack_election = {};	// @button
	var homeButton = {};	// @buttonImage
	var buttonBack_main = {};	// @button
	var buttonVote = {};	// @button
	var buttonStart = {};	// @button
	var documentEvent = {};	// @document
// @endregion// @endlock

// @region global declarations
	var containers = ['containerWelcome','containerAddress','containerSettings','containerElectionMain','containerBPInfo','containerMyBallot','containerPrint','containerHorseRace', 'homeButton', 'containerElection','containerShare','containerTotals','containerEmail','containerEmailHistory'];
	var containerMargin = 2;
	var homeLeft = 280;
	var homeTop = 6;
	var bpWindow = null;
// @endregion

// @region general functions

	function buildElection(year, type) {
		console.log('building election');
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
					$$('textSelectNum').setValue('Select ' + L3.numberToWord(response.election.numberOfReps) + ':');
				b.election = response.election;
				b.show();
				L3.slideLeftStack('containerElection');
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
				L3.slideLeftStack('containerElection');
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
		$$('frameBPInfo').setValue(icon.bpURL);
		L3.slideLeftStack('containerBPInfo');
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
							L3.slideLeftStack('containerTotals');
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
		spFunctions.getFacebookFriendsAsync({
			onSuccess: function(response) {
				friends = response.friends;
				sources.friends.sync();
				L3.slideLeftStack('containerShare');
			},
			onError: function(error) {
				alert(error.message);
			},
			params: [ currentPerson, false ]	
		});
	}
	
	function emailMyBallot() {
		var msg = { type: 'send', personID: currentPerson.ID, separate: $$('checkboxMailSendSeparate').getValue(), data: {} };
			
		msg.data.msgFrom = $$('textEmailFrom').getValue();
		msg.data.msgTo = $$('textEmailTo').getValue();
		msg.data.msgSubject = $$('textEmailSubject').getValue();
		msg.data.msgBody = $$('textEmailBody').getValue();
		
		spFunctions.sendEmailAsync({
			onSuccess: function(response) {
				var good = 0;
				var bad = 0;
				for (var i = 0; i < response.result.length; i++) {
					if (response.result[i])
						good++;
					else
						bad++;
				}
				$$('textEmailResult').setValue('Finished: ' + good + ' sent, ' + bad + ' fail');
			},
			onError: function(error) {
				$$('textEmailResult').setValue('Email attempt failed!');
			},
			params: [ msg, false ]	
		});
	}
	
	function printMyBallot() {
		spFunctions.generatePDFAsync({
			onSuccess: function(response) {
				$$('framePDF').setValue(response.url);
				L3.slideLeftStack('containerPrint');
			},
			onError: function(error) {
				alert(error.message);
			},
			params: [ currentPerson, false ]	
		});
	}
	
	function verifyAddress() {
		$$('textVerified').setValue(L3.msgVerifyingAddress);
		$$('textVerified').setTextColor('blue');
		$$('buttonVerify').disable();
		spFunctions.getZip9andPersonRecordAsync({
			onSuccess: function(response) {
				if (response) {
					currentPerson = response.person;
					if (response.zip9 == 'none' || response.USPS.length == 0) {
						currentPerson = { ID : null };
						invalidAddress();
					}
					else {
						$$('textZip').setValue(response.zip9);
						$$('textUSPSAddress1').setValue(response.USPS[0]);
						$$('textUSPSAddress2').setValue(response.USPS[1]);
						$$('textVerified').setValue(L3.msgAddressVerified);
						$$('textVerified').setTextColor('green');
						$$('buttonVote').enable();
						$$('buttonVoteHistory').enable();
						$$('buttonVerify').disable();
					}
				}
				else {
					currentPerson = { ID : null };
					unverifyAddress();
				}
			},
			onError: function(error) {
				currentPerson = { ID : null };
				unverifyAddress();
				$$('textVerified').setValue(error);
			},
			params: [ currentPerson.ID, personAddress1, personAddress2, personCity, personState, personZip, false ]
		});
	}
	
	function unverifyAddress() {
		$$('textUSPSAddress1').setValue('');
		$$('textUSPSAddress2').setValue('');
		$$('textVerified').setValue(L3.msgAddressUnverified);
		$$('textVerified').setTextColor('blue');
		$$('buttonVote').disable();
		$$('buttonVoteHistory').disable();
		$$('buttonVerify').enable();
	}
	
	function invalidAddress() {
		$$('textUSPSAddress1').setValue('');
		$$('textUSPSAddress2').setValue('');
		$$('textVerified').setValue(L3.msgAddressInvalid);
		$$('textVerified').setTextColor('red');
		$$('buttonVote').disable();
		$$('buttonVoteHistory').disable();
		$$('buttonVerify').enable();
	}
	
	function setupHorseRaceInfo(slide) {
		var s = personState;
		var eQuery0 = '';
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
				eQuery0 = 'year = 2012 AND (' + eQuery1 + ') order by sortLevel';
			else
				eQuery0 = 'year = 2012 AND (' + eQuery1 + ' OR ' + eQuery2 + ') order by sortLevel';
		
		source.election.query(eQuery0, {
			onSuccess: function(event) {
					if (slide)
						L3.slideLeftStack('containerHorseRace');
				}
		});
	}
	
	function selectCurrentPersonElection(slideLeft) {
		var s = currentPerson.stateAbbreviation;
		var cd = currentPerson.houseDistrictName;
		var sd = currentPerson.stateUpperDistrictName;
		var hd = currentPerson.stateLowerDistrictName;
		var y = currentElectionYear;
		var eQuery0 = 'year = ' + y + ' AND (districtName = POTUS OR districtName = "US-' + s + '-1" OR districtName = "' + cd + '" OR districtName = "' + sd + '" OR districtName = "' + hd + '") order by sortLevel';

		sources.election.query(eQuery0, {
			onSuccess: function(event) {
					if (slideLeft)
						L3.slideLeftStack('containerElectionMain');
					else
						L3.slideRightStack();
				}
		});
	}
	
	function getVoterHistory() {
		spFunctions.nationBuilderAuthorizeAsync({
			onSuccess: function(response) {
				alert(JSON.stringify(response));
			},
			onError: function(error) {
				alert(error.message);
			},
			params: [ false ]
		});
	}
	
	function shareWithFriends() {
		var postOnWall = $$('checkboxFBPostOnWall').getValue();
		var shareWithFriends = $$('checkboxFBShareWithFriends').getValue();
		
		var f = [];
		if (shareWithFriends) {
			var rows = $$('dataGridFBFriends').getSelectedRows();
			for (var i = 0; i < rows.length; i++)
				f.push(friends[rows[i]]);
		}
		
		spFunctions.shareWithFriendsAsync({
			onSuccess: function(response) {
				alert(JSON.stringify(response));
			},
			onError: function(error) {
				alert(error.message);
			},
			params: [ currentPerson, postOnWall, shareWithFriends, f, false ]
		});
	}
	
// @endregion

// eventHandlers// @lock

	buttonBack_print.click = function buttonBack_print_click (event)// @startlock
	{// @endlock
		L3.slideRightStack();
	};// @lock

	buttonFBShareNow.click = function buttonFBShareNow_click (event)// @startlock
	{// @endlock
		shareWithFriends();
	};// @lock

	checkboxFBShareWithFriends.click = function checkboxFBShareWithFriends_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	checkboxFBPostOnWall.click = function checkboxFBPostOnWall_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	iconCloseLoginDialog.click = function iconCloseLoginDialog_click (event)// @startlock
	{// @endlock
		$$('dialogLogin').hide();
	};// @lock

	buttonBack_share.click = function buttonBack_share_click (event)// @startlock
	{// @endlock
		L3.slideRightStack();
	};// @lock

	buttonBack_BPInfo.click = function buttonBack_BPInfo_click (event)// @startlock
	{// @endlock
		L3.slideRightStack();
	};// @lock

	buttonLogin.click = function buttonLogin_click (event)// @startlock
	{// @endlock
		unverifyAddress();
		if (currentPerson.ID)
			janrain.engage.signin.widget.refresh();
		$$('dialogLogin').show();
	};// @lock

	dataGridSelectElection.onRowClick = function dataGridSelectElection_onRowClick (event)// @startlock
	{// @endlock
		buildElection(currentElectionYear, sources.election.districtType);
	};// @lock

	buttonVoteHistory.click = function buttonVoteHistory_click (event)// @startlock
	{// @endlock
		getVoterHistory();
	};// @lock

// @region back button clicks

	buttonBack_emailHistory.click = function buttonBack_emailHistory_click (event)// @startlock
	{// @endlock
		L3.slideRightStack();
	};// @lock

	buttonBack_myBallot.click = function buttonBack_myBallot_click (event)// @startlock
	{// @endlock
		selectCurrentPersonElection(false);
	};// @lock

	buttonBack_email.click = function buttonBack_email_click (event)// @startlock
	{// @endlock
		$$('textEmailResult').setValue('');
		L3.slideRightStack();
	};// @lock

	buttonBack_settings.click = function buttonBack_settings_click (event)// @startlock
	{// @endlock
		L3.slideRightStack();
	};// @lock

	buttonBack_totals.click = function buttonBack_totals_click (event)// @startlock
	{// @endlock
		selectCurrentPersonElection(false);
	};// @lock

	buttonBack_horseRace.click = function buttonBack_horseRace_click (event)// @startlock
	{// @endlock
		selectCurrentPersonElection(false);
	};// @lock

	buttonBack_election.click = function buttonBack_election_click (event)// @startlock
	{// @endlock
		updateVotes(false);
		L3.slideRightStack();
	};// @lock

	buttonBack_main.click = function buttonBack_main_click (event)// @startlock
	{// @endlock
		L3.slideRightStack();
	};// @lock

// @endregion

// @region federal election button clicks

// @endregion

// @region Email and EmailHistory button clicks

	buttonEmailHistory.click = function buttonEmailHistory_click (event)// @startlock
	{// @endlock
		source.email.query('person.ID = :1', {
			onSuccess: function(result) {
				L3.slideLeftStack('containerEmailHistory');
			},
			params: [currentPerson.ID]
		});
	};// @lock

	buttonEmailSend.click = function buttonEmailSend_click (event)// @startlock
	{// @endlock
		emailMyBallot();
	};// @lock

	buttonEmailClear.click = function buttonEmailClear_click (event)// @startlock
	{// @endlock
		$$('textEmailTo').setValue('');
		$$('textEmailFrom').setValue('');
		$$('textEmailSubject').setValue('');
		$$('textEmailBody').setValue('');
	};// @lock

	buttonEmail.click = function buttonEmail_click (event)// @startlock
	{// @endlock
		$$('textEmailTo').setValue('');
		$$('textEmailFrom').setValue('');
		$$('textEmailSubject').setValue('StrawPoll™ Recommendations!');
		
		var body = 'Hello! I thought you would like to know who I think you should vote for!\n\nMY VOTES:\n\n';
		source.campaign.toArray('districtType, districtName, candidateName, candidateParty, incumbent', {
			onSuccess: function(event) {
				var c = event.result;
				for (var i = 0; i < c.length; i++)
					body = body + c[i].districtType.trim() + ' (' + c[i].districtName.trim() + '): ' + c[i].candidateName.trim() + ' (' + c[i].candidateParty.trim() + ')' + (c[i].incumbent?' [I]':'') + '\n' ;
				$$('textEmailBody').setValue(body);
				L3.slideLeftStack('containerEmail');
			}
		});
	};// @lock

// @endregion

// @region HorseRace button clicks

	checkboxLocal.change = function checkboxLocal_change (event)// @startlock
	{// @endlock
		setupHorseRaceInfo(false);
	};// @lock

	checkboxState.change = function checkboxState_change (event)// @startlock
	{// @endlock
		setupHorseRaceInfo(false);
	};// @lock

	checkboxFederal.change = function checkboxFederal_change (event)// @startlock
	{// @endlock
		setupHorseRaceInfo(false);
	};// @lock

	buttonHorseRace.click = function buttonHorseRace_click (event)// @startlock
	{// @endlock
		setupHorseRaceInfo(true);
	};// @lock

// @endregion

// @region MyBallot button clicks

	buttonShare.click = function buttonShare_click (event)// @startlock
	{// @endlock
		shareMyBallot();
	};// @lock

	buttonPrint.click = function buttonPrint_click (event)// @startlock
	{// @endlock
		printMyBallot();
	};// @lock

	buttonShowMyBallot.click = function buttonShowMyBallot_click (event)// @startlock
	{// @endlock
		source.campaign.query('votes.person.ID = :1 order by sortLevel', currentPerson.ID);
		source.ballotMeasure.query('votes.person.ID = :1 order by title', currentPerson.ID);
		L3.slideLeftStack('containerMyBallot');
	};// @lock

// @endregion

// @region ElectionMain button clicks

	checkbox_9.click = function checkbox_9_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	checkbox_8.click = function checkbox_8_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	checkbox_7.click = function checkbox_7_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	checkbox_6.click = function checkbox_6_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	checkbox_5.click = function checkbox_5_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	checkbox_4.click = function checkbox_4_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	checkbox_3.click = function checkbox_3_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	checkbox_2.click = function checkbox_2_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	checkbox_1.click = function checkbox_1_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	checkbox_0.click = function checkbox_0_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	iconBP_9.click = function iconBP_9_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock

	iconBP_8.click = function iconBP_8_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock

	iconBP_7.click = function iconBP_7_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock

	iconBP_6.click = function iconBP_6_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock

	iconBP_5.click = function iconBP_5_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock

	iconBP_4.click = function iconBP_4_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock

	iconBP_3.click = function iconBP_3_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock

	iconBP_2.click = function iconBP_2_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock

	iconBP_1.click = function iconBP_1_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock

	iconBP_0.click = function iconBP_0_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock
    
	buttonTotals.click = function buttonTotals_click (event)// @startlock
	{// @endlock
		updateVotes(true);
	};// @lock

	buttonClearBallot.click = function buttonClearBallot_click (event)// @startlock
	{// @endlock
		var cb = $$('containerBallot').getChildren();
		for (var i = 0; i < cb.length; i++)
			if (cb[i].kind == 'checkbox')
				cb[i].uncheck();
	};// @lock

	buttonSaveBallot.click = function buttonSaveBallot_click (event)// @startlock
	{// @endlock
		updateVotes(false);
	};// @lock

// @endregion

// @region Address button clicks

	buttonVerify.click = function buttonVerify_click (event)// @startlock
	{// @endlock
		verifyAddress();
	};// @lock

	textState.change = function textState_change (event)// @startlock
	{// @endlock
		personState = this.getValue().substr(0,2).toUpperCase();
		source.personState.sync();
		unverifyAddress();
	};// @lock

	textZip.change = function textZip_change (event)// @startlock
	{// @endlock
		unverifyAddress();
	};// @lock

	textCity.change = function textCity_change (event)// @startlock
	{// @endlock
		personCity = L3.toTitleCase(this.getValue());
		source.personCity.sync();
		unverifyAddress();
	};// @lock

	textAddress2.change = function textAddress2_change (event)// @startlock
	{// @endlock
		personAddress2 = L3.toTitleCase(this.getValue());
		source.personAddress2.sync();
		unverifyAddress();
	};// @lock

	textAddress1.change = function textAddress1_change (event)// @startlock
	{// @endlock
		personAddress1 = L3.toTitleCase(this.getValue());
		source.personAddress1.sync();
		unverifyAddress();
	};// @lock

	buttonVote.click = function buttonVote_click (event)// @startlock
	{// @endlock
		if ($$('textVerified').getValue() != L3.msgAddressVerified) {
			this.disable();
			currentPerson = { ID : null };
			return;
		}
		selectCurrentPersonElection(true);
	};// @lock

// @endregion

// @region Settings button clicks

	iconSettings.click = function iconSettings_click (event)// @startlock
	{// @endlock
		L3.slideLeftStack('containerSettings');
	};// @lock

// @endregion

// @region Start button clicks

	homeButton.click = function homeButton_click (event)// @startlock
	{// @endlock
		L3.homeButtonClick();
	};// @lock

	buttonStart.click = function buttonStart_click (event)// @startlock
	{// @endlock
		unverifyAddress();
		L3.slideLeftStack('containerAddress');
	};// @lock

// @endregion

// @region document events

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		L3.stack = ['containerWelcome'];
		
		for (var i = 1; i < containers.length; i++) {
			$$(containers[i]).hide();
			$$(containers[i]).move(containerMargin, containerMargin);
		}
		$$('containerBallot').hide();
		$$('homeButton').move(homeLeft,homeTop);
		$$('homeButton').hide();
		$$('textSP_username').move(38,14);
		$$('textSP_username').show();
		$$('dialogLogin').hide();		
		$$('dialogLogin').move(51,80);		
		
		personAddress1 = '';
		personAddress2 = '';
		personCity = '';
		personState = '';
		personZip = '';

		currentElectionYear = 2012;
		sources.currentElectionYear.sync();
		
		currentPerson = { ID : null };
			
		$('#textAddress1, #textAddress2, #textCity, #textState, #textZip').on('keyup', 
				function (e) {
					if (e.keyCode == 13)
					verifyAddress();
				});
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("buttonBack_print", "click", buttonBack_print.click, "WAF");
	WAF.addListener("buttonFBShareNow", "click", buttonFBShareNow.click, "WAF");
	WAF.addListener("checkboxFBShareWithFriends", "click", checkboxFBShareWithFriends.click, "WAF");
	WAF.addListener("checkboxFBPostOnWall", "click", checkboxFBPostOnWall.click, "WAF");
	WAF.addListener("iconCloseLoginDialog", "click", iconCloseLoginDialog.click, "WAF");
	WAF.addListener("buttonBack_share", "click", buttonBack_share.click, "WAF");
	WAF.addListener("buttonBack_BPInfo", "click", buttonBack_BPInfo.click, "WAF");
	WAF.addListener("buttonLogin", "click", buttonLogin.click, "WAF");
	WAF.addListener("dataGridSelectElection", "onRowClick", dataGridSelectElection.onRowClick, "WAF");
	WAF.addListener("buttonVoteHistory", "click", buttonVoteHistory.click, "WAF");
	WAF.addListener("checkboxLocal", "change", checkboxLocal.change, "WAF");
	WAF.addListener("checkboxState", "change", checkboxState.change, "WAF");
	WAF.addListener("checkboxFederal", "change", checkboxFederal.change, "WAF");
	WAF.addListener("textState", "change", textState.change, "WAF");
	WAF.addListener("textZip", "change", textZip.change, "WAF");
	WAF.addListener("textCity", "change", textCity.change, "WAF");
	WAF.addListener("textAddress2", "change", textAddress2.change, "WAF");
	WAF.addListener("textAddress1", "change", textAddress1.change, "WAF");
	WAF.addListener("iconSettings", "click", iconSettings.click, "WAF");
	WAF.addListener("buttonBack_settings", "click", buttonBack_settings.click, "WAF");
	WAF.addListener("buttonVerify", "click", buttonVerify.click, "WAF");
	WAF.addListener("buttonEmailHistory", "click", buttonEmailHistory.click, "WAF");
	WAF.addListener("buttonBack_emailHistory", "click", buttonBack_emailHistory.click, "WAF");
	WAF.addListener("buttonShare", "click", buttonShare.click, "WAF");
	WAF.addListener("buttonBack_myBallot", "click", buttonBack_myBallot.click, "WAF");
	WAF.addListener("buttonPrint", "click", buttonPrint.click, "WAF");
	WAF.addListener("buttonEmail", "click", buttonEmail.click, "WAF");
	WAF.addListener("buttonEmailSend", "click", buttonEmailSend.click, "WAF");
	WAF.addListener("buttonEmailClear", "click", buttonEmailClear.click, "WAF");
	WAF.addListener("buttonBack_email", "click", buttonBack_email.click, "WAF");
	WAF.addListener("buttonHorseRace", "click", buttonHorseRace.click, "WAF");
	WAF.addListener("checkbox_9", "click", checkbox_9.click, "WAF");
	WAF.addListener("checkbox_8", "click", checkbox_8.click, "WAF");
	WAF.addListener("checkbox_7", "click", checkbox_7.click, "WAF");
	WAF.addListener("checkbox_6", "click", checkbox_6.click, "WAF");
	WAF.addListener("checkbox_5", "click", checkbox_5.click, "WAF");
	WAF.addListener("checkbox_4", "click", checkbox_4.click, "WAF");
	WAF.addListener("checkbox_3", "click", checkbox_3.click, "WAF");
	WAF.addListener("checkbox_2", "click", checkbox_2.click, "WAF");
	WAF.addListener("checkbox_1", "click", checkbox_1.click, "WAF");
	WAF.addListener("checkbox_0", "click", checkbox_0.click, "WAF");
	WAF.addListener("buttonBack_totals", "click", buttonBack_totals.click, "WAF");
	WAF.addListener("buttonShowMyBallot", "click", buttonShowMyBallot.click, "WAF");
	WAF.addListener("buttonTotals", "click", buttonTotals.click, "WAF");
	WAF.addListener("iconBP_9", "click", iconBP_9.click, "WAF");
	WAF.addListener("iconBP_8", "click", iconBP_8.click, "WAF");
	WAF.addListener("iconBP_7", "click", iconBP_7.click, "WAF");
	WAF.addListener("iconBP_6", "click", iconBP_6.click, "WAF");
	WAF.addListener("iconBP_5", "click", iconBP_5.click, "WAF");
	WAF.addListener("iconBP_4", "click", iconBP_4.click, "WAF");
	WAF.addListener("iconBP_3", "click", iconBP_3.click, "WAF");
	WAF.addListener("iconBP_2", "click", iconBP_2.click, "WAF");
	WAF.addListener("iconBP_1", "click", iconBP_1.click, "WAF");
	WAF.addListener("iconBP_0", "click", iconBP_0.click, "WAF");
	WAF.addListener("buttonSaveBallot", "click", buttonSaveBallot.click, "WAF");
	WAF.addListener("buttonBack_horseRace", "click", buttonBack_horseRace.click, "WAF");
	WAF.addListener("buttonClearBallot", "click", buttonClearBallot.click, "WAF");
	WAF.addListener("buttonBack_election", "click", buttonBack_election.click, "WAF");
	WAF.addListener("homeButton", "click", homeButton.click, "WAF");
	WAF.addListener("buttonBack_main", "click", buttonBack_main.click, "WAF");
	WAF.addListener("buttonVote", "click", buttonVote.click, "WAF");
	WAF.addListener("buttonStart", "click", buttonStart.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock

(function() {
    if (typeof window.janrain !== 'object') window.janrain = {};
    if (typeof window.janrain.settings !== 'object') window.janrain.settings = {};
    
    /* _______________ can edit below this line _______________ */

    janrain.settings.tokenUrl = 'http://localhost:8081/janrainAuthenticate';
    janrain.settings.tokenAction='event';
    janrain.settings.type = 'embed';
    janrain.settings.appId = 'nlifpigokidoefcaahgg';
    janrain.settings.appUrl = 'https://strawpoll.rpxnow.com';
    janrain.settings.providers = [
	'facebook',
	'twitter',
	'google',
	'yahoo',
	'aol',
	'openid'];
    janrain.settings.providersPerPage = '6';
    janrain.settings.format = 'one column';
    janrain.settings.actionText = 'Sign in using';
    janrain.settings.showAttribution = false;
    janrain.settings.fontColor = '#666666';
    janrain.settings.fontFamily = 'lucida grande, Helvetica, Verdana, sans-serif';
    janrain.settings.backgroundColor = '#ffffff';
    janrain.settings.width = '200';
    janrain.settings.borderColor = '#C0C0C0';
    janrain.settings.borderRadius = '5';    
    janrain.settings.buttonBorderColor = '#CCCCCC';
    janrain.settings.buttonBorderRadius = '5';
    janrain.settings.buttonBackgroundStyle = 'gradient';
    janrain.settings.language = 'en';
    janrain.settings.linkClass = 'janrainEngage';
    
    /* _______________ can edit above this line _______________ */

    function isReady() { janrain.ready = true; };
    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", isReady, false);
    } else {
      window.attachEvent('onload', isReady);
    }

    var e = document.createElement('script');
    e.type = 'text/javascript';
    e.id = 'janrainAuthWidget';

    if (document.location.protocol === 'https:') {
      e.src = 'https://rpxnow.com/js/lib/strawpoll/engage.js';
    } else {
      e.src = 'http://widget-cdn.rpxnow.com/js/lib/strawpoll/engage.js';
    }

    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(e, s);
})();

(function() {
    if (typeof window.janrain !== 'object') window.janrain = {};
    if (typeof window.janrain.settings !== 'object') window.janrain.settings = {};
    if (typeof window.janrain.settings.share !== 'object') window.janrain.settings.share = {};
    if (typeof window.janrain.settings.packages !== 'object') janrain.settings.packages = [];
    janrain.settings.packages.push('share');

    /* _______________ can edit below this line _______________ */

	janrain.settings.share.custom = true;

//    janrain.settings.share.providers = ["email","facebook","twitter"];
//    janrain.settings.share.providersEmail = ["google"];
//    janrain.settings.share.modes = ["broadcast","contact"];
//    janrain.settings.share.attributionDisplay = false;
//    janrain.settings.share.embed = true;
//    janrain.settings.share.setMobile = true;
//    janrain.settings.share.message = "Share your votes";
//    janrain.settings.share.title = "Share";
//    janrain.settings.share.url = "";
//    janrain.settings.share.description = "";

//    // Modal Styles
//    janrain.settings.share.modalBackgroundColor = "#000000";
//    janrain.settings.share.modalBorderRadius = "5";
//    janrain.settings.share.modalOpacity = "0.5";
//    janrain.settings.share.modalWidth = "5";

//    // Body Styles
//    janrain.settings.share.bodyBackgroundColor = "#009DDC";
//    janrain.settings.share.bodyBackgroundColorOverride = false;
//    janrain.settings.share.bodyColor = "#333333";
//    janrain.settings.share.bodyContentBackgroundColor = "#ffffff";
//    janrain.settings.share.bodyFontFamily = "Helvetica";
//    janrain.settings.share.bodyTabBackgroundColor = "#f8f8f8";
//    janrain.settings.share.bodyTabColor = "#000000";

//    // Element Styles
//    janrain.settings.share.elementBackgroundColor = "#f6f6f6";
//    janrain.settings.share.elementBorderColor = "#cccccc";
//    janrain.settings.share.elementBorderRadius = "3";
//    janrain.settings.share.elementButtonBorderRadius = "6";
//    janrain.settings.share.elementButtonBoxShadow = "3";
//    janrain.settings.share.elementColor = "#cccccc";
//    janrain.settings.share.elementHoverBackgroundColor = "#eeeeee";
//    janrain.settings.share.elementLinkColor = "#009DDC";

    /* _______________ can edit above this line _______________ */

    function isReady() { janrain.ready = true; };
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", isReady, false);
    } else {
        window.attachEvent('onload', isReady);
    }

    var e = document.createElement('script');
    e.type = 'text/javascript';
    e.id = 'janrainWidgets';

    if (document.location.protocol === 'https:') {
      e.src = 'https://rpxnow.com/js/lib/strawpoll/widget.js';
    } else {
      e.src = 'http://widget-cdn.rpxnow.com/js/lib/strawpoll/widget.js';
    }

    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(e, s);
})();

function janrainWidgetOnload() {
	janrain.events.onProviderLoginToken.addHandler(function(token) {
		spFunctions.janrainAuthorizeAsync({
			onSuccess: function(response) {
				console.log('login response: ' + JSON.stringify(response));
				if (response.success) {
					currentPerson = response.user;
					console.log('currentPerson: ' + JSON.stringify(currentPerson));
					personAddress1 = currentPerson.address1;
					personAddress2 = '';
					personCity = currentPerson.city;
					personState = currentPerson.state;
					personZip = currentPerson.zip;
					sources.personAddress1.sync();
					sources.personAddress2.sync();
					sources.personCity.sync();
					sources.personState.sync();
					sources.personZip.sync();
					
					$$('textSP_username').setValue(currentPerson.name + ' via ' + response.profile.providerName);
					$$('dialogLogin').hide();
					
					L3.slideLeftStack('containerAddress');
				}
				else
					alert(response.message);
			},
			onError: function(error) {
				alert(JSON.stringify(error));
			},
			params: [token, false]
		});
	});
}

//var janrainShareOnload = function() {
//		$$('buttonFacebook').addListener('click', function() {
//			janrain.engage.share.loginAndSend({
//				"provider": "facebook",
//				"mode": "broadcast",
//				"contacts": [],
//				"title": "AOL",
//				"url": "http://aol.com",
//				"description": "The best web service ever",
//				"message": "You've got mail!",
//				"image": "http://aol.com/logo.png",
//				"media": "http://aol.com/promo.swf",
//				"actionLink": {
//					"name": "Instant Message",
//					"link": "http://aim.com/"
//				}
//			});
//		});
//	};