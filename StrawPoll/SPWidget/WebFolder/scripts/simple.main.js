
WAF.onAfterInit = function onAfterInit() {// @lock

	console.log('Entering WAF.onAfterInit');

// @region namespaceDeclaration// @startlock
	var titleStatusInfo = {};	// @richText
	var comboboxLevel = {};	// @combobox
	var buttonBackToElections0 = {};	// @button
	var checkboxFBShareWithFriends = {};	// @checkbox
	var matrixVote = {};	// @matrix
	var checkboxVote = {};	// @checkbox
	var buttonBP = {};	// @button
	var buttonSend = {};	// @button
	var buttonShare = {};	// @button
	var buttonBackToElections2 = {};	// @button
	var buttonBackToElections = {};	// @button
	var buttonViewVoteTotals = {};	// @button
	var buttonPrint = {};	// @button
	var buttonShowMyBallot = {};	// @button
	var iconHomeButton = {};	// @icon
	var iconLeftArrow = {};	// @icon
	var dataGridElections = {};	// @dataGrid
	var buttonSocialSignin = {};	// @button
	var buttonViewYourElections = {};	// @button
	var buttonTryAgain = {};	// @button
	var buttonNotMyAddress = {};	// @button
	var buttonVerify = {};	// @button
	var buttonSwitchAddressMode = {};	// @button
	var textState = {};	// @textField
	var textCity = {};	// @textField
	var textZip = {};	// @textField
	var textAddress2 = {};	// @textField
	var textStateShadow = {};	// @richText
	var textCityShadow = {};	// @richText
	var textZipShadow = {};	// @richText
	var textAddress2Shadow = {};	// @richText
	var textAddress1Shadow = {};	// @richText
	var textAddress1 = {};	// @textField
	var buttonSkipSignin = {};	// @button
	var documentEvent = {};	// @document
// @endregion// @endlock

	var containers = ['containerSplash','containerVerifyAddress','containerSorry','containerThankYou','containerElections','containerBallot','containerMyBallot','containerAllBallots','dialogJanrain','dialogProgress','containerMenuBar','containerBPInfo','containerPrint','containerShare'];
	var containerMargin = 2;
	var menuBarLeft = 4;
	var menuBarTop = 4;
	
	function setNumberOfVotes(eID) {
		var c = 0
		for (var indx = 0; indx < personVotes.length; indx++)
			if (personVotes[indx].electionID == eID)
				c++;
		$$('textNumberOfVotes').setValue(c);
	}
	
	function updateStatusInfo() {
		spFunctions.getSplashInfoAsync({
			onSuccess: function(event) {
				console.log('getClassCounts', event);
				$$('titleStatusInfo').setValue('<b>Status as of ' + (new Date).toISOString().substr(0,19) + '</b><br/>' + event.voteCount + ' votes cast in ' + event.electionCount + ' races<br/>Barack Obama: ' + event.obamaCount + '<br/>Mitt Romney: ' + event.romneyCount + '<br/><small><i>Click on this box to refresh with latest figures</i></small>');
			},
			onError: function(error) {
				console.log('ERROR', 'updateVotes', error);
			},
			params: [ false ]	
		});
	}

	
	function buildElectionMatrix(e, slideLeft) {
		if (e.numberOfCandidates == 0) {
			$$('textSelectNum').setValue('No ballot information');
			$$('matrixVote').hide();
			if (slideLeft)
				L3.slideLeftSimple('containerBallot');
			else
				L3.slideRightSimple();
		}
		else {
			$$('matrixVote').show();
			$$('textSelectNum').setValue('Select ' + L3.numberToWord(e.numberOfRepsToVoteFor) + ':');
			setNumberOfVotes(e.ID);
			sources.campaign.query('election.ID = :1 AND politician.ID != null', {
				onSuccess: function(event) {
					console.log('buildElectionMatrix', event);
					if (event.dataSource.length == 0)
						$$('textSelectNum').setValue('No ballot information');
					if (slideLeft)
						L3.slideLeftSimple('containerBallot');
					else
						L3.slideRightSimple();
				},
				onError: function(error) {
					console.log('ERROR', 'buildElectionMatrix', error);
					$$('textNumberOfVotes').setValue('');
					$$('textSelectNum').setValue('Error loading ballot');
					L3.slideLeftSimple('containerBallot');
				},
				params: [ e.ID ]
			});
		}
	}
	
	function getBPPage(url) {
		if (url)
			window.open(url,'_blank');
	}
	
	function processCheckboxClick(cb) {
		var eID = sources.election.ID;
		var cID = cb.candidateID;
		if (cb.getValue()) {
			var maxChecks = sources.election.numberOfRepsToVoteFor;
			var a = [];
			for (var i = 0; i < personVotes.length; i++) {
				if (personVotes[i].electionID != eID)
					a.push( {candidateID: personVotes[i].candidateID, electionID: personVotes[i].electionID} );
				else {
					if (personVotes[i].candidateID != cb.candidateID) {
						if (maxChecks > 1) {
							maxChecks--;
							a.push( {candidateID: personVotes[i].candidateID, electionID: personVotes[i].electionID} );
						}
					}
				}
			}
			a.push( {candidateID: cID, electionID: eID} );
			for (var i = 0; i < $$('matrixVote').getChildren().length; i++) {
				var x = $$('clone-checkboxVote-' + i + '-0');
				var chk = false;
				for (var j = 0; j < a.length; j++) {
					if (a[j].candidateID == x.candidateID) {
						chk = true;
						break;
					}
				}
				x.setValue(chk);
			}
			personVotes = a;
			setNumberOfVotes(eID);
		}
		else {
			for (var indx = 0; indx < personVotes.length; indx++)
				if (personVotes[indx].candidateID == cID && personVotes[indx].electionID == eID) {
					personVotes.splice(indx, 1);
					break;
				}
			setNumberOfVotes(eID);
		}
	}
	
	function updateVotes(goToMyBallot) {		
		spFunctions.updateVoteSimpleAsync({
			onSuccess: function(event) {
				console.log('updateVotes', event);
				if (goToMyBallot)
					loadMyBallot(true);
			},
			onError: function(error) {
				console.log('ERROR', 'updateVotes', error);
			},
			params: [ currentPerson.ID, currentElectionYear, personVotes, false ]	
		});
	}
	
	function loadFacebookFriends() {
		$$('textDialog').setValue('Loading social media friends...');
		$$('dialogProgress').show();
		spFunctions.getFacebookFriendsAsync({
			onSuccess: function(event) {
				console.log('loadFacebookFriends', event);
				friends = event.friends;
				sources.friends.sync();
				$$('dialogProgress').hide();
				L3.slideLeftSimple('containerShare');
			},
			onError: function(error) {
				console.log('ERROR', 'loadFacebookFriends', error);
				$$('dialogProgress').hide();
			},
			params: [ currentPerson, false ]	
		});
	}
	
	function printMyBallot() {
		spFunctions.generatePDFAsync({
			onSuccess: function(event) {
				console.log('printMyBallot', event);
				$$('framePDF').setValue(event.url);
				L3.slideLeftSimple('containerPrint');
			},
			onError: function(error) {
				console.log('ERROR', 'printMyBallot', error);
			},
			params: [ currentPerson, false ]	
		});
	}
	
	function verifyAddress() {
		spFunctions.getZip9PersonAndVoteRecordAsync({
			onSuccess: function(event) {
				console.log('verifyAddress', event);
				if (event) {
					currentPerson = event.person;
					if (event.zipVerified) {
						personAddress1 = currentPerson.address1;
						sources.personAddress1.sync();
						personAddress2 = currentPerson.address2;
						sources.personAddress2.sync();
						personCity = currentPerson.city;
						sources.personCity.sync();
						personState = currentPerson.state;
						sources.personState.sync();
						personZip = currentPerson.zip;
						sources.personZip.sync();
						personVotes = [];
						event.votes.forEach(function(e) {
							personVotes.push({ candidateID: e.candidate.ID, electionID: e.candidate.election.ID } );
						});
						$$('textUSPS1').setValue(event.USPS[0]);
						$$('textUSPS2').setValue(event.USPS[1]);
						L3.slideLeftSimple('containerThankYou');
					}
					else {
						currentPerson = { ID : null };
						invalidAddress();
					}
				}
				else {
					currentPerson = { ID : null };
					unverifyAddress();
				}
			},
			onError: function(error) {
				console.log('ERROR', 'verifyAddress', error);
				currentPerson = { ID : null };
				invalidAddress();
			},
			params: [ currentPerson.ID, currentElectionYear, personAddress1, personAddress2, personCity, personState, personZip, false ]
		});
	}
	
	function invalidAddress() {
		$$('textSorryAddress').setValue(personAddress1 + (personAddress2 ? ', ' : '') + personAddress2 + (personCity ? ', ' : '') + personCity + (personState ? ', ' : '') + personState + (personZip ? '  ' : '')  + personZip);
		L3.slideLeftSimple('containerSorry');
	}
	
	function loadVoteTotals(slide) {
		var eQuery = '';
		switch (electionLevel) {
			case 'all':
				eQuery = 'electionYear = ' + currentElectionYear + ' AND (districtType = "presidential" OR stateAbbreviation = "' + personState + '") order by sortLevel';
				break;
			case 'federal':
				eQuery = 'electionYear = ' + currentElectionYear + ' AND (districtType = "presidential" OR (stateAbbreviation = "' + personState + '" AND districtLevel = "' + electionLevel + '")) order by sortLevel';
				break;
			default:
				eQuery = 'electionYear = ' + currentElectionYear + ' AND stateAbbreviation = "' + personState + '" AND districtLevel = "' + electionLevel + '" order by sortLevel';
		}
		
		sources.campaignAll.query(eQuery, {
			onSuccess: function(event) {
				console.log('loadVoteTotals', eQuery, event);
				if (slide)
					L3.slideLeftSimple('containerAllBallots');
			},
			onError: function(error) {
				console.log('ERROR', 'loadVoteTotals', error);
			}
		});
	}
	
	function selectCurrentPersonElection(slideLeft) {
		var eQuery0 = 'calendar.googleID = 4000 AND district.zip9Districts.zip9.ID = "' + currentPerson.zip9.__KEY.ID + '" order by sortLevel';

		sources.election.query(eQuery0, {
			onSuccess: function(event) {
				console.log('selectCurrentPersonElection', event);
				if (event.dataSource.length == 1)
					$$('textElectionsInfo').setValue('There is one election in your location');
				else
					$$('textElectionsInfo').setValue('There are ' + L3.numberToWord(event.dataSource.length) + ' elections in your location');

				if (event.dataSource.length == 0)
					$$('textChooseOne').setValue('');
				else
					$$('textChooseOne').setValue('Choose one:');

				if (slideLeft)
					L3.slideLeftSimple('containerElections');
				else
					L3.slideRightSimple();
			},
			onError: function(error) {
				console.log('ERROR', 'selectCurrentPersonElection', error);
			}
		});
	}
	
	function loadMyBallot(slideLeft) {
		sources.campaignMy.query('votes.person.ID = :1 order by sortLevel', {
			onSuccess: function(event) {
				console.log('loadMyBallot', event);
				if (slideLeft)
					L3.slideLeftSimple('containerMyBallot');
				else
					L3.slideRightSimple();
			},
			onError: function(error) {
				console.log('ERROR', 'loadMyBallot', error);
			},
			params: [currentPerson.ID]
		});
	}
	
	function shareWithFriends() {
		$$('textDialog').setValue('Sending to social media friends...');
		$$('dialogProgress').show();
		
		var postOnWall = $$('checkboxFBPostOnWall').getValue();
		var shareWithFriends = $$('checkboxFBShareWithFriends').getValue();
		
		var f = [];
		if (shareWithFriends) {
			var rows = $$('dataGridFBFriends').getSelectedRows();
			for (var i = 0; i < rows.length; i++)
				f.push(friends[rows[i]]);
		}
		
		var fbMessage = $$('textFacebookMessage').getValue();
		
		spFunctions.shareWithFriendsAsync({
			onSuccess: function(event) {
				console.log('shareWithFriends', event);
				$$('dialogProgress').hide();
				L3.slideRightSimple();
			},
			onError: function(error) {
				console.log('ERROR', 'shareWithFriends', error);
				$$('dialogProgress').hide();
			},
			params: [ currentPerson, postOnWall, shareWithFriends, fbMessage, f, false ]
		});
	}
	
	function backToElections(n) {
		var eQuery0 = 'calendar.googleID = 4000 AND district.zip9Districts.zip9.ID = "' + currentPerson.zip9.__KEY.ID + '" order by sortLevel';

		sources.election.query(eQuery0, {
			onSuccess: function(event) {
				console.log('backToElections', event);
				L3.slideRightMultiple(n);
			},
			onError: function(error) {
				console.log('ERROR', 'backToElections', error);
			}
		});
	}
	

// eventHandlers// @lock

	titleStatusInfo.click = function titleStatusInfo_click (event)// @startlock
	{// @endlock
		updateStatusInfo();
	};// @lock

	comboboxLevel.change = function comboboxLevel_change (event)// @startlock
	{// @endlock
		electionLevel = $$('comboboxLevel').getValue();
		loadVoteTotals(false);
	};// @lock

	buttonBackToElections0.click = function buttonBackToElections0_click (event)// @startlock
	{// @endlock
		updateVotes(false);
		L3.slideRightSimple();
	};// @lock

	checkboxFBShareWithFriends.click = function checkboxFBShareWithFriends_click (event)// @startlock
	{// @endlock
		if (this.getValue())
			loadFacebookFriends();
	};// @lock

	matrixVote.onChildrenDraw = function matrixVote_onChildrenDraw (event)// @startlock
	{// @endlock
		var s = $(this).prop('id');
		var t = s.substr('clone-containerVote-'.length);
		var i = Number(t.substr(0, t.length - 2));
		var c = sources.campaign;
		$$('clone-label3-' + i + '-0').setValue(c.candidateName + ' (' + c.candidateParty + ')');
		$$('clone-checkboxVote-' + i + '-0').candidateID = c.ID;
		var x = false;
		for (var k = 0; k < personVotes.length; k++ )
			if (personVotes[k].candidateID == c.ID) {
				x = true;
				break;
			}
		$$('clone-checkboxVote-' + i + '-0').setValue(x);
		$$('clone-buttonBP-' + i + '-0').urlBP = c.districtName == 'President & Vice President' ? c.candidateWebsite : c.candidateURL;

	};// @lock

	checkboxVote.click = function checkboxVote_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	buttonBP.click = function buttonBP_click (event)// @startlock
	{// @endlock
		getBPPage($(this).prop('urlBP'));
	};// @lock

	buttonSend.click = function buttonSend_click (event)// @startlock
	{// @endlock
		shareWithFriends();
	};// @lock

	buttonShare.click = function buttonShare_click (event)// @startlock
	{// @endlock
		if (currentSocialNetwork == 'Yahoo')
			$$('checkboxFBShareWithFriends').disable();
		else
			$$('checkboxFBShareWithFriends').enable();
		
		L3.slideLeftSimple('containerShare');
	};// @lock

	buttonBackToElections2.click = function buttonBackToElections2_click (event)// @startlock
	{// @endlock
		backToElections(2);
	};// @lock

	buttonBackToElections.click = function buttonBackToElections_click (event)// @startlock
	{// @endlock
		backToElections(1);
	};// @lock

	buttonViewVoteTotals.click = function buttonViewVoteTotals_click (event)// @startlock
	{// @endlock
		loadVoteTotals(true);
	};// @lock

	buttonPrint.click = function buttonPrint_click (event)// @startlock
	{// @endlock
		printMyBallot();
	};// @lock

	buttonShowMyBallot.click = function buttonShowMyBallot_click (event)// @startlock
	{// @endlock
		updateVotes(true);
	};// @lock

	iconHomeButton.click = function iconHomeButton_click (event)// @startlock
	{// @endlock
		if (L3.stack[L3.stack.length-1] == 'containerBallot')
			updateVotes(false);
			
		L3.homeButtonSimple();
	};// @lock

	iconLeftArrow.click = function iconLeftArrow_click (event)// @startlock
	{// @endlock
		switch(L3.stack[L3.stack.length-1]) {
			case 'containerMyBallot':
				buildElectionMatrix(sources.election, false);
				break;
			case 'containerAllBallots':
				loadMyBallot(false);
				break;
			case 'containerBallot':
				updateVotes(false);
				L3.slideRightSimple();
				break;
			default:
				L3.slideRightSimple();
		}
	};// @lock

	dataGridElections.onRowClick = function dataGridElections_onRowClick (event)// @startlock
	{// @endlock
		buildElectionMatrix(sources.election, true);
	};// @lock

	buttonSocialSignin.click = function buttonSocialSignin_click (event)// @startlock
	{// @endlock
		if (currentPerson.ID && typeof janrainRefresh === 'function')
			janrainRefresh();
			
		$$('dialogJanrain').displayDialog();
	};// @lock

	buttonViewYourElections.click = function buttonViewYourElections_click (event)// @startlock
	{// @endlock
		selectCurrentPersonElection(true);
	};// @lock

	buttonTryAgain.click = function buttonTryAgain_click (event)// @startlock
	{// @endlock
		L3.slideRightSimple();
	};// @lock

	buttonNotMyAddress.click = function buttonNotMyAddress_click (event)// @startlock
	{// @endlock
		L3.slideRightSimple();
	};// @lock

	buttonVerify.click = function buttonVerify_click (event)// @startlock
	{// @endlock
		verifyAddress();
	};// @lock

	buttonSwitchAddressMode.click = function buttonSwitchAddressMode_click (event)// @startlock
	{// @endlock
		if ($$('textZip').isVisible()) {
			$$('textZip').hide();
			$$('textZipShadow').hide();
			$$('textCity').show()
			$$('textState').show()
			if ($$('textCity').getValue() == '')
				$$('textCityShadow').show()
			if ($$('textState').getValue() == '')
				$$('textStateShadow').show()
			this.setValue('Switch to ZIP code');
		}
		else {
			$$('textCity').hide()
			$$('textState').hide()
			$$('textCityShadow').hide()
			$$('textStateShadow').hide()
			$$('textZip').show();
			if ($$('textZip').getValue() == '')
				$$('textZipShadow').show();
			this.setValue('Switch to city and state');
		}
	};// @lock

	textState.blur = function textState_blur (event)// @startlock
	{// @endlock
		if (personState == '')
			$$('textStateShadow').show();
	};// @lock

	textState.focus = function textState_focus (event)// @startlock
	{// @endlock
		$$(this.id + 'Shadow').hide();
	};// @lock

	textState.change = function textState_change (event)// @startlock
	{// @endlock
		personState = this.getValue().substr(0,2).toUpperCase();
		source.personState.sync();
		if (personState == '')
			$$('textStateShadow').show();
	};// @lock

	textCity.blur = function textCity_blur (event)// @startlock
	{// @endlock
		if (personCity == '')
			$$('textCityShadow').show();
	};// @lock

	textCity.focus = function textCity_focus (event)// @startlock
	{// @endlock
		$$(this.id + 'Shadow').hide();
	};// @lock

	textCity.change = function textCity_change (event)// @startlock
	{// @endlock
		personCity = L3.toTitleCase(this.getValue());
		source.personCity.sync();
		if (personCity == '')
			$$('textCityShadow').show();
	};// @lock

	textZip.blur = function textZip_blur (event)// @startlock
	{// @endlock
		if (personZip == '')
			$$('textZipShadow').show();
	};// @lock

	textZip.focus = function textZip_focus (event)// @startlock
	{// @endlock
		$$(this.id + 'Shadow').hide();
	};// @lock

	textZip.change = function textZip_change (event)// @startlock
	{// @endlock
		personZip = L3.toTitleCase(this.getValue());
		source.personZip.sync();
		if (personZip == '')
			$$('textZipShadow').show();
	};// @lock

	textAddress2.blur = function textAddress2_blur (event)// @startlock
	{// @endlock
		if (personAddress2 == '')
			$$('textAddress2Shadow').show();
	};// @lock

	textAddress2.focus = function textAddress2_focus (event)// @startlock
	{// @endlock
		$$(this.id + 'Shadow').hide();
	};// @lock

	textAddress2.change = function textAddress2_change (event)// @startlock
	{// @endlock
		personAddress2 = L3.toTitleCase(this.getValue());
		source.personAddress2.sync();
		if (personAddress2 == '')
			$$('textAddress2Shadow').show();
	};// @lock

	textStateShadow.click = function textStateShadow_click (event)// @startlock
	{// @endlock
		this.hide();
		$$('textState').focus();
	};// @lock

	textCityShadow.click = function textCityShadow_click (event)// @startlock
	{// @endlock
		this.hide();
		$$('textCity').focus();
	};// @lock

	textZipShadow.click = function textZipShadow_click (event)// @startlock
	{// @endlock
		this.hide();
		$$('textZip').focus();
	};// @lock

	textAddress2Shadow.click = function textAddress2Shadow_click (event)// @startlock
	{// @endlock
		this.hide();
		$$('textAddress2').focus();
	};// @lock

	textAddress1Shadow.click = function textAddress1Shadow_click (event)// @startlock
	{// @endlock
		this.hide();
		$$('textAddress1').focus();
	};// @lock

	textAddress1.blur = function textAddress1_blur (event)// @startlock
	{// @endlock
		if (personAddress1 == '')
			$$('textAddress1Shadow').show();
	};// @lock

	textAddress1.change = function textAddress1_change (event)// @startlock
	{// @endlock
		personAddress1 = L3.toTitleCase(this.getValue());
		source.personAddress1.sync();
		if (personAddress1 == '')
			$$('textAddress1Shadow').show();
	};// @lock

	textAddress1.focus = function textAddress1_focus (event)// @startlock
	{// @endlock
		$$(this.id + 'Shadow').hide();
	};// @lock

	buttonSkipSignin.click = function buttonSkipSignin_click (event)// @startlock
	{// @endlock
		L3.slideLeftSimple('containerVerifyAddress');
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		console.log('Entering documentEvent.onLoad');
		L3.stack = ['containerSplash'];
		
		for (var i = 1; i < containers.length; i++) {
			$$(containers[i]).hide();
			$$(containers[i]).move(containerMargin, containerMargin);
		}
		$$('containerBallot').hide();
		$$('containerMenuBar').move(menuBarLeft,menuBarTop);
		$$('dialogProgress').move(58,120);
		$$('dialogJanrain').move(30,40);
		$$('textCity').hide();
		$$('textState').hide();	
		$$('textCityShadow').hide();
		$$('textStateShadow').hide();	
		
		personAddress1 = '';
		personAddress2 = '';
		personCity = '';
		personState = '';
		personZip = '';

		currentElectionYear = 2012;
		currentSocialNetwork = null;
		sources.currentElectionYear.sync();
		
		currentPerson = { ID : null };
			
		$('#textAddress1, #textAddress2, #textCity, #textState, #textZip').on('keyup', 
				function (e) {
					if (e.keyCode == 13)
					verifyAddress();
				});
		
		updateStatusInfo();
		
		console.log('Exiting documentEvent.onLoad');
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("titleStatusInfo", "click", titleStatusInfo.click, "WAF");
	WAF.addListener("comboboxLevel", "change", comboboxLevel.change, "WAF");
	WAF.addListener("buttonBackToElections0", "click", buttonBackToElections0.click, "WAF");
	WAF.addListener("checkboxFBShareWithFriends", "click", checkboxFBShareWithFriends.click, "WAF");
	WAF.addListener("matrixVote", "onChildrenDraw", matrixVote.onChildrenDraw, "WAF");
	WAF.addListener("checkboxVote", "click", checkboxVote.click, "WAF");
	WAF.addListener("buttonBP", "click", buttonBP.click, "WAF");
	WAF.addListener("buttonSend", "click", buttonSend.click, "WAF");
	WAF.addListener("buttonShare", "click", buttonShare.click, "WAF");
	WAF.addListener("buttonBackToElections2", "click", buttonBackToElections2.click, "WAF");
	WAF.addListener("buttonBackToElections", "click", buttonBackToElections.click, "WAF");
	WAF.addListener("buttonViewVoteTotals", "click", buttonViewVoteTotals.click, "WAF");
	WAF.addListener("buttonPrint", "click", buttonPrint.click, "WAF");
	WAF.addListener("buttonShowMyBallot", "click", buttonShowMyBallot.click, "WAF");
	WAF.addListener("iconHomeButton", "click", iconHomeButton.click, "WAF");
	WAF.addListener("iconLeftArrow", "click", iconLeftArrow.click, "WAF");
	WAF.addListener("dataGridElections", "onRowClick", dataGridElections.onRowClick, "WAF");
	WAF.addListener("buttonSocialSignin", "click", buttonSocialSignin.click, "WAF");
	WAF.addListener("buttonViewYourElections", "click", buttonViewYourElections.click, "WAF");
	WAF.addListener("buttonTryAgain", "click", buttonTryAgain.click, "WAF");
	WAF.addListener("buttonNotMyAddress", "click", buttonNotMyAddress.click, "WAF");
	WAF.addListener("buttonVerify", "click", buttonVerify.click, "WAF");
	WAF.addListener("buttonSwitchAddressMode", "click", buttonSwitchAddressMode.click, "WAF");
	WAF.addListener("textState", "blur", textState.blur, "WAF");
	WAF.addListener("textCity", "blur", textCity.blur, "WAF");
	WAF.addListener("textZip", "blur", textZip.blur, "WAF");
	WAF.addListener("textAddress2", "blur", textAddress2.blur, "WAF");
	WAF.addListener("textAddress1", "blur", textAddress1.blur, "WAF");
	WAF.addListener("textState", "focus", textState.focus, "WAF");
	WAF.addListener("textState", "change", textState.change, "WAF");
	WAF.addListener("textCity", "focus", textCity.focus, "WAF");
	WAF.addListener("textCity", "change", textCity.change, "WAF");
	WAF.addListener("textZip", "focus", textZip.focus, "WAF");
	WAF.addListener("textZip", "change", textZip.change, "WAF");
	WAF.addListener("textAddress2", "focus", textAddress2.focus, "WAF");
	WAF.addListener("textAddress2", "change", textAddress2.change, "WAF");
	WAF.addListener("textStateShadow", "click", textStateShadow.click, "WAF");
	WAF.addListener("textCityShadow", "click", textCityShadow.click, "WAF");
	WAF.addListener("textZipShadow", "click", textZipShadow.click, "WAF");
	WAF.addListener("textAddress2Shadow", "click", textAddress2Shadow.click, "WAF");
	WAF.addListener("textAddress1", "change", textAddress1.change, "WAF");
	WAF.addListener("textAddress1Shadow", "click", textAddress1Shadow.click, "WAF");
	WAF.addListener("textAddress1", "focus", textAddress1.focus, "WAF");
	WAF.addListener("buttonSkipSignin", "click", buttonSkipSignin.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock

function handleJanrainSignin(token, refresh) {
	console.log('Entering handleJanrainSignin');
	janrainRefresh = refresh;
	spFunctions.janrainAuthorizeAsync({
		onSuccess: function(event) {
			if (event.success) {
				currentPerson = event.user;
				console.log('janrainAuthorizeAsync', event);
				personAddress1 = currentPerson.address1;
				personAddress2 = '';
				personCity = currentPerson.city;
				personState = currentPerson.stateAbbreviation;
				personZip = currentPerson.zip;
				sources.personAddress1.sync();
				sources.personAddress2.sync();
				sources.personCity.sync();
				sources.personState.sync();
				sources.personZip.sync();
				if (personAddress1)
					$$('textAddress1Shadow').hide();
				else
					$$('textAddress1Shadow').show();

				if ($$('textZip').isVisible()) {
					$$('textCityShadow').hide();
					$$('textStateShadow').hide();
					if (personZip)
						$$('textZipShadow').hide();
					else
						$$('textZipShadow').show();
				}
				else {
					$$('textZipShadow').hide();
					if (personCity)
						$$('textCityShadow').hide();
					else
						$$('textCityShadow').show();
					if (personState)
						$$('textStateShadow').hide();
					else
						$$('textStateShadow').show();
				}
				currentSocialNetwork = event.profile.providerName;
				
				$$('textUsername').setValue(currentPerson.name + ' via ' + currentSocialNetwork);
				$$('textUsername').setTextColor('green');
				
				$('#dialogJanrain').fadeOut(function() {
					L3.slideLeftSimple('containerVerifyAddress');
				});
			}
			else
				alert(event.message);
		},
		onError: function(error) {
			console.log('ERROR', 'janrainAuthorizeAsync', error);
		},
		params: [token, false]
	});
	console.log('Exiting handleJanrainSignin');
}

//(function() {
//	console.log('Janrain share function');
//	
//    if (typeof window.janrain !== 'object') window.janrain = {};
//    if (typeof window.janrain.settings !== 'object') window.janrain.settings = {};
//    if (typeof window.janrain.settings.share !== 'object') window.janrain.settings.share = {};
//    if (typeof window.janrain.settings.packages !== 'object') janrain.settings.packages = [];
//    janrain.settings.packages.push('share');

//    /* _______________ can edit below this line _______________ */

//	janrain.settings.share.custom = true;

//    /* _______________ can edit above this line _______________ */

//	function isReady() { janrain.ready = true; };
//	if (document.addEventListener) {
//		document.addEventListener("DOMContentLoaded", isReady, false);
//	} else {
//		window.attachEvent('onload', isReady);
//	}

//    var e = document.createElement('script');
//    e.type = 'text/javascript';
//    e.id = 'janrainWidgets';

//    if (document.location.protocol === 'https:') {
//      e.src = 'https://rpxnow.com/js/lib/strawpoll/widget.js';
//    } else {
//      e.src = 'http://widget-cdn.rpxnow.com/js/lib/strawpoll/widget.js';
//    }

//    var s = document.getElementsByTagName('script')[0];
//    s.parentNode.insertBefore(e, s);
//})();

