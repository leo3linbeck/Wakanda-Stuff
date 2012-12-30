
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
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
	var iconFB = {};	// @icon
	var buttonShare = {};	// @button
	var buttonBack_myBallot = {};	// @button
	var buttonPrint = {};	// @button
	var buttonEmail = {};	// @button
	var buttonEmailSend = {};	// @button
	var buttonEmailClear = {};	// @button
	var buttonBack_email = {};	// @button
	var buttonHorseRace = {};	// @button
	var buttonLoadDummyData = {};	// @button
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
	var buttonStateHouse = {};	// @button
	var buttonStateSenate = {};	// @button
	var buttonBack_totals = {};	// @button
	var buttonShowMyBallot = {};	// @button
	var buttonTotals = {};	// @button
	var buttonLocalIR = {};	// @button
	var buttonStateIR = {};	// @button
	var buttonLocalElections = {};	// @button
	var buttonProp_4 = {};	// @button
	var buttonBack_IR = {};	// @button
	var buttonProp_3 = {};	// @button
	var buttonProp_2 = {};	// @button
	var buttonProp_1 = {};	// @button
	var buttonLocal_3 = {};	// @button
	var buttonback_local = {};	// @button
	var buttonLocal_2 = {};	// @button
	var buttonCityCouncil = {};	// @button
	var buttonMayor = {};	// @button
	var buttonSoS = {};	// @button
	var buttonStatewide = {};	// @button
	var buttonBack_statewide = {};	// @button
	var buttonAG = {};	// @button
	var buttonLtGovernor = {};	// @button
	var buttonGovernor = {};	// @button
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
	var buttonUSHouse = {};	// @button
	var buttonUSSenate = {};	// @button
	var buttonSaveBallot = {};	// @button
	var buttonPresident = {};	// @button
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
	var containers = ['containerWelcome','containerAddress','containerSettings','containerElectionMain','containerStatewide','containerLocal','containerMyBallot','containerIR','containerHorseRace', 'homeButton', 'containerElection','containerTotals','containerEmail','containerEmailHistory'];
	var containerMargin = 2;
	var homeLeft = 280;
	var homeTop = 6;
	var bpWindow = null;
	  
// @endregion

// @region general functions

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
		alert('Not yet implemented');
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
	
	function addHeaderToPDF(doc, param) {
		doc.setFontSize(24);
		doc.text('StrawPoll(tm) Sample Ballot', param.xCoord, param.yCoord);
		
		doc.setFontSize(18);
		param.yCoord += param.lineHeight;
		doc.text('For the address:', param.xCoord, param.yCoord);
		
		param.xCoord += 20;
		param.yCoord += param.lineHeight;
		doc.text(param.person.address1, param.xCoord, param.yCoord);
		if(param.person.address2) {
			param.yCoord += param.lineHeight;
			doc.text(param.person.address2, param.xCoord, param.yCoord);
			param.box.y += param.lineHeight;
			param.box.h -= param.lineHeight;
			param.maxLines--;
		}
		param.yCoord += param.lineHeight;
		doc.text(param.person.city + ', ' + param.person.state + '  ' + param.person.zip, param.xCoord, param.yCoord);
		
		param.yCoord += 1.5 * param.lineHeight;
		doc.setFontSize(14);
		doc.setFontStyle('italic');
		doc.text('Election', param.xCol1 + 1, param.yCoord);
		doc.text('District', param.xCol2 + 1, param.yCoord);
		doc.text('Candidate', param.xCol3 + 1, param.yCoord);
		doc.text('Party', param.xCol4 + 1, param.yCoord);
		doc.lines([[param.line.x2 + 2, 0]], param.line.x1 - 1, param.yCoord + param.line.y, [1.0, 1.0]);
	}
		
	function initializePDFParams() {
		var p = {
			person: currentPerson,
			lineHeight: 10,
			maxLines: 20,
			xMargin: 20,
			yMargin: 20,
			xCol1: 25,
			xCol2: 75,
			xCol3: 105,
			xCol4: 180,
			xCol5: 190,
			xCoord: 20,
			yCoord: 20,
			box: {},
			line: {}
		};
		
		p.box = {
			x: 20,
			y: 58,
			h: 220,
			w: 180
		};
		
		p.line = {
			x1: 21,
			x2: 178,
			y: 3
		};
		
		return p;
	}
		
	function resetPDFParams(p) {
		p.xCoord = 20;
		p.yCoord = 20;
	}
	
	function convertBallotToPDF(campaigns) {	
		var doc = new jsPDF();
		var pdfParams = initializePDFParams();
		
		addHeaderToPDF(doc, pdfParams);
		
		doc.setFontSize(14);
		doc.setFontStyle('normal');
		campaigns.toArray('districtType, districtName, candidateName, candidateParty, incumbent', {
			onSuccess: function(event) {
				var c = event.result;
				var lineNum = 0;
				for (var i = 0; i < c.length; i++) {
					if (lineNum++ > pdfParams.maxLines) {
						doc.rect(pdfParams.box.x, pdfParams.box.y, pdfParams.box.w, pdfParams.box.h);
						doc.addPage();
						resetPDFParams(pdfParams);
						addHeaderToPDF(doc, pdfParams);
						doc.setFontStyle('normal');
						lineNum = 1;
					}
					pdfParams.yCoord += pdfParams.lineHeight;

					doc.text(c[i].districtType.trim(), pdfParams.xCol1, pdfParams.yCoord);
					doc.text(c[i].districtName.trim(), pdfParams.xCol2, pdfParams.yCoord);
					doc.text(c[i].candidateName.trim(), pdfParams.xCol3, pdfParams.yCoord);
					doc.text(c[i].candidateParty.trim(), pdfParams.xCol4, pdfParams.yCoord);
					doc.text((c[i].incumbent?' [I]':''), pdfParams.xCol5, pdfParams.yCoord);
					if (lineNum <= pdfParams.maxLines)
						doc.lines([[pdfParams.line.x2, 0]], pdfParams.line.x1, pdfParams.yCoord + pdfParams.line.y, [1.0, 1.0]);
				}
				doc.rect(pdfParams.box.x, pdfParams.box.y, pdfParams.box.w, pdfParams.box.h);
				
				var strWindowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
				var pdfWindow = window.open('', 'Printed Ballot', strWindowFeatures);
				
				doc.output('datauri');
			}
		});
	}	
	
	function printMyBallot() {
		convertBallotToPDF(sources.campaign);
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
						currentPerson = null;
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
				eQuery0 = 'year = 2012 AND (' + eQuery1 + ')';
			else
				eQuery0 = 'year = 2012 AND (' + eQuery1 + ' OR ' + eQuery2 + ')';
		
		source.election.query(eQuery0, {
			onSuccess: function(event) {
					if (slide)
						L3.slideLeftStack('containerHorseRace');
				}
		});
	}
	
// @endregion



// eventHandlers// @lock

	buttonVoteHistory.click = function buttonVoteHistory_click (event)// @startlock
	{// @endlock
		alert('Not yet implemented');
	};// @lock

// @region back button clicks

	buttonBack_emailHistory.click = function buttonBack_emailHistory_click (event)// @startlock
	{// @endlock
		L3.slideRightStack();
	};// @lock

	buttonBack_myBallot.click = function buttonBack_myBallot_click (event)// @startlock
	{// @endlock
		L3.slideRightStack();
	};// @lock

	buttonBack_email.click = function buttonBack_email_click (event)// @startlock
	{// @endlock
		$$('textEmailResult').setValue('');
		L3.slideRightStack();
	};// @lock

	buttonBack_settings.click = function buttonBack_settings_click (event)// @startlock
	{// @endlock
		$$('textDummyData').setValue('');
		L3.slideRightStack();
	};// @lock

	buttonBack_totals.click = function buttonBack_totals_click (event)// @startlock
	{// @endlock
		L3.slideRightStack();
	};// @lock

	buttonBack_IR.click = function buttonBack_IR_click (event)// @startlock
	{// @endlock
		L3.slideRightStack();
	};// @lock

	buttonback_local.click = function buttonback_local_click (event)// @startlock
	{// @endlock
		L3.slideRightStack();
	};// @lock

	buttonBack_statewide.click = function buttonBack_statewide_click (event)// @startlock
	{// @endlock
		L3.slideRightStack();
	};// @lock

	buttonBack_horseRace.click = function buttonBack_horseRace_click (event)// @startlock
	{// @endlock
		L3.slideRightStack();
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

// @region ballot measure button clicks

	buttonProp_4.click = function buttonProp_4_click (event)// @startlock
	{// @endlock
		buildElection(2012, 'Proposition 4');
	};// @lock

	buttonProp_3.click = function buttonProp_3_click (event)// @startlock
	{// @endlock
		buildElection(2012, 'Proposition 3');
	};// @lock

	buttonProp_2.click = function buttonProp_2_click (event)// @startlock
	{// @endlock
		buildElection(2012, 'Proposition 2');
	};// @lock

	buttonProp_1.click = function buttonProp_1_click (event)// @startlock
	{// @endlock
		buildElection(2012, 'Proposition 1');
	};// @lock

	buttonLocalIR.click = function buttonLocalIR_click (event)// @startlock
	{// @endlock
		L3.slideLeftStack('containerIR');
	};// @lock

	buttonStateIR.click = function buttonStateIR_click (event)// @startlock
	{// @endlock
		L3.slideLeftStack('containerIR');
	};// @lock

// @endregion

// @region local election button clicks

	buttonLocal_3.click = function buttonLocal_3_click (event)// @startlock
	{// @endlock
		buildElection(2012, 'Local Election');
	};// @lock

	buttonLocal_2.click = function buttonLocal_2_click (event)// @startlock
	{// @endlock
		buildElection(2012, 'Local Election');
	};// @lock

	buttonCityCouncil.click = function buttonCityCouncil_click (event)// @startlock
	{// @endlock
		buildElection(2012, 'City Council');
	};// @lock

	buttonMayor.click = function buttonMayor_click (event)// @startlock
	{// @endlock
		buildElection(2012, 'Mayor');
	};// @lock

	buttonLocalElections.click = function buttonLocalElections_click (event)// @startlock
	{// @endlock
		L3.slideLeftStack('containerLocal');
	};// @lock
	
// @endregion

// @region state election button clicks

	buttonSoS.click = function buttonSoS_click (event)// @startlock
	{// @endlock
		buildElection(2012, 'US House');
	};// @lock

	buttonAG.click = function buttonAG_click (event)// @startlock
	{// @endlock
		buildElection(2012, 'Attorney General');
	};// @lock

	buttonLtGovernor.click = function buttonLtGovernor_click (event)// @startlock
	{// @endlock
		buildElection(2012, 'Lieutenant Governor');
	};// @lock

	buttonGovernor.click = function buttonGovernor_click (event)// @startlock
	{// @endlock
		buildElection(2012, 'Governor');
		L3.slideLeftStack('containerElection');
	};// @lock
	
	buttonStateHouse.click = function buttonStateHouse_click (event)// @startlock
	{// @endlock
		buildElection(2012, 'State Lower Chamber');
	};// @lock

	buttonStateSenate.click = function buttonStateSenate_click (event)// @startlock
	{// @endlock
		buildElection(2012, 'State Upper Chamber');
	};// @lock

	buttonStatewide.click = function buttonStatewide_click (event)// @startlock
	{// @endlock
		L3.slideLeftStack('containerStatewide');
	};// @lock

// @endregion

// @region federal election button clicks

	buttonUSHouse.click = function buttonUSHouse_click (event)// @startlock
	{// @endlock
		buildElection(2012, 'US House');
	};// @lock

	buttonUSSenate.click = function buttonUSSenate_click (event)// @startlock
	{// @endlock
		buildElection(2012, 'US Senate');
	};// @lock

	buttonPresident.click = function buttonPresident_click (event)// @startlock
	{// @endlock
		buildElection(2012, 'US President');
	};// @lock

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

	iconFB.click = function iconFB_click (event)// @startlock
	{// @endlock
		shareMyBallot();
	};// @lock

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
		source.campaign.query('votes.person.ID = :1', currentPerson.ID);
		source.ballotMeasure.query('votes.person.ID = :1', currentPerson.ID);
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
			currentPerson = null;
			return;
		}
		L3.slideLeftStack('containerElectionMain');
	};// @lock

// @endregion

// @region Settings button clicks

	iconSettings.click = function iconSettings_click (event)// @startlock
	{// @endlock
		L3.slideLeftStack('containerSettings');
	};// @lock

	buttonLoadDummyData.click = function buttonLoadDummyData_click (event)// @startlock
	{// @endlock
		$$('textDummyData').setValue('Loading data...');
		$$('textDummyData').setTextColor('blue');
		spFunctions.loadDummyDataAsync({
			onSuccess: function(response) {
				$$('textDummyData').setValue('Data loaded');
				$$('textDummyData').setTextColor('green');
			},
			onError: function(error) {
				$$('textDummyData').setValue('Error');
				$$('textDummyData').setTextColor('red');
			}
		});
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
				
		$$('textAddress1').focus();
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
		
		personAddress1 = '';
		personAddress2 = '';
		personCity = '';
		personState = '';
		personZip = '';
			
		$('#textAddress1, #textAddress2, #textCity, #textState, #textZip').on('keyup', 
				function (e) {
					if (e.keyCode == 13)
					verifyAddress();
				});
	};// @lock

// @region eventManager// @startlock
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
	WAF.addListener("iconFB", "click", iconFB.click, "WAF");
	WAF.addListener("buttonShare", "click", buttonShare.click, "WAF");
	WAF.addListener("buttonBack_myBallot", "click", buttonBack_myBallot.click, "WAF");
	WAF.addListener("buttonPrint", "click", buttonPrint.click, "WAF");
	WAF.addListener("buttonEmail", "click", buttonEmail.click, "WAF");
	WAF.addListener("buttonEmailSend", "click", buttonEmailSend.click, "WAF");
	WAF.addListener("buttonEmailClear", "click", buttonEmailClear.click, "WAF");
	WAF.addListener("buttonBack_email", "click", buttonBack_email.click, "WAF");
	WAF.addListener("buttonHorseRace", "click", buttonHorseRace.click, "WAF");
	WAF.addListener("buttonLoadDummyData", "click", buttonLoadDummyData.click, "WAF");
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
	WAF.addListener("buttonStateHouse", "click", buttonStateHouse.click, "WAF");
	WAF.addListener("buttonStateSenate", "click", buttonStateSenate.click, "WAF");
	WAF.addListener("buttonBack_totals", "click", buttonBack_totals.click, "WAF");
	WAF.addListener("buttonShowMyBallot", "click", buttonShowMyBallot.click, "WAF");
	WAF.addListener("buttonTotals", "click", buttonTotals.click, "WAF");
	WAF.addListener("buttonLocalIR", "click", buttonLocalIR.click, "WAF");
	WAF.addListener("buttonStateIR", "click", buttonStateIR.click, "WAF");
	WAF.addListener("buttonLocalElections", "click", buttonLocalElections.click, "WAF");
	WAF.addListener("buttonProp_4", "click", buttonProp_4.click, "WAF");
	WAF.addListener("buttonBack_IR", "click", buttonBack_IR.click, "WAF");
	WAF.addListener("buttonProp_3", "click", buttonProp_3.click, "WAF");
	WAF.addListener("buttonProp_2", "click", buttonProp_2.click, "WAF");
	WAF.addListener("buttonProp_1", "click", buttonProp_1.click, "WAF");
	WAF.addListener("buttonLocal_3", "click", buttonLocal_3.click, "WAF");
	WAF.addListener("buttonback_local", "click", buttonback_local.click, "WAF");
	WAF.addListener("buttonLocal_2", "click", buttonLocal_2.click, "WAF");
	WAF.addListener("buttonCityCouncil", "click", buttonCityCouncil.click, "WAF");
	WAF.addListener("buttonMayor", "click", buttonMayor.click, "WAF");
	WAF.addListener("buttonSoS", "click", buttonSoS.click, "WAF");
	WAF.addListener("buttonStatewide", "click", buttonStatewide.click, "WAF");
	WAF.addListener("buttonBack_statewide", "click", buttonBack_statewide.click, "WAF");
	WAF.addListener("buttonAG", "click", buttonAG.click, "WAF");
	WAF.addListener("buttonLtGovernor", "click", buttonLtGovernor.click, "WAF");
	WAF.addListener("buttonGovernor", "click", buttonGovernor.click, "WAF");
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
	WAF.addListener("buttonUSHouse", "click", buttonUSHouse.click, "WAF");
	WAF.addListener("buttonUSSenate", "click", buttonUSSenate.click, "WAF");
	WAF.addListener("buttonSaveBallot", "click", buttonSaveBallot.click, "WAF");
	WAF.addListener("buttonPresident", "click", buttonPresident.click, "WAF");
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
