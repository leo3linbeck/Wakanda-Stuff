/**

* @author richard r. fernandez


*/


function writeDataOut(data, filename) {
	var createSuccess;
	var globalCounter = getGlobalOrUpdateCounter("Get");
	var strFile = ds.getModelFolder().path + 'Import/dataexport/' + globalCounter + '_' + filename;
	var f =  new File(strFile);
	if(!f.exists)
	{ createSuccess= f.create()}
	var ts=TextStream(f, "write");
	ts.write(data)
	ts.close();
	return createSuccess;
}

function importUpdateDatasources(vAction) {
	if (vAction === 'Export')
	{for (var vName in ds.dataClasses)  // put each datastore class of ds
 		{dataSourceAttributes(vName, vName+ '.csv');}
 	}
 	else //import branch
 	{
 			var globalCounter = getGlobalOrUpdateCounter("Import");
 			readEachFile(globalCounter);
 	}      	
	}
	
function ExportOneDatasources(vName) {
	
dataSourceAttributes(vName, vName+ '.csv');
     	
	}
	
function readEachFile(globalCounter) {
	var readFolderPath = ds.getModelFolder().path + 'Import/dataupdates/'
	var readFolder=Folder(readFolderPath);
	var arrayToRead= [];
	var readFiles= readFolder.files;
	if (readFiles.length === 0) {return false}
	//load up the right files
	for(var i=0; i<readFiles.length; i++)
		{if (parseFloat(readFiles[i].name.split("_")[0]) >= globalCounter)
			{arrayToRead.push(readFiles[i]);}
        }
    appendOrUpdateFile(arrayToRead);
	return true;
	}
	
function appendOrUpdateFile(arrayToRead) {
		if (arrayToRead.length >= 1)
		{
			//apply them in the right order
			arrayToRead.sort();
			for (f in arrayToRead)
			{
				var dClassName = arrayToRead[f].name;
				dClassName=dClassName.split('_')[1];
				dClassName=dClassName.split('.')[0];
				var dSource=ds[dClassName];
				var dSourceAttributes=dSource.attributes;
				var attribArray=[];
				for (a in dSourceAttributes)
				{attribArray.push(dSourceAttributes[a].name)}
				var linesDirty = loadText(arrayToRead[f]).split("\n")
				var lines =[];
				for (var i = 0; i<linesDirty.length; i++) //get rid of blanks
				{
			      if (linesDirty[i] && linesDirty[i].length > 1){
        			lines.push(linesDirty[i]);
					}
				}
				var headers = lines[0].split(',');
				lines.splice(0,1);
				var columns = []; //for each line
				lines.forEach(function(oneLine) {
					columns=oneLine.split(",");
				//look for a match;
				var strQuery=dSource[attribArray[0]] + '=' + columns[0]
				var match =dSource.find(strQuery)
				if (match != null) //update an existing entity
				{
					for(var i=0; i<headers.length; i++)
					{   
						var hPlain = headers[i].replace(/(\r\n|\n|\r)/gm,"")
						var colPlain=columns[i].replace(/(\r\n|\n|\r)/gm,"") //add here
						if (typeof(colPlain)==="string")
						{
							colPlain = colPlain.replace(/\<CRLF_CHAR\>/gm, "\r\n")
							colPlain = colPlain.replace(/\<CR_CHAR\>/gm, "\r")
							colPlain = colPlain.replace(/\<LF_CHAR\>/gm, "\n")
						}
						match[hPlain] = colPlain
						}
					match.save();	
				}
				else // create a new entity
					{var e = dSource.createEntity()
					for(var i=0; i<headers.length; i++)
					{
						var hPlain = headers[i].replace(/(\r\n|\n|\r)/gm,"")
						var colPlain=columns[i].replace(/(\r\n|\n|\r)/gm,"") //add here
						if (typeof(colPlain)==="string")
						{
							colPlain = colPlain.replace(/\<CRLF_CHAR\>/gm, "\r\n")
							colPlain = colPlain.replace(/\<CR_CHAR\>/gm, "\r")
							colPlain = colPlain.replace(/\<LF_CHAR\>/gm, "\n")
						}
						e[hPlain] = colPlain
					}
					e.save();}
				}
				)
			}
			
			}
	}

function getGlobalOrUpdateCounter(vMode, data) {
	if (vMode === "Get")
	{
		var strFile = ds.getModelFolder().path + 'GlobalSettings.txt';
		var varGlobalVariable = loadText(strFile);
		if (!isNaN(varGlobalVariable))
		{return parseFloat(varGlobalVariable)}
			}
	else
	if (vMode === "Update")
	{
		var createSuccess;
		var strFile = ds.getModelFolder().path + 'GlobalSettings.txt';
		var f =  new File(strFile);
		if(!f.exists)
		{ createSuccess= f.create()}
		var ts=TextStream(f, "Overwrite");
		ts.write(data)
		ts.close();
		return createSuccess;
		}
	}
	
function dataSourceAttributes(vName, fName) {
	var header=[];
	var body=[];
	var outTxt='';
	var dSource = ds[vName];
	for (i in dSource.attributes)
		{
			var kind=[]
			kind.push(dSource.attributes[i]['name']);
			kind.push(dSource.attributes[i
			]['kind']);
			header.push(kind)
			}
	var output =[];
	for (i in header)
	{output.push(header[i][0])}
	outTxt=output.join(',') + '\n'
	writeDataOut(outTxt, fName)
	var data = dSource.all()
	data.forEach(function(d) {
		for (i in header)
		{
			if (header[i][1] == "relatedEntity")
			 	{
			 		try	
			 		{body.push(d[header[i][0]].ID)}
			 		catch(err)
			 		{body.push(null)}
			 		}
			else //add here
				{
					var colPlain = d[header[i][0]]
					if (typeof(colPlain)==="string")
					{
						colPlain = colPlain.replace(/\r\n/gm,"<CRLF_CHAR>");
						colPlain = colPlain.replace(/\r/gm,"<CR_CHAR>");
						colPlain = colPlain.replace(/\n/gm,"<LF_CHAR>");
					}				
					body.push(colPlain)
					}
		//body;
		}
		outTxt='';
		outTxt=body.join(',');
		outTxt = outTxt.replace(/(\r\n|\n|\r)/gm,"") //superfluous
		outTxt+= '\n';
		writeDataOut(outTxt, fName);
		body=[];
		})
	
}


var x = importUpdateDatasources('Export');
//getGlobalOrUpdateCounter("Update", "2") 
//var x = getGlobalOrUpdateCounter("Get");
x;
