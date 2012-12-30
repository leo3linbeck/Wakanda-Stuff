
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var loginDataEntry = {};	// @login
// @endregion// @endlock

// eventHandlers// @lock

	loginDataEntry.logout = function loginDataEntry_logout (event)// @startlock
	{// @endlock
		alert("You are logged out");
	};// @lock

	loginDataEntry.login = function loginDataEntry_login (event)// @startlock
	{// @endlock
		alert("You are logged in");
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("loginDataEntry", "logout", loginDataEntry.logout, "WAF");
	WAF.addListener("loginDataEntry", "login", loginDataEntry.login, "WAF");
// @endregion
};// @endlock
