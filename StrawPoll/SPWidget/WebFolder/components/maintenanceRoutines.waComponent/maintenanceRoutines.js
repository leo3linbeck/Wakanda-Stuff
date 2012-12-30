
(function Component (id) {// @lock

// Add the code that needs to be shared between components here

function constructor (id) {

	// @region beginComponentDeclaration// @startlock
	var $comp = this;
	this.name = 'maintenanceRoutines';
	// @endregion// @endlock

	this.load = function (data) {// @lock

	// @region namespaceDeclaration// @startlock
	var buttonRepairAllLinks = {};	// @button
	// @endregion// @endlock

	// eventHandlers// @lock

	buttonRepairAllLinks.click = function buttonRepairAllLinks_click (event)// @startlock
	{// @endlock
		L3.repairAllLinks();
	};// @lock

	// @region eventManager// @startlock
	WAF.addListener(this.id + "_buttonRepairAllLinks", "click", buttonRepairAllLinks.click, "WAF");
	// @endregion// @endlock

	};// @lock


}// @startlock
return constructor;
})();// @endlock

L3.repairAllLinks = function repairAllLinks() {
	var repairElectionLinks = function() {
		
	}
	
	repairElectionLinks();
}