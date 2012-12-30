
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var textStateAbbr = {};	// @textField
	var buttonRefresh = {};	// @button
	var documentEvent = {};	// @document
// @endregion// @endlock

var STATE_LIST = {
	'AL': [1, 'Alabama'],
	'AK': [2, 'Alaska'],
	'AZ': [4, 'Arizona'],
	'AR': [5, 'Arkansas'],
	'CA': [6, 'California'],
	'CO': [8, 'Colorado'],
	'CT': [9, 'Connecticut'],
	'DE': [10, 'Delaware'],
	'FL': [12, 'Florida'],
	'GA': [13, 'Georgia'],
	'HI': [15, 'Hawaii'],
	'ID': [16, 'Idaho'],
	'IL': [17, 'Illinois'],
	'IN': [18, 'Indiana'],
	'IA': [19, 'Iowa'],
	'KS': [20, 'Kansas'],
	'KY': [21, 'Kentucky'],
	'LA': [22, 'Louisiana'],
	'ME': [23, 'Maine'],
	'MD': [24, 'Maryland'],
	'MA': [25, 'Massachusetts'],
	'MI': [26, 'Michigan'],
	'MN': [27, 'Minnesota'],
	'MS': [28, 'Mississippi'],
	'MO': [29, 'Missouri'],
	'MT': [30, 'Montana'],
	'NE': [31, 'Nebraska'],
	'NV': [32, 'Nevada'],
	'NH': [33, 'New Hampshire'],
	'NJ': [34, 'New Jersey'],
	'NM': [35, 'New Mexico'],
	'NY': [36, 'New York'],
	'NC': [37, 'North Carolina'],
	'ND': [38, 'North Dakota'],
	'OH': [39, 'Ohio'],
	'OK': [40, 'Oklahoma'],
	'OR': [41, 'Oregon'],
	'PA': [42, 'Pennsylvania'],
	'RI': [44, 'Rhode Island'],
	'SC': [45, 'South Carolina'],
	'SD': [46, 'South Dakota'],
	'TN': [47, 'Tennessee'],
	'TX': [48, 'Texas'],
	'UT': [49, 'Utah'],
	'VT': [50, 'Vermont'],
	'VA': [51, 'Virginia'],
	'WA': [53, 'Washington'],
	'WV': [54, 'West Virginia'],
	'WI': [55, 'Wisconsin'],
	'WY': [56, 'Wyoming'],
	'DC': [11, 'District of Columbia'],
	'PR': [72, 'Puerto Rico']
};
	function dashboardRefresh() {
	sources.person.all({
		onSuccess: function(event) {
			numberOfUsers = event.dataSource.length;
			sources.numberOfUsers.sync();
		},
		onError: function(error) {
			
		}
	});
	
	sources.vote.all({
		onSuccess: function(event) {
			numberOfVotesCast = event.dataSource.length;
			sources.numberOfVotesCast.sync();
		},
		onError: function(error) {
			
		}
	});
	
	sources.election.all({
		onSuccess: function(event) {
			numberOfElections = event.dataSource.length;
			sources.numberOfElections.sync();
		},
		onError: function(error) {
			
		}
	});
	
	sources.politician.all({
		onSuccess: function(event) {
			numberOfCandidates = event.dataSource.length;
			sources.numberOfCandidates.sync();
		},
		onError: function(error) {
			
		}
	});
	
	sources.ballotMeasure.all({
		onSuccess: function(event) {
			numberOfBallotMeasures = event.dataSource.length;
			sources.numberOfBallotMeasures.sync();
		},
		onError: function(error) {
			
		}
	});
	
	sources.socialProfile.all({
		onSuccess: function(event) {
			numberOfSocialProfiles = event.dataSource.length;
			sources.numberOfSocialProfiles.sync();
		},
		onError: function(error) {
			
		}
	});
	
	sources.campaign.query('districtType = "presidential" order by voteTotal desc', {
		onSuccess: function(event) {
			
		},
		onError: function(error) {
			
		}
	});
	
	var state = $$('textStateAbbr').getValue();
	if (state == '') {
		sources.vote.query('candidate.ID = 13', {
			onSuccess: function(event) {
				var o = event.dataSource.length;
				$$('textObamaTotals').setValue(o);
				sources.vote.query('candidate.ID = 14', {
					onSuccess: function(event) {
						var r = event.dataSource.length;
						$$('textRomneyTotals').setValue(r);
						$$('textObamaPercent').setValue(String(100 * o / (o + r)).substr(0,4) + '%');
						$$('textRomneyPercent').setValue(String(100 * r / (o + r)).substr(0,4) + '%');
					},
					onError: function(error) {
						
					}
				});
			},
			onError: function(error) {
				
			}
		});
	}
	else {
		sources.vote.query('candidate.ID = 13 AND person.state = "' + state + '"', {
			onSuccess: function(event) {
				var o = event.dataSource.length;
				$$('textObamaTotals').setValue(o);
				sources.vote.query('candidate.ID = 14 AND person.state = "' + state + '"', {
					onSuccess: function(event) {
						var r = event.dataSource.length;
						$$('textRomneyTotals').setValue(r);
						$$('textObamaPercent').setValue(String(100 * o / (o + r)).substr(0,4) + '%');
						$$('textRomneyPercent').setValue(String(100 * r / (o + r)).substr(0,4) + '%');
					},
					onError: function(error) {
						
					}
				});
			},
			onError: function(error) {
				
			}
		});
	}
}

// eventHandlers// @lock

	textStateAbbr.change = function textStateAbbr_change (event)// @startlock
	{// @endlock
		dashboardRefresh();
	};// @lock

	buttonRefresh.click = function buttonRefresh_click (event)// @startlock
	{// @endlock
		dashboardRefresh();
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		dashboardRefresh();
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("textStateAbbr", "change", textStateAbbr.change, "WAF");
	WAF.addListener("buttonRefresh", "click", buttonRefresh.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
