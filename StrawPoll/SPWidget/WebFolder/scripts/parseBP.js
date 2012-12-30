
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var textParty = {};	// @textField
	var textType = {};	// @textField
	var textYear = {};	// @textField
	var textDistrict = {};	// @textField
	var cbSpecial = {};	// @checkbox
	var cbRunoff = {};	// @checkbox
	var cbGeneral = {};	// @checkbox
	var cbPrimary = {};	// @checkbox
	var cbContested = {};	// @checkbox
	var cbFilter = {};	// @checkbox
	var buttonDownloadStateHouseData = {};	// @button
	var buttonProgressStop = {};	// @button
// @endregion// @endlock

// eventHandlers// @lock

	textParty.change = function textParty_change (event)// @startlock
	{// @endlock
		changeFilter();
	};// @lock

	textType.change = function textType_change (event)// @startlock
	{// @endlock
		changeFilter();
	};// @lock

	textYear.change = function textYear_change (event)// @startlock
	{// @endlock
		changeFilter();
	};// @lock

	textDistrict.change = function textDistrict_change (event)// @startlock
	{// @endlock
		changeFilter();
	};// @lock

	cbSpecial.change = function cbSpecial_change (event)// @startlock
	{// @endlock
		changeFilter();
	};// @lock

	cbRunoff.change = function cbRunoff_change (event)// @startlock
	{// @endlock
		changeFilter();
	};// @lock

	cbGeneral.change = function cbGeneral_change (event)// @startlock
	{// @endlock
		changeFilter();
	};// @lock

	cbPrimary.change = function cbPrimary_change (event)// @startlock
	{// @endlock
		changeFilter();
	};// @lock

	cbContested.change = function cbContested_change (event)// @startlock
	{// @endlock
		changeFilter();
	};// @lock

	function filterData() {
		var queryString = '';
		
		if ($$('textDistrict').getValue() != '')
			queryString += (queryString == '' ? '' : ' AND ') + 'election.district.name = "' + $$('textDistrict').getValue() + WAF.wildchar + '"';
		if ($$('textYear').getValue() != '')
			queryString += (queryString == '' ? '' : ' AND ') + 'election.year = ' + $$('textYear').getValue();
		if ($$('textType').getValue() != '')
			queryString += (queryString == '' ? '' : ' AND ') + 'election.type = "' + $$('textType').getValue() + WAF.wildchar + '"';
		if ($$('textParty').getValue() != '')
			queryString += (queryString == '' ? '' : ' AND ') + 'election.party.name = "' + $$('textParty').getValue() + WAF.wildchar + '"';
			
		if ($$('cbContested').getValue() == true)
			queryString += (queryString == '' ? '' : ' AND ') + 'election.contested = true';
		if ($$('cbPrimary').getValue() == true)
			queryString += (queryString == '' ? '' : ' AND ') + 'election.primary = true';
		if ($$('cbGeneral').getValue() == true)
			queryString += (queryString == '' ? '' : ' AND ') + 'election.general = true';
		if ($$('cbRunoff').getValue() == true)
			queryString += (queryString == '' ? '' : ' AND ') + 'election.runoff = true';
		if ($$('cbSpecial').getValue() == true)
			queryString += (queryString == '' ? '' : ' AND ') + 'election.special = true';
		
		source.election.query(queryString);
	}
	
	function changeFilter() {
		if ($$('cbFilter').getValue() == true)
			filterData();
		else
			source.election.all();
	}

	cbFilter.change = function cbFilter_change (event)// @startlock
	{// @endlock
		changeFilter();
	};// @lock

	buttonDownloadStateHouseData.click = function buttonDownloadStateHouseData_click (event)// @startlock
	{// @endlock
		// the progress bar is gone
		//$$('richText1').setValue('Processing...');
    	//$$("progressBar1").startListening();
        ParseBP.bpDownloadStateHouseDataAsync({
			'onSuccess': function (result) {
				//$$("progressBar1").stopListening();
				if (result == '2010')
                	//$$('richText1').setValue('Success');
				else
                	//$$('richText1').setValue('Failure');
			},
			'onError': function (error) {
				//$$('richText1').setValue('Error');
			},
			'params': [$$('comboboxYear').getValue()]
		});
	};// @lock

	buttonProgressStop.click = function buttonProgressStop_click (event)// @startlock
	{// @endlock
		//$$("progressBar1").userBreak(); // send request to interrupt
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("textParty", "change", textParty.change, "WAF");
	WAF.addListener("textType", "change", textType.change, "WAF");
	WAF.addListener("textYear", "change", textYear.change, "WAF");
	WAF.addListener("textDistrict", "change", textDistrict.change, "WAF");
	WAF.addListener("cbSpecial", "change", cbSpecial.change, "WAF");
	WAF.addListener("cbRunoff", "change", cbRunoff.change, "WAF");
	WAF.addListener("cbGeneral", "change", cbGeneral.change, "WAF");
	WAF.addListener("cbPrimary", "change", cbPrimary.change, "WAF");
	WAF.addListener("cbContested", "change", cbContested.change, "WAF");
	WAF.addListener("cbFilter", "change", cbFilter.change, "WAF");
	WAF.addListener("buttonDownloadStateHouseData", "click", buttonDownloadStateHouseData.click, "WAF");
	WAF.addListener("buttonProgressStop", "click", buttonProgressStop.click, "WAF");
// @endregion
};// @endlock
