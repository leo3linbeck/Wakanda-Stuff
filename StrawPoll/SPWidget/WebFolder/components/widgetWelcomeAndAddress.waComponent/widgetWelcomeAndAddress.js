
(function Component (id) {// @lock

// Add the code that needs to be shared between components here

	var msgAddressVerified = 'Address verified - click button to start';
	var msgAddressUnverified = 'This address has not been verified';
	var msgAddressInvalid = 'This address is not valid';
	var msgVerifyingAddress = 'Verifying address - please wait...';

  	var toTitleCase = function toTitleCase(s) {
		return s.replace(/\b([a-z])/g, 
			function (_, i) {
  				return i.toUpperCase();
  			});
	}

function constructor (id) {

	// @region beginComponentDeclaration// @startlock
	var $comp = this;
	this.name = 'widgetSplashAndAddress';
	// @endregion// @endlock

	var verifyAddress = function verifyAddress() {
		$$(getHtmlId('textVerified')).setValue(msgVerifyingAddress);
		$$(getHtmlId('textVerified')).setTextColor('blue');
		$$(getHtmlId('buttonVerify')).disable();
		spFunctions.getZip9andPersonRecordAsync({
			onSuccess: function(response) {
				if (response) {
					sources.currentPerson = response.person;
					if (response.zip9 == 'none' || response.USPS.length == 0) {
						sources.currentPerson = null;
						invalidAddress();
					}
					else {
						$$(getHtmlId('textZip')).setValue(response.zip9);
						$$(getHtmlId('textUSPSAddress1')).setValue(response.USPS[0]);
						$$(getHtmlId('textUSPSAddress2')).setValue(response.USPS[1]);
						$$(getHtmlId('textVerified')).setValue(msgAddressVerified);
						$$(getHtmlId('textVerified')).setTextColor('green');
						$$(getHtmlId('buttonVote')).enable();
						$$(getHtmlId('buttonVoteHistory')).enable();
						$$(getHtmlId('buttonVerify')).disable();
					}
				}
				else {
					sources.currentPerson = null;
					unverifyAddress();
				}
			},
			onError: function(error) {
				sources.currentPerson = null;
				unverifyAddress();
				$$('textVerified').setValue(error);
			},
			params: [ $comp.sourcesVar.personAddress1, $comp.sourcesVar.personAddress2, $comp.sourcesVar.personCity, $comp.sourcesVar.personState, $comp.sourcesVar.personZip, false ]
		});
	}
	
	var unverifyAddress = function unverifyAddress() {
		$$(getHtmlId('textUSPSAddress1')).setValue('');
		$$(getHtmlId('textUSPSAddress2')).setValue('');
		$$(getHtmlId('textVerified')).setValue(msgAddressUnverified);
		$$(getHtmlId('textVerified')).setTextColor('blue');
		$$(getHtmlId('buttonVote')).disable();
		$$(getHtmlId('buttonVoteHistory')).disable();
		$$(getHtmlId('buttonVerify')).enable();
	}
	
	var invalidAddress = function invalidAddress() {
		$$(getHtmlId('textUSPSAddress1')).setValue('');
		$$(getHtmlId('textUSPSAddress2')).setValue('');
		$$(getHtmlId('textVerified')).setValue(msgAddressInvalid);
		$$(getHtmlId('textVerified')).setTextColor('red');
		$$(getHtmlId('buttonVote')).disable();
		$$(getHtmlId('buttonVoteHistory')).disable();
		$$(getHtmlId('buttonVerify')).enable();
	}
	
	this.load = function (data) {// @lock

	// @region namespaceDeclaration// @startlock
	var buttonStart = {};	// @button
	var buttonVote = {};	// @button
	var buttonVerify = {};	// @button
	var textZip = {};	// @textField
	var textState = {};	// @textField
	var textCity = {};	// @textField
	var textAddress2 = {};	// @textField
	var textAddress1 = {};	// @textField
	// @endregion// @endlock

	L3.stack = [getHtmlId('containerWelcome')];

	// eventHandlers// @lock

	buttonStart.click = function buttonStart_click (event)// @startlock
	{// @endlock
		unverifyAddress();
		L3.slideLeftStack(getHtmlId('containerAddress'));
	};// @lock

	buttonVote.click = function buttonVote_click (event)// @startlock
	{// @endlock
		if ($$(getHtmlId('textVerified')).getValue() != msgAddressVerified) {
			this.disable();
			sources.currentPerson = null;
			return;
		}
		L3.slideLeftStack(getHtmlId('containerElectionMain'));
	};// @lock

	buttonVerify.click = function buttonVerify_click (event)// @startlock
	{// @endlock
		verifyAddress();
	};// @lock

	textZip.change = function textZip_change (event)// @startlock
	{// @endlock
		unverifyAddress();
	};// @lock

	textState.change = function textState_change (event)// @startlock
	{// @endlock
		$comp.sourcesVar.personState = this.getValue().substr(0,2).toUpperCase();
		$comp.sources.personState.sync();
		unverifyAddress();
	};// @lock

	textCity.change = function textCity_change (event)// @startlock
	{// @endlock
		$comp.sourcesVar.personCity = toTitleCase(this.getValue());
		$comp.sources.personCity.sync();
		unverifyAddress();
	};// @lock

	textAddress2.change = function textAddress2_change (event)// @startlock
	{// @endlock
		$comp.sourcesVar.personAddress2 = toTitleCase(this.getValue());
		$comp.sources.personAddress2.sync();
		unverifyAddress();
	};// @lock

	textAddress1.change = function textAddress1_change (event)// @startlock
	{// @endlock
		$comp.sourcesVar.personAddress1 = toTitleCase(this.getValue());
		$comp.sources.personAddress1.sync();
		unverifyAddress();
	};// @lock

	getHtmlObj('textAddress1').on('keyup', 
			function (e) {
				if (e.keyCode == 13)
				verifyAddress();
			});

	getHtmlObj('textAddress2').on('keyup', 
			function (e) {
				if (e.keyCode == 13)
				verifyAddress();
			});

	getHtmlObj('textCity').on('keyup', 
			function (e) {
				if (e.keyCode == 13)
				verifyAddress();
			});

	getHtmlObj('textState').on('keyup', 
			function (e) {
				if (e.keyCode == 13)
				verifyAddress();
			});

	getHtmlObj('textZip').on('keyup', 
			function (e) {
				if (e.keyCode == 13)
				verifyAddress();
			});

	// @region eventManager// @startlock
	WAF.addListener(this.id + "_buttonStart", "click", buttonStart.click, "WAF");
	WAF.addListener(this.id + "_buttonVote", "click", buttonVote.click, "WAF");
	WAF.addListener(this.id + "_buttonVerify", "click", buttonVerify.click, "WAF");
	WAF.addListener(this.id + "_textZip", "change", textZip.change, "WAF");
	WAF.addListener(this.id + "_textState", "change", textState.change, "WAF");
	WAF.addListener(this.id + "_textCity", "change", textCity.change, "WAF");
	WAF.addListener(this.id + "_textAddress2", "change", textAddress2.change, "WAF");
	WAF.addListener(this.id + "_textAddress1", "change", textAddress1.change, "WAF");
	// @endregion// @endlock

	this.loaded = true;

	};// @lock

}// @startlock
return constructor;
})();// @endlock
