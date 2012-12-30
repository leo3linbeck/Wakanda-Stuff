
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var button1 = {};	// @button
// @endregion// @endlock

// eventHandlers// @lock

// @region eventManager// @startlock
	button1.click = function button1_click (event)// @startlock
	{// @endlock
	alert("start");	
	var mysql = require('waf-mysql');
	var params = {
    	hostname: 'localhost',
    	user: 'root',
    	password: 'sambre1917',
    	database: 'CLA_amit_3',
    	port: 3306,  //3306 by default
    	ssl: true
	};
	var dbconn = mysql.connect(params);
	alert("second");
	if (dbconn.isConnected)
	{alert("hi");}
	else
	{alert("ho");}
	var result=dbconn.execute('SELECT * FROM  a_zips WHERE idZip9=10');
	result;
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("button1", "click", button1.click, "WAF");
// @endregion
};// @endlock
