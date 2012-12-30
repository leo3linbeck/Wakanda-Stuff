
(function Component (id) {// @lock

// Add the code that needs to be shared between components here

function constructor (id) {

	// @region beginComponentDeclaration// @startlock
	var $comp = this;
	this.name = 'electionDisplayAndVoting';
	// @endregion// @endlock

	var buildElection = function buildElection() {
		spFunctions.loadElectionCandidatesAsync({
			onSuccess: function(event) {
				var c = event.candidates;
				var b = $$(getHtmlId('containerBallot'));
				for (var i = 0; i < 12; i++) {
					var cb = $$(getHtmlId('checkbox' + i));
					var icon = $$(getHtmlId('icon' + i));
					var tot = $$(getHtmlId('textVoteTotal' + i));
					if (i < c.length) {
						cb.getLabel().setValue(c[i].candidateName + ' (' + c[i].candidateParty + ')' + ((c[i].incumbent)?' [I]':''));
						cb.candidateID = c[i].ID;
						cb.setValue(c[i].selected);
						icon.bpURL = c[i].url;
						tot.setValue(c[i].votes);
						cb.show();
						icon.show();
						tot.show();
					}
					else {
						cb.getLabel().setValue('');
						cb.candidateID = null;
						cb.uncheck();
						icon.bpURL = '';
						tot.setValue(0);
						cb.hide();
						icon.hide();
						tot.hide();
					}
				}
				if ($comp.sources.election.numberOfReps == 0)
					$$(getHtmlId('textSelectNum')).setValue('Election details not found');

				b.show();
			},
			onError: function(error) {
				var b = $$(getHtmlId('containerBallot'));
				for (var i = 0; i < 12; i++) {
					var cb = $$(getHtmlId('checkbox' + i));
					var icon = $$(getHtmlId('icon' + i));
					var tot = $$(getHtmlId('textVoteTotal' + i));
					cb.getLabel().setValue('');
					cb.candidateID = null;
					icon.bpURL = '';
					tot.setValue(0);
					cb.hide();
					icon.hide();
					tot.hide();
				}
				$$(getHtmlId('textSelectNum')).setValue('Election not found');
			},
			params: [ sources.currentPerson.ID, $comp.sources.election.ID, false ]
		});
	}
	
	var loadElectionData = function loadElectionData() {
		var s = sources.currentPerson.stateAbbreviation;
		
		if ($$(getHtmlId('checkboxLimitToAddress')).getValue()) {
			var cd = sources.currentPerson.houseDistrictName;
			var sd = sources.currentPerson.stateUpperDistrictName;
			var hd = sources.currentPerson.stateLowerDistrictName;
			var eQuery0 = 'year = 2012 AND (districtName = POTUS OR districtName = "US-' + s + '-1" OR districtName = "' + cd + '" OR districtName = "' + sd + '" OR districtName = "' + hd + '") order by sortLevel';
		}
		else
			var eQuery0 = 'year = 2012 AND (districtName = POTUS OR stateAbbreviation = "' + s + '")  order by sortLevel';

		$comp.sources.election.query(eQuery0, {
			onSuccess: function(event) {
					buildElection();
				},
			onError: function(error) {
					alert(error.message);
				}
		});
	}
	
	var getBPPage = function getBPPage(icon) {
		$$('frameBP').setValue(icon.bpURL);
		$$('frameBP').show();
	}
	
	var updateVotes = function updateVotes() {
		var b = $$(getHtmlId('containerBallot'));
		var r = [];
		
		for (var i = 0; i < 12; i++) {
			var w = $$(getHtmlId('checkbox' + i));
			if (w.kind == 'checkbox' && w.isVisible()) {
				r.push({
					candidateID: w.candidateID,
					selected: w.getValue()
				});
			}
		}
		
		spFunctions.updateVoteInfoAsync({
			onSuccess: function(response) {
				return;
			},
			onError: function(error) {
				alert(error.message);
			},
			params: [ sources.currentPerson.ID, r, false ]	
		});
	}

	var processCheckboxClick = function processCheckboxClick(cb) {
		if (cb.getValue()) {
			var maxChecks = $comp.sources.election.numberOfReps;
			for (var i = 0; i < 12; i++) {
				var c = $$(getHtmlId('checkbox' + i));
				var tot = $$(getHtmlId('textVoteTotal' + i));
				if (c == cb)
					tot.setValue(Number(tot.getValue()) + 1);
				else {
					if (c.getValue())
						if (maxChecks > 1)
							maxChecks--;
						else {
							c.uncheck();
							tot.setValue(Number(tot.getValue()) - 1);
						}
				}
			}
		}
		else {
			var tot = $$(getHtmlId('textVoteTotal' + cb.id.substr(getHtmlId('checkbox').length)));
			tot.setValue(Number(tot.getValue()) - 1);
		}
		updateVotes();
	}

	this.load = function (data) {// @lock

	// @region namespaceDeclaration// @startlock
	var checkboxLimitToAddress = {};	// @checkbox
	var dataGridElection = {};	// @dataGrid
	var checkbox0 = {};	// @checkbox
	var icon0 = {};	// @icon
	var checkbox11 = {};	// @checkbox
	var icon11 = {};	// @icon
	var checkbox10 = {};	// @checkbox
	var icon10 = {};	// @icon
	var checkbox9 = {};	// @checkbox
	var icon9 = {};	// @icon
	var checkbox8 = {};	// @checkbox
	var icon8 = {};	// @icon
	var checkbox7 = {};	// @checkbox
	var icon7 = {};	// @icon
	var checkbox6 = {};	// @checkbox
	var icon6 = {};	// @icon
	var checkbox5 = {};	// @checkbox
	var icon5 = {};	// @icon
	var checkbox4 = {};	// @checkbox
	var icon4 = {};	// @icon
	var checkbox3 = {};	// @checkbox
	var icon3 = {};	// @icon
	var checkbox2 = {};	// @checkbox
	var icon2 = {};	// @icon
	var checkbox1 = {};	// @checkbox
	var icon1 = {};	// @icon
	// @endregion// @endlock

	loadElectionData();

	// eventHandlers// @lock

	checkboxLimitToAddress.click = function checkboxLimitToAddress_click (event)// @startlock
	{// @endlock
		loadElectionData();
	};// @lock

	dataGridElection.onRowClick = function dataGridElection_onRowClick (event)// @startlock
	{// @endlock
		buildElection();
	};// @lock

	checkbox0.click = function checkbox0_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	icon0.click = function icon0_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock

	checkbox11.click = function checkbox11_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	icon11.click = function icon11_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock

	checkbox10.click = function checkbox10_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	icon10.click = function icon10_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock

	checkbox9.click = function checkbox9_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	icon9.click = function icon9_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock

	checkbox8.click = function checkbox8_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	icon8.click = function icon8_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock

	checkbox7.click = function checkbox7_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	icon7.click = function icon7_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock

	checkbox6.click = function checkbox6_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	icon6.click = function icon6_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock

	checkbox5.click = function checkbox5_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	icon5.click = function icon5_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock

	checkbox4.click = function checkbox4_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	icon4.click = function icon4_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock

	checkbox3.click = function checkbox3_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	icon3.click = function icon3_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock

	checkbox2.click = function checkbox2_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	icon2.click = function icon2_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock

	checkbox1.click = function checkbox1_click (event)// @startlock
	{// @endlock
		processCheckboxClick(this);
	};// @lock

	icon1.click = function icon1_click (event)// @startlock
	{// @endlock
		getBPPage(this);
	};// @lock

	// @region eventManager// @startlock
	WAF.addListener(this.id + "_checkboxLimitToAddress", "click", checkboxLimitToAddress.click, "WAF");
	WAF.addListener(this.id + "_dataGridElection", "onRowClick", dataGridElection.onRowClick, "WAF");
	WAF.addListener(this.id + "_checkbox0", "click", checkbox0.click, "WAF");
	WAF.addListener(this.id + "_icon0", "click", icon0.click, "WAF");
	WAF.addListener(this.id + "_checkbox11", "click", checkbox11.click, "WAF");
	WAF.addListener(this.id + "_icon11", "click", icon11.click, "WAF");
	WAF.addListener(this.id + "_checkbox10", "click", checkbox10.click, "WAF");
	WAF.addListener(this.id + "_icon10", "click", icon10.click, "WAF");
	WAF.addListener(this.id + "_checkbox9", "click", checkbox9.click, "WAF");
	WAF.addListener(this.id + "_icon9", "click", icon9.click, "WAF");
	WAF.addListener(this.id + "_checkbox8", "click", checkbox8.click, "WAF");
	WAF.addListener(this.id + "_icon8", "click", icon8.click, "WAF");
	WAF.addListener(this.id + "_checkbox7", "click", checkbox7.click, "WAF");
	WAF.addListener(this.id + "_icon7", "click", icon7.click, "WAF");
	WAF.addListener(this.id + "_checkbox6", "click", checkbox6.click, "WAF");
	WAF.addListener(this.id + "_icon6", "click", icon6.click, "WAF");
	WAF.addListener(this.id + "_checkbox5", "click", checkbox5.click, "WAF");
	WAF.addListener(this.id + "_icon5", "click", icon5.click, "WAF");
	WAF.addListener(this.id + "_checkbox4", "click", checkbox4.click, "WAF");
	WAF.addListener(this.id + "_icon4", "click", icon4.click, "WAF");
	WAF.addListener(this.id + "_checkbox3", "click", checkbox3.click, "WAF");
	WAF.addListener(this.id + "_icon3", "click", icon3.click, "WAF");
	WAF.addListener(this.id + "_checkbox2", "click", checkbox2.click, "WAF");
	WAF.addListener(this.id + "_icon2", "click", icon2.click, "WAF");
	WAF.addListener(this.id + "_checkbox1", "click", checkbox1.click, "WAF");
	WAF.addListener(this.id + "_icon1", "click", icon1.click, "WAF");
	// @endregion// @endlock

	};// @lock

	this.loaded = true;
}// @startlock
return constructor;
})();// @endlock
