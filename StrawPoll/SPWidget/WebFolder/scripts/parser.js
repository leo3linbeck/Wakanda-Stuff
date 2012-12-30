
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var comboboxElectionType = {};	// @combobox
	var comboboxState = {};	// @combobox
	var documentEvent = {};	// @document
	var buttonParseAndShowData = {};	// @button
	var buttonSaveAndLoadNext = {};	// @button
	var buttonLoadPageFromBP = {};	// @button
// @endregion// @endlock

var bpURL = 'http://ballotpedia.org';
var parsing = { type: '', info: [] };
var parsedInfo = [];
parsing.info = parsedInfo;

function clearDashboard() {
	districts.length = 0;
	elections.length = 0;
	candidates.length = 0;
	measures.length = 0;


	source.districts.sync();
	source.elections.sync();
	source.measures.sync();
	source.candidates.sync();
}

function getNextState() {
	source.state.selectNext({
		onSuccess: function(response) {
			loadState();
		},
		onError: function(error) {
			alert(error.message);
		}
	});
}

function goToNextElection() {
	if ($$('checkboxRotateTypes').getValue()) {
		if (source.electionTypes.name == 'Ballot Measures') {
			source.electionTypes.select(0);
			getNextState();
		}
		else {
			source.electionTypes.selectNext();
			loadState();
		}
	}
	else
		getNextState();
}

function saveParsedData() {
	if (parsedInfo.length == 0)
		goToNextElection();
	else {
		bpParse.saveParsedDataAsync({
			onSuccess: function(response) {
				clearDashboard();
				goToNextElection();
			},
			onError: function(error) {
				alert(error.message);
			},
			params: [parsing, false]
		});
	}
}

function parseUSSenate() {
	var c = null;
	
	$('#frameBP-frame').each(function() {
    		c = $('p:contains("General election candidates")+dl>dd', this.contentWindow.document||this.contentDocument);
    	});

    if (c == null)
    	return;
    	
	districts.push( {state: source.state.name, name: 'US Senate - ' + source.state.abbreviation + ' - 1', code: '01', type: 'US Senate'} );
	elections.push( {district: '01', year: 2012, type: 'General Election'} );
	
	campaigns = new Array;
	c.each(function(i, $e) {
		var p = {name: null, url: null, party: null, incumbent: null};
		p.incumbent = false;
		var $c = $($e).children();
		$c.each(function(j, $f) {
			if ($f.tagName == 'A') {
				if ($f.children.length == 0) {
					p.name = $($f).html();
					p.url = $($f).attr('href');
				}
				else {
					p.party = $($f).attr('title');
				}
			}
			else
				p.incumbent = $($f).text().indexOf('Incumbent') != -1;	
		});		
		campaigns.push(p);
		candidates.push(p);
	});

	parsedInfo.push({
		district: districts[districts.length - 1], 
		election: elections[elections.length - 1], 
		campaigns: campaigns
	}); 
}

function parseUSHouse() {
	var body = null;
	
	$('#frameBP-frame').each(function() {
    		body = $('body', this.contentWindow.document||this.contentDocument);
    	});

    if (body == null)
    	return;
    
    var numRaces = body.find('table.wikitable:contains("Partisan Breakdown") th:last').text().trim();
    
    var incumbents = [];
    var $ds = body.find('h3:contains("Incumbents")+p+table>tbody>tr');
    $ds.each(function(n, d) {
    	if (n > 0) {
    		incumbents.push($(d).children().first().text().trim());
    	}
    });
    
    var $ds = body.find('h3:not(h3:contains("Incumbents"))');
    $ds.each(function(n, d) {
    	var $a = $(d).find('span a');
    	var districtName = $a.text()
    	var districtURL = $a.attr('href');
    	var x = ('000' + (n + 1));
    	var districtCode = x.substr(x.length-3);
    	
		districts.push( {state: source.state.name, name: districtName , code: districtCode, type: 'US House'} );
		elections.push( {district: districtCode, year: 2012, type: 'General Election'} );
		
		campaigns = new Array;
		var $cs = $(d).next().next().children();
		$cs.each(function(i, e) {
			var p = {name: null, url: null, party: null, incumbent: null};
			var $c = $(e).children();
			$c.each(function(j, f) {
				if (f.tagName == 'A') {
					if ($(f).children().length == 0) {
						p.name = $(f).html();
						p.incumbent = incumbents.indexOf(p.name) != -1;
						p.url = $(f).attr('href');
					}
					else {
						p.party = $(f).attr('title');
					}
				}
			});	
			if (p.name != null) {
				campaigns.push(p);
				candidates.push(p);
			}
		});

		parsedInfo.push({
			district: districts[districts.length - 1], 
			election: elections[elections.length - 1], 
			campaigns: campaigns
		});     
	});
}

function parseStateExecutive() {
	
}

function parseStateUpper() {
	var body = null;
	
	$('#frameBP-frame').each(function() {
    		body = $('body', this.contentWindow.document||this.contentDocument);
    	});

    if (body == null)
    	return;
    	
    var incumbents = [];
    var temp = body.find('dl dd ul li:contains("Incumbent")').text().split('\n');
    for (var i = 0; i < temp.length; i++)
    	incumbents.push(temp[i].substr(0, temp[i].indexOf(':')).trim());
        
    var $ds = body.find('h2:contains("List of candidates") ~h3');
    $ds.each(function(n, d) {
    	var $a = $(d).find('span');
    	var districtName = $a.text()
    	var x = '000' + /(\d+)/.exec(districtName)[1];
    	var districtCode = x.substr(x.length-3);
    	
		districts.push( {state: source.state.name, name: districtName , code: districtCode, type: 'State Upper Chamber'} );
		elections.push( {district: districtCode, year: 2012, type: 'General Election'} );
		
		campaigns = new Array;
		if (n == ($ds.length - 1))
			var t = $(d).nextUntil('h2');
		else
			var t = $(d).nextUntil('h3')
			
		$cs = $(t).filter('dl').last().children();
			
		$cs.each(function(j, g) {
			var p = {name: null, url: null, party: null, incumbent: null};
			$(g).children().each(function(j, f) {
				if (f.tagName == 'A') {
					if ($(f).children().length == 0) {
						p.name = $(f).html();
						p.incumbent = incumbents.indexOf(p.name) != -1;
						p.url = $(f).attr('href');
					}
					else {
						p.party = $(f).attr('title');
					}
				}
			});	
			if (p.name != null) {
				campaigns.push(p);
				candidates.push(p);
			}
		});

		parsedInfo.push({
			district: districts[districts.length - 1], 
			election: elections[elections.length - 1], 
			campaigns: campaigns
		});     
	});
}

function parseStateLower() {
	var body = null;
	
	$('#frameBP-frame').each(function() {
    		body = $('body', this.contentWindow.document||this.contentDocument);
    	});

    if (body == null)
    	return;
    	
    var incumbents = [];
    var temp = body.find('dl dd ul li:contains("Incumbent")').text().split('\n');
    for (var i = 0; i < temp.length; i++)
    	incumbents.push(temp[i].substr(0, temp[i].indexOf(':')).trim());
        
    var $ds = body.find('h2:contains("List of candidates") ~h3');
    $ds.each(function(n, d) {
    	var $a = $(d).find('span');
    	var districtName = $a.text()
    	var x = '000' + /(\d+)/.exec(districtName)[1];
    	var districtCode = x.substr(x.length-3);
    	
		districts.push( {state: source.state.name, name: districtName , code: districtCode, type: 'State Lower Chamber'} );
		elections.push( {district: districtCode, year: 2012, type: 'General Election'} );
		
		campaigns = new Array;
		if (n == ($ds.length - 1))
			var t = $(d).nextUntil('h2');
		else
			var t = $(d).nextUntil('h3')
			
		$cs = $(t).filter('dl').last().children();
			
		$cs.each(function(j, g) {
			var p = {name: null, url: null, party: null, incumbent: null};
			$(g).children().each(function(j, f) {
				if (f.tagName == 'A') {
					if ($(f).children().length == 0) {
						p.name = $(f).html();
						p.incumbent = incumbents.indexOf(p.name) != -1;
						p.url = $(f).attr('href');
					}
					else {
						p.party = $(f).attr('title');
					}
				}
			});
			if (p.name != null) {
				campaigns.push(p);
				candidates.push(p);
			}
		});

		parsedInfo.push({
			district: districts[districts.length - 1], 
			election: elections[elections.length - 1], 
			campaigns: campaigns
		});     
	});
}

function parseBallotMeasures() {
	var c = null;
	
	$('#frameBP-frame').each(function() {
    		c = $('body', this.contentWindow.document||this.contentDocument);
    	});

    if (c == null)
    	return;
   	
   	var m = {};
	var dt = '';
	var b = $(c).find('#On_the_ballot').parent().next().next().nextUntil('h2');
	b.each(function(i, d) {
		if (d.tagName == 'P') {
			dt = $(d).text().trim().replace(':','');
		}
		else {
			$(d).find('tr').each(function(j, r) {
				if (j > 0) {
					m = new Object;
					m.electionDay = dt;
					var f = $(r).find('td');
					m.type = $(f).eq(0).find('a').attr('title');
					m.typeURL = $(f).eq(0).find('a').attr('href');
					m.title = $(f).eq(1).find('a').attr('title');
					m.titleURL = $(f).eq(1).find('a').attr('href');
					m.subject = $(f).eq(2).find('a').attr('title');
					m.subjectURL = $(f).eq(2).find('a').attr('href');
					m.description = $(f).eq(3).html().trim();
					measures.push(m);
				}
			});
		}
	});

	parsedInfo.push({
		state: selectedState,
		measures: measures
	}); 
}

function parseBPPage() {
	districts = new Array;
	elections = new Array;
	candidates = new Array;
	measures = new Array;
	parsedInfo.length = 0;	
	
	parsing.type = 'legislative';
	switch (source.electionTypes.name) {
		case 'US Senate':
			parseUSSenate();
			break;
		case 'US House':
			parseUSHouse();
			break;
		case 'State Executive':
			parseStateExecutive();
			break;
		case 'State Upper Chamber':
			parseStateUpper();
			break;
		case 'State Lower Chamber':
			parseStateLower();
			break;
		case 'Ballot Measures':
			parsing.type = 'ballot measures';
			parseBallotMeasures();
			break;
		default:
			return;
	}
	source.districts.sync();
	source.elections.sync();
	source.candidates.sync();
	source.measures.sync();
}

function parse() {
	parseBPPage();
	return;
}

function reloadPage() {
	var path = $$('textStoredFilePath').getValue();
	var URL = $$('textStoredFileName').getValue();
	$$('frameBP').setValue(path + URL);	
	$$('frameBP').getLabel().setValue(path + URL);
	return;
}

function loadBPPage(x) {
	var URL = bpURL + x.path + source.state.name + x.suffix;
	$$('frameBP').setValue(URL);
	$$('frameBP').getLabel().setValue(URL);
	
	updateBPFilename(x);
}

function getPathAndSuffix() {
	switch (source.electionTypes.name) {
		case 'US Senate':
			var path = '/wiki/index.php/United_States_Senate_elections_in_'
			var suffix = ',_2012';
			break;
		case 'US House':
			var path = '/wiki/index.php/United_States_House_of_Representatives_elections_in_'
			var suffix = ',_2012';
			break;
		case 'State Executive':
			var path = '/wiki/index.php/'
			var suffix = '_state_executive_official_elections,_2012';
			break;
		case 'State Upper Chamber':
			var path = '/wiki/index.php/'
			var suffix = '_State_Senate_elections,_2012';
			break;
		case 'State Lower Chamber':
			var path = '/wiki/index.php/'
			var suffix = '_House_of_Representatives_elections,_2012';
			break;
		case 'Ballot Measures':
			var path = '/wiki/index.php/'
			var suffix = '_2012_ballot_measures';
			break;
		default:
			var path = ''
			var suffix = '';
	}
	
	return ( {path: path, suffix: suffix} );
}
	
function loadState() {
	loadBPPage(getPathAndSuffix());
}

function updateBPFilename(x) {
	var fn = (x.path + source.state.name + x.suffix).replace(/_/g, ' ');
	$$('textStoredFileName').setValue(fn.substr(fn.lastIndexOf('/') + 1) + ' - Ballotpedia.html');	
}

// eventHandlers// @lock

	comboboxElectionType.change = function comboboxElectionType_change (event)// @startlock
	{// @endlock
		updateBPFilename(getPathAndSuffix());
	};// @lock

	comboboxState.change = function comboboxState_change (event)// @startlock
	{// @endlock
		updateBPFilename(getPathAndSuffix());
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		var types = ['US Senate', 'US House', 'State Executive', 'State Upper Chamber', 'State Lower Chamber', 'Ballot Measures'];
		for (var i = 0; i < types.length; i++)
			electionTypes.push({ID: i, name: types[i]});
			
		source.electionTypes.sync();
		selectedState = 1;
		selectedType = 0;
	};// @lock

	buttonParseAndShowData.click = function buttonParseAndShowData_click (event)// @startlock
	{// @endlock
		parse();
	};// @lock

	buttonSaveAndLoadNext.click = function buttonSaveAndLoadNext_click (event)// @startlock
	{// @endlock
		saveParsedData();
	};// @lock

	buttonLoadPageFromBP.click = function buttonLoadPageFromBP_click (event)// @startlock
	{// @endlock
		loadState();
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("comboboxElectionType", "change", comboboxElectionType.change, "WAF");
	WAF.addListener("comboboxState", "change", comboboxState.change, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("buttonParseAndShowData", "click", buttonParseAndShowData.click, "WAF");
	WAF.addListener("buttonSaveAndLoadNext", "click", buttonSaveAndLoadNext.click, "WAF");
	WAF.addListener("buttonLoadPageFromBP", "click", buttonLoadPageFromBP.click, "WAF");
// @endregion
};// @endlock
