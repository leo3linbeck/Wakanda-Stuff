	/**

* @author richard r fernandez

*/

exports.getFileN = function(debug)  {
	if (debug) debugger;
	var fixedFolderPath = "C:/strawpollprivate/SPWidget/WebFolder/stuff/";
	var fixedFolder=Folder(fixedFolderPath);
	var fixedfiles= fixedFolder.files;
	if (fixedfiles.length > 0)
	{return "http://127.0.0.1:8081/stuff/" + fixedfiles[0].name}
	return null;
}

exports.dumpFileN = function(fName, debug) {
	if (debug) debugger;
	var filetoditch = "C:/strawpollprivate/SPWidget/WebFolder/stuff/" + fName;
	//var filetoditch =Folder(fixedFolderPath + fname);
	var myfile = new File (filetoditch)
	var success = myfile.remove();
	
	return success;
	
}