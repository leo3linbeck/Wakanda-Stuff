
(function Component (id) {// @lock

// Add the code that needs to be shared between components here

function constructor (id) {

	// @region beginComponentDeclaration// @startlock
	var $comp = this;
	this.name = 'horseRaceDisplay';
	// @endregion// @endlock

	var loadHorseRaceData = function loadHorseRaceData() {
		var s = sources.currentPerson.stateAbbreviation;
		var eQuery0 = '';
		var eQuery1 = '';
		var eQuery2 = '';

		if ($$(getHtmlId('checkboxFederal')).getValue())
			var eQuery1 = 'districtName = POTUS OR districtName = US-' + s + '-* OR districtName = ' + s + '-CD-*';

		if ($$(getHtmlId('checkboxState')).getValue())
			var eQuery2 = 'districtName = ' + s + '-SD-* OR districtName = ' + s + '-HD-*';
		
		if (eQuery1 == '')
			if (eQuery2 == '')
				eQuery0 = 'ID = null';
			else
				eQuery0 = 'electionYear = 2012 AND (' + eQuery2 + ')  order by sortLevel';
		else
			if (eQuery2 == '')
				eQuery0 = 'electionYear = 2012 AND (' + eQuery1 + ')  order by sortLevel';
			else
				eQuery0 = 'electionYear = 2012 AND (' + eQuery1 + ' OR ' + eQuery2 + ')  order by sortLevel';
		
		$comp.sources.campaign.query(eQuery0, {
			onSuccess: function(event) {
					return;
				},
			onError: function(error) {
					alert(error.message);
				}
		});
	}
	
	var doCandidateQuery = function doCandidateQuery() {
		var c = $$(getHtmlId('textCandidateQuery')).getValue();
		if (c == '') {
			loadHorseRaceData();
			return;
		}
		else
			c = '*' + c + '*';
			
		var q = 'electionYear = 2012 AND candidateName = "' + c + '"  order by sortLevel'
		$comp.sources.campaign.query(q, {
			onSuccess: function(event) {
					return;
				},
			onError: function(error) {
					alert(error.message);
				}
		});
	}

	var doDistrictQuery = function doDistrictQuery() {
		var d = $$(getHtmlId('textDistrictQuery')).getValue();
		if (d == '') {
			loadHorseRaceData();
			return;
		}

		var q = 'electionYear = 2012 AND districtName = "' + d + '"  order by sortLevel'
		$comp.sources.campaign.query(q, {
			onSuccess: function(event) {
					return;
				},
			onError: function(error) {
					alert(error.message);
				}
		});
	}

	this.load = function (data) {// @lock

	// @region namespaceDeclaration// @startlock
	var buttonPrintHorseRace = {};	// @button
	var dataGridHorseRace = {};	// @dataGrid
	var buttonFindCandidate = {};	// @button
	var buttonFindDistrict = {};	// @button
	var checkboxLocal = {};	// @checkbox
	var checkboxState = {};	// @checkbox
	var checkboxFederal = {};	// @checkbox
	// @endregion// @endlock

	loadHorseRaceData();

	// eventHandlers// @lock

	buttonPrintHorseRace.click = function buttonPrintHorseRace_click (event)// @startlock
	{// @endlock
		L3.convertHorseRaceToPDF($comp.sources.campaign);
	};// @lock

	dataGridHorseRace.onRowDblClick = function dataGridHorseRace_onRowDblClick (event)// @startlock
	{// @endlock
		var url = $comp.sources.campaign.candidateURL;
		$$('frameBP').setValue(url);
		$$('frameBP').show();
	};// @lock

	buttonFindCandidate.click = function buttonFindCandidate_click (event)// @startlock
	{// @endlock
		doCandidateQuery();
	};// @lock

	buttonFindDistrict.click = function buttonFindDistrict_click (event)// @startlock
	{// @endlock
		doDistrictQuery();
	};// @lock

	checkboxLocal.click = function checkboxLocal_click (event)// @startlock
	{// @endlock
		loadHorseRaceData();
	};// @lock

	checkboxState.click = function checkboxState_click (event)// @startlock
	{// @endlock
		loadHorseRaceData();
	};// @lock

	checkboxFederal.click = function checkboxFederal_click (event)// @startlock
	{// @endlock
		loadHorseRaceData();
	};// @lock

	// @region eventManager// @startlock
	WAF.addListener(this.id + "_buttonPrintHorseRace", "click", buttonPrintHorseRace.click, "WAF");
	WAF.addListener(this.id + "_dataGridHorseRace", "onRowDblClick", dataGridHorseRace.onRowDblClick, "WAF");
	WAF.addListener(this.id + "_buttonFindCandidate", "click", buttonFindCandidate.click, "WAF");
	WAF.addListener(this.id + "_buttonFindDistrict", "click", buttonFindDistrict.click, "WAF");
	WAF.addListener(this.id + "_checkboxLocal", "click", checkboxLocal.click, "WAF");
	WAF.addListener(this.id + "_checkboxState", "click", checkboxState.click, "WAF");
	WAF.addListener(this.id + "_checkboxFederal", "click", checkboxFederal.click, "WAF");
	// @endregion// @endlock

	};// @lock

	getHtmlObj('textCandidateQuery').on('keyup', 
			function (e) {
				if (e.keyCode == 13)
					doCandidateQuery();
			});

	getHtmlObj('textDistrictQuery').on('keyup', 
			function (e) {
				if (e.keyCode == 13)
					doDistrictQuery();
			});

	this.loaded = true;

}// @startlock
return constructor;
})();// @endlock

if (L3 === undefined) L3 = {};

L3.convertHorseRaceToPDF = function convertBallotToPDF(campaigns) {
	var addHeaderToPDF = function addHeaderToPDF(doc, param) {
		doc.setFontSize(24);
		doc.text('StrawPoll™ Sample Ballot', param.xCoord, param.yCoord);
		
		doc.setFontSize(18);
		param.yCoord += param.lineHeight;
		doc.text('For the address:', param.xCoord, param.yCoord);
		
		param.xCoord += 20;
		param.yCoord += param.lineHeight;
		doc.text(param.person.address1, param.xCoord, param.yCoord);
		if(param.person.address2) {
			param.yCoord += param.lineHeight;
			doc.text(param.person.address2, param.xCoord, param.yCoord);
			param.box.y += param.lineHeight;
			param.box.h -= param.lineHeight;
			param.maxLines--;
		}
		param.yCoord += param.lineHeight;
		doc.text(param.person.city + ', ' + param.person.state + '  ' + param.person.zip, param.xCoord, param.yCoord);
		
		param.yCoord += 1.5 * param.lineHeight;
		doc.setFontSize(13);
		doc.setFontStyle('italic');
		doc.text('Election', param.xCol1 + 1, param.yCoord);
		doc.text('District', param.xCol2 + 1, param.yCoord);
		doc.text('Candidate', param.xCol3 + 1, param.yCoord);
		doc.text('Party', param.xCol4 + 1, param.yCoord);
		doc.text('Votes', param.xCol6 + 1, param.yCoord);
		doc.lines([[param.line.x2 + 2, 0]], param.line.x1 - 1, param.yCoord + param.line.y, [1.0, 1.0]);
	}
		
	var initializePDFParams = function initializePDFParams() {
		var p = {
			person: sources.currentPerson,
			lineHeight: 10,
			maxLines: 20,
			xMargin: 20,
			yMargin: 20,
			xCol1: 25,
			xCol2: 65,
			xCol3: 95,
			xCol4: 160,
			xCol5: 165,
			xCol6: 183,
			xCoord: 20,
			yCoord: 20,
			box: {},
			line: {}
		};
		
		p.box = {
			x: 20,
			y: 58,
			h: 220,
			w: 180
		};
		
		p.line = {
			x1: 21,
			x2: 178,
			y: 3
		};
		
		return p;
	}
		
	var resetPDFParams = function resetPDFParams(p) {
		p.xCoord = 20;
		p.yCoord = 20;
	}
		
	var doc = new jsPDF();
	var pdfParams = initializePDFParams();
	
	addHeaderToPDF(doc, pdfParams);
	
	doc.setFontSize(14);
	doc.setFontStyle('normal');
	campaigns.toArray('districtType, districtName, candidateName, candidateParty, incumbent, voteTotal', {
		onSuccess: function(event) {
			var c = event.result;
			var lineNum = 0;
			for (var i = 0; i < c.length; i++) {
				if (lineNum++ > pdfParams.maxLines) {
					doc.rect(pdfParams.box.x, pdfParams.box.y, pdfParams.box.w, pdfParams.box.h);
					doc.addPage();
					resetPDFParams(pdfParams);
					addHeaderToPDF(doc, pdfParams);
					doc.setFontStyle('normal');
					lineNum = 1;
				}
				pdfParams.yCoord += pdfParams.lineHeight;

				doc.text(c[i].districtType.trim(), pdfParams.xCol1, pdfParams.yCoord);
				doc.text(c[i].districtName.trim(), pdfParams.xCol2, pdfParams.yCoord);
				doc.text(c[i].candidateName.trim(), pdfParams.xCol3, pdfParams.yCoord);
				doc.text(c[i].candidateParty.trim(), pdfParams.xCol4, pdfParams.yCoord);
				doc.text((c[i].incumbent?' [I]':''), pdfParams.xCol5, pdfParams.yCoord);
				var v = c[i].voteTotal.toString();
				doc.text(v, pdfParams.xCol6 + 12 - (2 * v.length), pdfParams.yCoord);
				if (lineNum <= pdfParams.maxLines)
					doc.lines([[pdfParams.line.x2, 0]], pdfParams.line.x1, pdfParams.yCoord + pdfParams.line.y, [1.0, 1.0]);
			}
			doc.rect(pdfParams.box.x, pdfParams.box.y, pdfParams.box.w, pdfParams.box.h);
			
			var strWindowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
			var pdfWindow = window.open('', 'Printed Ballot', strWindowFeatures);
			
			doc.output('datauri');
		}
	});
}	