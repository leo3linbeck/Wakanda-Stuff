
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var buttonRegister = {};	// @button
// @endregion// @endlock

// eventHandlers// @lock

	buttonRegister.click = function buttonRegister_click (event)// @startlock
	{// @endlock
		// pass the registration to the protected method
		var RegObj = sources.registration_object;
		//debugger;
		

		// check to see if the required fields are filled
		if (!Checkfields())
			{return;};
				
		//see if it passes validation
		/*
		sesesionStorage is deprecated
		var regType=sessionStorage['partner'];*/
		
		var regType="partner";
		// ds.PartnerUsers.registration("ms", "mildred", "password", "mildred", "jefferson", "partner");
		if(ds.PartnerUsers.registration(RegObj.title, RegObj.username, RegObj.password, RegObj.firstName, RegObj.lastName, regType))
			{   
				window.location.href = '/Utility/DataEntry.html';
			}
		else
			{alert("There is already a user with that name");};
	};// @lock
	
	function Checkfields()
	{
		var Input = true;
		if ($('#textTitle').val()=='') {
			$('#textTitle').css("background-color","red");
			Input = Input && false;
			};		
		if ($('#textFirstName').val()=='') {
			$('#textFirstName').css("background-color","red");
			Input = Input && false;
			};
		if ($('#textLastName').val()=='') {
			$('#textLastName').css("background-color","red");
			Input = Input && false;
			};
		if ($('#textUsername').val()=='') {
			$('#textUsername').css("background-color","red");
			Input = Input && false;
			};
		if ($('#textPassword').val()=='') {
			$('#textPassword').css("background-color","red");
			Input = Input && false;
			};									
		return Input;
			
	};

// @region eventManager// @startlock
	WAF.addListener("buttonRegister", "click", buttonRegister.click, "WAF");
// @endregion
};// @endlock
