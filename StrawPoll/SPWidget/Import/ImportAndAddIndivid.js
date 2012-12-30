/**

* @author richard r fernandez

*/

var dataClassName="Election";
var importFileName="8_Election.txt";

function deleteAllModels (dataClassName) {
	
	var counter;
	for (var vName in ds.dataClasses)  // put each datastore class of ds
	{
		if (vName == dataClassName)
		{
		counter=ds.dataClasses[vName];
		counter.remove();
		}
	};	
	return true;
	};
	
function setAutoSequence (dataClassName) {
	
	var counter;
	for (var vName in ds.dataClasses)  // put each datastore class of ds
	{
		if (vName == dataClassName)
		{
		counter=ds.dataClasses[vName];
		counter.setAutoSequenceNumber(1);
		}
	};	
	return true;
	};
	
function importAllFixedData()
{
	
	var fixedFolderPath = ds.getModelFolder().path + "Fixed_import_data";
	var fixedFolder=Folder(fixedFolderPath);
	var fixedfiles= fixedFolder.files;
	
	for(var i=0; i<fixedfiles.length; i++)
		if (fixedfiles[i].name == importFileName)
        {chooseFilesAndExecute(fixedfiles[i]);}
    
	return true;
};

function importAllZipData()
{
	
	var zipFolderPath = ds.getModelFolder().path + "ZipData";
	var zipFolder=Folder(zipFolderPath);
	var zipSubFolders =zipFolder.folders;
	for (var i=0;i<zipSubFolders.length; i++)
		{
			var zipfiles= zipSubFolders[i].files;
	
			for(var j=0; j<zipfiles.length; j++)
        	{executeZipImport(zipfiles[j]);}
       	}
	return true;
};

function chooseFilesAndExecute(importfileName)
{
	switch(importfileName.name)
	{
	case "1_State.txt":
		State_Import(importfileName.path)
		break;
	case "2_District.txt":
		District_Import(importfileName.path)
		break;
	case "3_CongressionalDistrict.txt":
		CongressionalDistrict_Import(importfileName.path)
		break;
	case "4_StateUpperDistrict.txt":
		StateUpperDistrict_Import(importfileName.path)
		break;
	case "5_StateLowerDistrict.txt":
		StateLowerDistrict_Import(importfileName.path)
		break;
	case "6_Party.txt":
		Party_Import(importfileName.path)
		break;
	case "7_Politician.txt":
		Politician_Import(importfileName.path)
		break;
	case "8_Election.txt":
		Election_Import(importfileName.path)
		break;
	case "9_Campaign.txt":
		Campaign_Import(importfileName.path)
		break;
	case "10_Zip9.txt":
		//Zip9_Import(importfileName.path)
		break;
	case "Voter.txt":
		//Voter_Import(importfileName.path)
		break;		
	default:
		var x="error";
	}
};

function Voter_Import(importfile)
{
	var lines = loadText(importfile).split("\n");
	var columns = [];
	lines.forEach(function(oneLine) { 
	columns = oneLine.split("\t");
	        theVoter = new ds.Voter({
			ID:columns[0],
			zipCode:columns[1],
			congressionalDistrict:columns[2],
			stateUpperDistrict:columns[3],
			stateLowerDistrict:columns[4]
         	});
    theVoter.save();
	})
	
		return true;
};

function Zip9_Import(importfile)
{
	var lines = loadText(importfile).split("\n");
	var columns = [];
	lines.forEach(function(oneLine) { 
	columns = oneLine.split("\t");
	        theZip9 = new ds.Zip9({
			ID:columns[0],
			zipCode:columns[1],
			congressionalDistrict:columns[2],
			stateUpperDistrict:columns[3],
			stateLowerDistrict:columns[4]
         	});
    theZip9.save();
	})
	
		return true;
};

function Campaign_Import(importfile)
{
	var lines = loadText(importfile).split("\n");
	var columns = [];
	lines.forEach(function(oneLine) { 
	columns = oneLine.split("\t");
	        theCampaign = new ds.Campaign({
			ID:columns[0],
			politician:columns[1],
			election:columns[2],
			incumbent:columns[3]
         	});
    theCampaign.save();
	})
	
		return true;
};

function Election_Import(importfile)
{
	var lines = loadText(importfile).split("\n");
	var columns = [];
	lines.forEach(function(oneLine) { 
	columns = oneLine.split("\t");
	        theElection = new ds.Election({
			ID:columns[0],
			year:columns[1],
			district:columns[2],
			day:columns[4],
			general:columns[11],
			runoff:columns[13]
         	});
    theElection.save();
	})
	
		return true;
};

function Politician_Import(importfile)
{
	var lines = loadText(importfile).split("\n");
	var columns = [];
	lines.forEach(function(oneLine) { 
	columns = oneLine.split("\t");
	        thePolitician = new ds.Politician({
			ID:columns[0],
			lastName:columns[1],
			firstName:columns[2],
			middleName:columns[3],
			suffix:columns[4],
			fullName:columns[5],
			party:columns[6],
			firstElected:columns[7],
			url:columns[8]
         	});
    thePolitician.save();
	})
	
	return true;
};

function Party_Import(importfile)
{
	var lines = loadText(importfile).split("\n");
	var columns = [];
	lines.forEach(function(oneLine) { 
	columns = oneLine.split("\t");
	        theParty = new ds.Party({
			ID:columns[0],
			name:columns[1],
			abbreviation:columns[2]
         	});
    theParty.save();
	})
	
	return true;
};

function StateLowerDistrict_Import(importfile)
{
	var lines = loadText(importfile).split("\n");
	var columns = [];
	lines.forEach(function(oneLine) { 
	columns = oneLine.split("\t");
	        theStateLowerDistrict = new ds.StateLowerDistrict({
			ID:columns[0],
			name:columns[1],
			code:columns[2],
			state:columns[3],
			type:columns[4],
			typeCode:columns[5],
			numberOfReps:columns[6]
         	});
    theStateLowerDistrict.save();
	})
	
	return true;
};

function StateUpperDistrict_Import(importfile)
{
	var lines = loadText(importfile).split("\n");
	var columns = [];
	lines.forEach(function(oneLine) { 
	columns = oneLine.split("\t");
	        theStateUpperDistrict = new ds.StateUpperDistrict({
			ID:columns[0],
			name:columns[1],
			code:columns[2],
			state:columns[3],
			type:columns[4],
			typeCode:columns[5],
			numberOfReps:columns[6]
         	});
    theStateUpperDistrict.save();
	})
	
	return true;
};


function CongressionalDistrict_Import(importfile)
{
	var lines = loadText(importfile).split("\n");
	var columns = [];
	lines.forEach(function(oneLine) { 
	columns = oneLine.split("\t");
	        theCongressionalDistrict = new ds.CongressionalDistrict({
			ID:columns[0],
			name:columns[1],
			code:columns[2],
			state:columns[3],
			type:columns[4],
			typeCode:columns[5],
			numberOfReps:columns[6]
         	});
    theCongressionalDistrict.save();
	})
	
	return true;
};

function District_Import(importfile)
{
	var lines = loadText(importfile).split("\n");
	var columns = [];
	lines.forEach(function(oneLine) { 
	columns = oneLine.split("\t");
	        theDistrict = new ds.District({
			ID:columns[0],
			name:columns[1],
			code:columns[2],
			state:columns[3],
			type:columns[4],
			typeCode:columns[5],
			numberOfReps:columns[6]
         	});
    theDistrict.save();
	})
	
	return true;
};


function State_Import(importfile)
{
	var lines = loadText(importfile).split("\n");
	var columns = [];
	lines.forEach(function(oneLine) { 
	columns = oneLine.split("\t");
	        theState = new ds.State({
			ID:columns[0],
			name:columns[1],
			abbreviation:columns[2],
			censusCode:columns[3]
         	});
    theState.save();
	})
	
	return true;
};

function executeZipImport(importfile)
{
	var lines = loadText(importfile).split("\n");
	var columns = [];
	lines.forEach(function(oneLine) { 
	columns = oneLine.split("\t");
	        theZip9 = new ds.Zip9({
            zipcode: columns[0]+ columns[1],
            //zip5 : columns[0],
            //zip4 : columns[1],
            //cd : "0" + columns[2],
            //su : columns[3],
            //sl : columns[4],
            //scc : columns[5],
            countyCode : columns[6],
            //centroid : columns[7],
            recordType : columns[8]
            //flag : columns[9]
         	});
    theZip9.save();
	})
	
	return true;
};


	
//deleteAllModels(dataClassName);
//setAutoSequence(dataClassName);
//importAllFixedData(importFileName);
//importAllZipData();

