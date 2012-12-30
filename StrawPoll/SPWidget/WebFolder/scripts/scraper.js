
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var buttonscrape = {};	// @button
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	buttonscrape.click = function buttonscrape_click (event)// @startlock
	{// @endlock
		//debugger;
		$.getJSON("http://www.ballotpedia.org/wiki/index.php/United_States_Senate_elections,_2012",
			function(data)
			{
				debugger;
				$.each(data.items, function(item)
				{
					$("<p/>").value().appendTo("#data");

				}
				
				);
			}
		);
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		// Add your code here
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("buttonscrape", "click", buttonscrape.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
