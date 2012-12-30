
(function Component (id) {// @lock

// Add the code that needs to be shared between components here

function constructor (id) {

	// @region beginComponentDeclaration// @startlock
	var $comp = this;
	this.name = 'completeBallotDisplay';
	// @endregion// @endlock

	function loadCompleteBallotData() {
		var eQuery0 = 'votes.person.ID = "' + sources.currentPerson.ID + '" order by sortLevel';
		
		$comp.sources.campaign.query(eQuery0, {
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
	var buttonBallotToPDF = {};	// @button
	var dataGridCompleteBallot = {};	// @dataGrid
	// @endregion// @endlock

	loadCompleteBallotData();

	// eventHandlers// @lock

	buttonBallotToPDF.click = function buttonBallotToPDF_click (event)// @startlock
	{// @endlock
		L3.convertBallotToPDF($comp.sources.campaign);
	};// @lock

	dataGridCompleteBallot.onRowDblClick = function dataGridCompleteBallot_onRowDblClick (event)// @startlock
	{// @endlock
		var url = $comp.sources.campaign.candidateURL;
		$$('frameBP').setValue(url);
		$$('frameBP').show();
	};// @lock

	// @region eventManager// @startlock
	WAF.addListener(this.id + "_buttonBallotToPDF", "click", buttonBallotToPDF.click, "WAF");
	WAF.addListener(this.id + "_dataGridCompleteBallot", "onRowDblClick", dataGridCompleteBallot.onRowDblClick, "WAF");
	// @endregion// @endlock

	};// @lock

	this.loaded = true;
}// @startlock
return constructor;
})();// @endlock

if (L3 === undefined) L3 = {};

L3.convertBallotToPDF = function convertBallotToPDF(campaigns) {
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
		doc.setFontSize(14);
		doc.setFontStyle('italic');
		doc.text('Election', param.xCol1 + 1, param.yCoord);
		doc.text('District', param.xCol2 + 1, param.yCoord);
		doc.text('Candidate', param.xCol3 + 1, param.yCoord);
		doc.text('Party', param.xCol4 + 1, param.yCoord);
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
			xCol2: 75,
			xCol3: 105,
			xCol4: 180,
			xCol5: 190,
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
	campaigns.toArray('districtType, districtName, candidateName, candidateParty, incumbent', {
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