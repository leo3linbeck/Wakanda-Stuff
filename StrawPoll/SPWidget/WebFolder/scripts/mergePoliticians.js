
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var textTertiaryID = {};	// @textField
	var textSecondaryID = {};	// @textField
	var textNameSearch = {};	// @textField
	var textPrimaryID = {};	// @textField
	var buttonMerge = {};	// @button
	var buttonReduceSelection = {};	// @button
	var documentEvent = {};	// @document
	var buttonNameSearch = {};	// @button
// @endregion// @endlock

	function candidateNameSearch() {
		var name = $$('textNameSearch').getValue();
		sources.campaign.query('candidateName = "' + name + '"', {
			onSuccess: function(event) {
				return;
			},
			onError: function(error) {
				return;
			}
		});
	}
	
	function validateEntries() {
		var data = {};
		data.primaryID = $$('textPrimaryID').getValue();
		if (data.primaryID === undefined || data.primaryID === null || data.primaryID === '')
			return showValidationError('You must enter a Primary ID.');
		
		data.secondaryID = $$('textSecondaryID').getValue();
		data.tertiaryID = $$('textTertiaryID').getValue();
		var s = selectedRows = $$('dataGridMergeCampaigns').getSelectedRows();
		var c = sources.campaign.length;
		if (c < 2)
			return showValidationError('You must select at least 2 rows in order to merge.');

		if (c > 10)
			return showValidationError('You can merge no more than 10 rows at a time.');

		if (c != s.length)
			return showValidationError('You must select every row before merging. Use Reduce Selection to narrow list, select all rows, and try again.');
		
		return data;
	}

	function showValidationError(msg) {
		$$('textSearchError').setValue(msg);
		return false;
	}

	function clearValidationError() {
		$$('textSearchError').setValue('');
	}

	function mergeEntries(data) {
		sources.campaign.merge({
				onSuccess: function(event) {
					console.log('mergeCampaigns succeeded', event);
					showValidationError(event.result.msg);
				},
				onError: function(error) {
					console.log('mergeCampaigns failed', error);
					showValidationError(error.msg);
				}
			}, data
		);
	}


// eventHandlers// @lock

	textTertiaryID.change = function textTertiaryID_change (event)// @startlock
	{// @endlock
		clearValidationError();
	};// @lock

	textSecondaryID.change = function textSecondaryID_change (event)// @startlock
	{// @endlock
		clearValidationError();
	};// @lock

	textNameSearch.change = function textNameSearch_change (event)// @startlock
	{// @endlock
		clearValidationError();
	};// @lock

	textPrimaryID.change = function textPrimaryID_change (event)// @startlock
	{// @endlock
		clearValidationError();
	};// @lock

	buttonMerge.click = function buttonMerge_click (event)// @startlock
	{// @endlock
		clearValidationError();
		var data = validateEntries();
		if (data)
			mergeEntries(data);
	};// @lock

	buttonReduceSelection.click = function buttonReduceSelection_click (event)// @startlock
	{// @endlock
		clearValidationError();
		$$('dataGridMergeCampaigns').reduceToSelected({
			onSuccess: function(event) {
				return;
			},
			onError: function(error) {
				return;
			}
		});
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		$('#textNameSearch').on('keyup', 
		function (e) {
			if (e.keyCode == 13)
			candidateNameSearch();
		});
		clearValidationError();
	};// @lock

	buttonNameSearch.click = function buttonNameSearch_click (event)// @startlock
	{// @endlock
		clearValidationError();
		candidateNameSearch();
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("textTertiaryID", "change", textTertiaryID.change, "WAF");
	WAF.addListener("textSecondaryID", "change", textSecondaryID.change, "WAF");
	WAF.addListener("textNameSearch", "change", textNameSearch.change, "WAF");
	WAF.addListener("textPrimaryID", "change", textPrimaryID.change, "WAF");
	WAF.addListener("buttonMerge", "click", buttonMerge.click, "WAF");
	WAF.addListener("buttonReduceSelection", "click", buttonReduceSelection.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("buttonNameSearch", "click", buttonNameSearch.click, "WAF");
// @endregion
};// @endlock
