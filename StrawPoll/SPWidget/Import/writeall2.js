/**

* @authors richard r. fernandez and Leo Linbeck III


*/

// utility routines

function getGlobalCounter() {
	var gc = ds.GlobalConstant.all();
	if (gc) {
		return parseInt(gc.lastDataFileLoaded);
	}
	
	return 0;
}

function setGlobalCounter(num) {
	var gc = ds.GlobalConstant.all();
	if (!gc) {
		gc = ds.GlobalConstant.createEntity();
		gc.ID=1;
		gc.versionNumber="1";
		gc.lastDataFileLoaded=1;
		gc.save()
		
	}
	var go = gc.find("ID=1");
	go.versionNumber= num;
	go.lastDataFileLoaded = num;
	go.save();
}

// export routines

function processAndSaveOneDataclass(dsClass, filePath, num) {
	var c = ds[dsClass];
	var ec = c.all();
	if (ec.length > 0) {
		var p = c.attributes;
		var attr = [];
		for (var i in p) {
			if (p[i].kind == 'storage' || p[i].kind == 'relatedEntity') {
				attr.push(p[i].name);
			}
		}
		var attrString = attr.join(',');
		var a = ec.toArray(attrString,'',true);
		
		t = JSON.stringify(a);
		
		var ts = TextStream(filePath + num + '_' + dsClass + '.json', "write");
		ts.rewind();
		ts.write(t);
		ts.close();
	}
}

function exportEverythingExceptForDataclassesInTheArgumentArray(a) {
	var filePath = ds.getModelFolder().path + 'Import/datafiles/';
	var fileArray = Folder(filePath).files.sort();
	var dsClasses = ds.dataClasses;
	
	var maxNum = 0
	for (var i = 0; i < fileArray.length; i++)  {
		var f = fileArray[i].name;
		var num = parseInt(f.split('_')[0]);
		if (num > maxNum) {
			maxNum = num;
		}
	}
	maxNum++;
	
	for (var c in dsClasses) {
		if (a.indexOf(c) == -1) {
			processAndSaveOneDataclass(c, filePath, maxNum);
		}
	}
}

// import routines

function readAndProcessOneFile(f, dsClass) {
	//load up the right files
	var ts = TextStream(f, "read");
	var stream = ts.read();
	ts.close();

	var eArray = stream.split('<ENTITY>');
	
	var c = ds[dsClass];
	for (var i = 0; i < eArray.length; i++) {
		var e = eArray[i];
		if (e == '') {
			continue;
		}
		var a = JSON.parse(e);
	// remove the dups	
	for (var i = 0; i < eArray.length; i++) { 
		var dup = c.find("ID= :1", a[0]['ID']);
		if (dup) {dup.remove()}
		
		}	
		//add in the records with the dups gone
		c.fromArray(a);
	}
}

function importEverythingExceptForDataclassesInTheArgumentArray(a) {
	var startNum = getGlobalCounter() + 1;
	var filePath = ds.getModelFolder().path + 'Import/datafiles/';
	var fileArray = Folder(filePath).files;
	var maxNum = 0;
	var obj = {};
	for (var i = 0; i < fileArray.length; i++)  {
		var f = fileArray[i].name;
		var num = parseInt(f.split('_')[0]);
		if (obj[num] === undefined) {
			obj[num] = [];
		}
		obj[num].push(f);
		
		if (num > maxNum) {
			maxNum = num;
		}
	}
	
	for (var i = startNum; i <= maxNum; i++)  {
		var fa = obj[i];
		for (var j = 0; j < fa.length; j++) {
			var fileName = fa[j];
			var re = /(\d+)_(\w+)\.json/.exec(fileName);
			if (re != null && parseInt(re[1]) >= startNum && a.indexOf(re[2]) == -1) {
				readAndProcessOneFile(filePath + fileName, re[2]);
			}
		}
	}
	
	setGlobalCounter(maxNum);
}

function readAndProcessManyFiles() {
	var readFolderPath = ds.getModelFolder().path + 'Import/datafiles/'
	var readFolder=Folder(readFolderPath);
	var readFiles= readFolder.files;
	var globalCounter=getGlobalCounter();
	if (readFiles.length === 0) {return false}
	//load up the right files
	for(var i=0; i<readFiles.length; i++)
		{ 		var f = readFiles[i];  	
				var version =readFiles[i].name.split('_')[0];
				var balance=readFiles[i].name.split('_')[1];
				var dsName=balance.split('.')[0];
				var d = ds[dsName];
			if (parseFloat(readFiles[i].name.split("_")[0]) >= globalCounter)
			{   readAndProcessOneFile(f, d);
			}
        }
	return true;
	}


//exportEverythingExceptForDataclassesInTheArgumentArray([]);
//importEverythingExceptForDataclassesInTheArgumentArray(['GlobalConstant']);

//setGlobalCounter(1);
//readAndProcessManyFiles();
/*var x =  ds.getModelFolder().path + 'Import/' + 'datafiles/1_Reparsed.json';
var f = File(x);
var d= ds["Reparsed"]
readAndProcessOneFile(f, d)*/