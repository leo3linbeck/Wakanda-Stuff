
(function Component (id) {// @lock

// Add the code that needs to be shared between components here

  	var toTitleCase = function toTitleCase(s) {
		return s.replace(/\b([a-z])/g, 
			function (_, i) {
  				return i.toUpperCase();
  			});
	}

function constructor (id) {

	// @region beginComponentDeclaration// @startlock
	var $comp = this;
	this.name = 'addressEntryAndVerify';
	// @endregion// @endlock

	this.googleMapAddress = '';
	this.googleMap1 = 'http://maps.google.com/maps/api/staticmap?sensor=false&center=';
	this.googleMap2 = '&zoom=';
	this.googleMap3 = '&maptype=undefined&size=249x167&markers=color:red|size:undefined|label:undefined|';
	this.googleMapZoomLevel = 10;
	
	var verifyAddress = function verifyAddress() {
		$$(getHtmlId('textVerified')).setValue(L3.msgVerifyingAddress);
		$$(getHtmlId('textVerified')).setTextColor('blue');
		$$(getHtmlId('buttonVerify')).disable();
		spFunctions.getZip9andPersonRecordAsync({
			onSuccess: function(response) {
				if (response && response.success)
					if (response.zip9 == 'none' || response.USPS.length == 0)
						invalidAddress(L3.msgAddressInvalid);
					else
						successfulValidationAction(response);
				else
					if (response)
						invalidAddress(response.message);
					else 
						invalidAddress('Error: Server did not respond');
			},
			onError: function(error) {
				invalidAddress(error);
			},
			params: [ $comp.sourcesVar.personAddress1, $comp.sourcesVar.personAddress2, $comp.sourcesVar.personCity, $comp.sourcesVar.personState, $comp.sourcesVar.personZip, false ]
		});
	}
	
	var unverifyAddress = function unverifyAddress() {
		$$(getHtmlId('textVerified')).setValue(L3.msgAddressUnverified);
		$$(getHtmlId('textVerified')).setTextColor('blue');
		unsuccessfulValidationAction();
	}
	
	var invalidAddress = function invalidAddress(msg) {
		$$(getHtmlId('textVerified')).setValue(msg);
		$$(getHtmlId('textVerified')).setTextColor('red');
		unsuccessfulValidationAction();
	}
	
	var successfulValidationAction = function successfulValidationAction(r) {
		$$(getHtmlId('textZip')).setValue(r.zip9);
		$$(getHtmlId('textUSPSAddress1')).setValue(r.USPS[0]);
		$$(getHtmlId('textUSPSAddress2')).setValue(r.USPS[1]);
		$$(getHtmlId('textVerified')).setValue(L3.msgAddressVerified);
		$$(getHtmlId('textVerified')).setTextColor('green');
		$$(getHtmlId('buttonVerify')).disable();
		arraySelect.push( { id: 1, name: 'election', label: 'Election', page: 'containerElection', action: {} } );
		arraySelect.push( { id: 2, name: 'completeBallot', label: 'Complete Ballot', page: 'containerMyBallot', action: {} } );
		arraySelect.push( { id: 3, name: 'horseRace', label: 'Horse Race', page: 'containerHorseRace', action: {} } );
		arraySelect.push( { id: 4, name: 'share', label: 'Share With Friends', page: 'containerShare', action: {} } );
		arraySelect.push( { id: 5, name: 'email', label: 'Email to Friends', page: 'containerEmail', action: {} } );
		arraySelect.push( { id: 6, name: 'maintenance', label: 'Maintenance', page: 'containerMaintenance', action: {} } );
		sources.arraySelect.sync();
		sources.currentPerson = r.person;
		$comp.googleMapAddress = r.USPS[0] + ', ' + r.USPS[1];
		var src = $comp.googleMap1 + $comp.googleMapAddress + $comp.googleMap2 + $comp.googleMapZoomLevel + $comp.googleMap3 + $comp.googleMapAddress;
		$(getHtmlObj('googleMapAddress')).attr({ 'src': src, 'data-position': $comp.googleMapAddress });
	}
	
	var unsuccessfulValidationAction = function unsuccessfulValidationAction() {
		$$(getHtmlId('buttonVerify')).enable();
		$$(getHtmlId('textUSPSAddress1')).setValue('');
		$$(getHtmlId('textUSPSAddress2')).setValue('');
		arraySelect.length = 1;
		sources.arraySelect.sync();
		sources.currentPerson = null;
		$(getHtmlObj('googleMapAddress')).attr({ 'data-position': '' });
	}
	
	this.load = function (data) {// @lock

	// @region namespaceDeclaration// @startlock
	var iconZoomOut = {};	// @icon
	var iconZoomIn = {};	// @icon
	var buttonVerify = {};	// @button
	var textZip = {};	// @textField
	var textState = {};	// @textField
	var textCity = {};	// @textField
	var textAddress2 = {};	// @textField
	var textAddress1 = {};	// @textField
	// @endregion// @endlock

	// eventHandlers// @lock

	iconZoomOut.click = function iconZoomOut_click (event)// @startlock
	{// @endlock
		$comp.googleMapZoomLevel--;
		var src = $comp.googleMap1 + $comp.googleMapAddress + $comp.googleMap2 + $comp.googleMapZoomLevel + $comp.googleMap3 + $comp.googleMapAddress;
		$(getHtmlObj('googleMapAddress')).attr({ 'src': src, 'data-position': $comp.googleMapAddress });
	};// @lock

	iconZoomIn.click = function iconZoomIn_click (event)// @startlock
	{// @endlock
		$comp.googleMapZoomLevel++;
		var src = $comp.googleMap1 + $comp.googleMapAddress + $comp.googleMap2 + $comp.googleMapZoomLevel + $comp.googleMap3 + $comp.googleMapAddress;
		$(getHtmlObj('googleMapAddress')).attr({ 'src': src, 'data-position': $comp.googleMapAddress });
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
	WAF.addListener(this.id + "_iconZoomOut", "click", iconZoomOut.click, "WAF");
	WAF.addListener(this.id + "_iconZoomIn", "click", iconZoomIn.click, "WAF");
	WAF.addListener(this.id + "_buttonVerify", "click", buttonVerify.click, "WAF");
	WAF.addListener(this.id + "_textZip", "change", textZip.change, "WAF");
	WAF.addListener(this.id + "_textState", "change", textState.change, "WAF");
	WAF.addListener(this.id + "_textCity", "change", textCity.change, "WAF");
	WAF.addListener(this.id + "_textAddress2", "change", textAddress2.change, "WAF");
	WAF.addListener(this.id + "_textAddress1", "change", textAddress1.change, "WAF");
	// @endregion// @endlock

	};// @lock


}// @startlock
return constructor;
})();// @endlock
