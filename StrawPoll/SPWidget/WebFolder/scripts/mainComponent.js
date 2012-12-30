
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var homeButton = {};	// @buttonImage
// @endregion// @endlock


// eventHandlers// @lock

	homeButton.click = function homeButton_click ()// @startlock
	{// @endlock
		L3.homeButtonClick();
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("homeButton", "click", homeButton.click, "WAF");
// @endregion
};// @endlock
