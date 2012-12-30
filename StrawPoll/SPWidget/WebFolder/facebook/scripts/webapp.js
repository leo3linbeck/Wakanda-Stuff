
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var dataGridSelect = {};	// @dataGrid
	var documentEvent = {};	// @document
// @endregion// @endlock

	function setDisplayedData() {
		$$('frameBP').hide();
		if (L3.currentPage == '')
			L3.currentPage = 'containerAddress';
		switch (source.arraySelect.name) {
			case 'address':
				L3.slideRightGrid('arraySelect');
				break;
			case 'election':
				if (! $$('componentElection').loaded)
					$$('componentElection').loadComponent();
				L3.slideRightGrid('arraySelect');
				break;
			case 'completeBallot':
				if (! $$('componentCompleteBallot').loaded)
					$$('componentCompleteBallot').loadComponent();
				L3.slideRightGrid('arraySelect');
				break;
			case 'horseRace':
				if (! $$('componentHorseRace').loaded)
					$$('componentHorseRace').loadComponent();
				L3.slideRightGrid('arraySelect');
				break;
			case 'share':
				L3.slideRightGrid('arraySelect');
				break;
			case 'email':
				if (! $$('componentEmail').loaded)
					$$('componentEmail').loadComponent();
				L3.slideRightGrid('arraySelect');
				break;
			case 'maintenance':
				if (! $$('componentMaintenance').loaded)
					$$('componentMaintenance').loadComponent();
				L3.slideRightGrid('arraySelect');
				break;
		}
	}
	
// eventHandlers// @lock

	dataGridSelect.onRowClick = function dataGridSelect_onRowClick (event)// @startlock
	{// @endlock
		setDisplayedData();
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		arraySelect.push( { id: 0, name: 'address', label: 'Address', page: 'containerAddress', action: {} } );
		sources.arraySelect.sync();

		$$('componentAddress').loadComponent();
		$$('containerAddress').show();
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("dataGridSelect", "onRowClick", dataGridSelect.onRowClick, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
