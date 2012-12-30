
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var buttonLoadMany = {};	// @button
	var buttonLoadOne = {};	// @button
// @endregion// @endlock
	var counter;
	var currentStep;

// region functions
	function parseFrame(callback){
			
		var objdoc=frames[0].window.document
		var URL=objdoc.URL;
		URL=URL.slice(28);
		sources.parsingProfile.query('profileName = :1', {onSuccess: function(event)
        	{// ... handling of query
        		sources.parsingProfile.toArray("xpath",
        		{onSuccess: function(event)
        		{
        			var inarray=event.result;
					for (var i in inarray)
					{var result = objdoc.evaluate(inarray[i], objdoc, null, XPathResult.ANY_TYPE, null );
					var outvar=result.iterateNext ();
					var outarray=[];
					outarray.push(outvar.innerHTML);
						}
					for (e in outarray)
					{
						sources.reparsed.newEntity();
						sources.reparsed.value=outarray[e]
						sources.reparsed.url=URL;
						sources.reparsed.save();
						callback(true); 
					} 
        			}
        			}
        		);
        		
        	}, params: [$('#textFieldProfile').val()]// parameters of query
    		});	

		}
		
function createFrame (URL,callback) {
	var iframe = document.createElement('iframe');
	iframe.frameBorder = 1;
	iframe.width = $("#containerCandidate").width();
	iframe.height = $("#containerCandidate").height();
	iframe.id = "candidate";
	iframe.setAttribute('src',URL);
	iframe.onload = function()
	{
	   parseFrame(function(){
	   document.getElementById("containerCandidate").removeChild(document.getElementById("containerCandidate").firstChild);
	   //var x = createFrame(result[currentStep],function(){callback(true)});
	   callback(true);
	   });
	};
    document.getElementById("containerCandidate").appendChild(iframe)
	
}

function loadFrame(URL) {
	var iframe = document.createElement('iframe');
	iframe.frameBorder = 1;
	iframe.width = $("#containerCandidate").width();
	iframe.height = $("#containerCandidate").height();
	iframe.id = "candidate";
	iframe.setAttribute('src',URL);	
	document.getElementById("containerCandidate").appendChild(iframe)
}


function addRecord(callback) {
		fileManager.getFileNAsync({
		onSuccess: function(result)
		{ 
			
			createFrame(result[0], function(){
			fName=result[0].slice(28);
			callback(fName);
			});			
		},
		params:[false]		
		});
		
			
};

function parseEmAll(inarray){
			var objdoc=frames[0].window.document
			var URL=objdoc.URL;
			URL = URL.slice(28);
			var valArray = [];

			for (var i=0; i<inarray.length;)
			{
			getValue(inarray[i].xpath, objdoc, function(cb) {
				try
				{var vX=cb.iterateNext ();
				var vVal=vX.innerHTML;
				sources.reparsed.newEntity();
				sources.reparsed.name=inarray[i].fieldlabel;
				sources.reparsed.value=vVal
				sources.reparsed.category='State Upper Chamber'
				sources.reparsed.url=URL;
				sources.reparsed.save();
				i++}
				catch(err)
				{
					var x=err;
					i++}
				});
			}
			//alert('done');					
}

function getValue(xpath, objdoc, callback) {
	var vValue = objdoc.evaluate(xpath, objdoc, null, XPathResult.ANY_TYPE, null);
	callback(vValue);
	}

// eventHandlers// @lock

	buttonLoadMany.click = function buttonLoadMany_click (event)// @startlock
	{// @endlock
		setInterval(parseOne, 10000)
	};// @lock

	buttonLoadOne.click = function buttonLoadOne_click (event)// @startlock
	{// @endlock

		parseOne()
		
	};// @lock
	
	function parseOne()
	{
		getFileButton();
		setTimeout(fillBrowser, 1000);
		setTimeout(callParse, 3000);
		setTimeout(callClear, 8000);		
	}
	
	function getFileButton() {
			fileManager.getFileNAsync({onSuccess: function(result)
			{
				$('#textField1').val(result);
			}, params: [false]
				})	
	};
	
function fillBrowser() {
		//$('#buttonLoadOne')
		var URL=$('#textField1').val()
		loadFrame(URL)	
}

function callParse() {
		sources.parsingProfile.query('profileName = :1', {onSuccess: function(event)
        	{// ... handling of query 
				var outarray=[];
				for (var i=0; i < sources.parsingProfile.length; i++) {
					sources.parsingProfile.getElement(i, {onSuccess: function(event){
						outarray.push(event.element);
						}
						
						}
					)
					}
					parseEmAll(outarray);
       		
        	}, params: [$('#textFieldProfile').val()]// parameters of query
    		});	
}

function callClear() {
		document.getElementById("containerCandidate").removeChild(document.getElementById("containerCandidate").firstChild);
		var URL=$('#textField1').val()
		URL=URL.slice(28);
		fileManager.dumpFileN(URL, false)
	}

// @region eventManager// @startlock
	WAF.addListener("buttonLoadMany", "click", buttonLoadMany.click, "WAF");
	WAF.addListener("buttonLoadOne", "click", buttonLoadOne.click, "WAF");
// @endregion
};// @endlock
