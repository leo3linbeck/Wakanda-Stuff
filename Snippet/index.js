/*
Wakanda Software (the "Software") and the corresponding source code remain
the exclusive property of 4D and/or its licensors and are protected by national
and/or international legislations.
This file is part of the source code of the Software provided under the relevant
Wakanda License Agreement available on http://www.wakanda.org/license whose compliance
constitutes a prerequisite to any use of this file and more generally of the
Software and the corresponding source code.
*/

var
	actions;

actions = {};

/* HTML */

actions.html_form = function html_form(message) {
	var
		html_form_tag;
		
	html_form_tag = "<form action=\"\" method=\"\" accept-charset=\"utf-8\">\n\
	<p><input type=\"submit\" value=\"Continue\" /></p>\n\
</form>";
	studio.currentEditor.insertText(html_form_tag);
};

actions.html_div = function html_div(message) {
	var
		html_div_tag;
	var
		selectedText;
	var
		new_str;
		
	html_div_tag = "<div>$REPLACE</div>"
	selectedText = studio.currentEditor.getSelectedText();
	new_str = html_div_tag.replace("$REPLACE", selectedText);
	studio.currentEditor.insertText(new_str);
	if (selectedText === '') {
		var sel = studio.currentEditor.getSelectionInfo();
		studio.currentEditor.setCaretPosition(sel.offsetFromStartOfText - 6);
	}
};

function li(type) {
	var
		html_olli_tag;
	var
		selectedText;
	var
		strArray;
	var
		typeTag;

	typeTag = type==='ol'?"<ol>\r":"<ul>\r";
	html_olli_tag = typeTag;
	selectedText = studio.currentEditor.getSelectedText();
	if (selectedText === "") {
		html_olli_tag += "<li></li>\r";
	}
	else {
		strArray = selectedText.split('\r');
		
		for (var i = 0; i < strArray.length; i++)
		{
			if (strArray[i] != "")
				html_olli_tag += "  <li>" + strArray[i] + "</li>\r";
		}
	}
	html_olli_tag += typeTag;
	studio.currentEditor.insertText(html_olli_tag);
}

actions.html_ol = function html_ol(message) {
	li('ol');
}

actions.html_ul = function html_ul(message) {
	li('ul');
}

actions.html_br = function html_br(message) {
	studio.currentEditor.insertText("<br/>");
};

actions.html_p = function html_p(message) {
	var
		html_p_tag;
	var
		selectedText;
	var
		new_str;
		
	html_p_tag = "<p>$REPLACE</p>";
	selectedText = studio.currentEditor.getSelectedText();
	new_str = html_p_tag.replace("$REPLACE", selectedText);
	studio.currentEditor.insertText(new_str);

	if (selectedText === '') {
		var sel = studio.currentEditor.getSelectionInfo();
		studio.currentEditor.setCaretPosition(sel.offsetFromStartOfText - 4);
	}
};

/*Javascript*/

actions.js_func = function js_func(message) {
	var
		js_func_snippet;
	var
		selection;
		
	js_func_snippet = "function func() {\n\n}\n";
	studio.currentEditor.insertText(js_func_snippet);
	
	// Set the cursor between the braces
	sel = studio.currentEditor.getSelectionInfo();
	studio.currentEditor.selectByVisibleLine(sel.firstLineOffset, sel.lastLineOffset, sel.firstVisibleLine-2, sel.lastVisibleLine-2);
	
	// Do 1 indent
	studio.currentEditor.insertText("\t");
};

actions.js_if = function js_if(message) {

	var
		js_if_snippet;
	var
		new_str;
	
	js_if_snippet = "if () {\n\n} else {\n\n}\n";
	studio.currentEditor.insertText(js_if_snippet);
	
	// Set the cursor between the parentheses
	sel = studio.currentEditor.getSelectionInfo();
	studio.currentEditor.setCaretPosition(sel.offsetFromStartOfText - js_if_snippet.length + 4);
};

actions.js_for = function js_for(message) {
	var
		sel;

	studio.currentEditor.insertText("for (var i=0; i<x; i++) {\n\n};\n");
	sel = studio.currentEditor.getSelectionInfo();
	
	studio.currentEditor.setCaretPosition(sel.offsetFromStartOfText - 4);
	studio.currentEditor.insertText("\t");
};

actions.js_switch = function js_switch(message) {
	var
		js_switch_snippet;
	var
		sel;
		
	js_switch_snippet = "switch() {\n	case x:\n		break;\n	case y:\n		break;\n}\n";
	studio.currentEditor.insertText(js_switch_snippet);
	
	sel = studio.currentEditor.getSelectionInfo();
	studio.currentEditor.setCaretPosition(sel.offsetFromStartOfText - js_switch_snippet.length + 7);
};

actions.js_try = function js_try(message) {
	var
		js_try_snippet;
		
	js_try_snippet = "try {\n\n} catch (e) {\n\n}\n";
	studio.currentEditor.insertText(js_try_snippet);
	var sel = studio.currentEditor.getSelectionInfo();
	studio.currentEditor.setCaretPosition(sel.offsetFromStartOfText - js_try_snippet.length + 6);
	studio.currentEditor.insertText("\t");
};



function comment(type) {
	var
		comment_snippet;
	var
		selectedText;
	var
		new_str;
		
	comment_snippet = type==='html'?"<!--$REPLACE-->":"/*$REPLACE*/";
	selectedText = studio.currentEditor.getSelectedText();
	new_str = comment_snippet.replace("$REPLACE", selectedText);
	studio.currentEditor.insertText(new_str);
};


actions.html_comment = function html_comment(message) {
	comment('html');
}

actions.js_comment = function js_comment(message) {
	comment('js');
}


actions.js_rpc_callback_block = function js_rpc_callback_block(message) {
	var
		js_callback_block_snippet;
	
	var sel = studio.currentEditor.getSelectionInfo();
	js_callback_block_snippet = "NAMESPACE.RPC-FUNCTION-Async(\n\t{\n\t\tonSuccess: function(event) {\n\t\t\tconsole.log(event);\n\t\t},\n\t\tonError: function(error) {\n\t\t\tconsole.log(error);\n\t\t},\n\t\tparams: [params]\n\t}\n);\n";
	studio.currentEditor.insertText(js_callback_block_snippet);
	studio.currentEditor.selectByLineIndex(0, 2, sel.firstLineIndex, sel.firstLineIndex + 10);
};

actions.js_data_callback_block = function js_data_callback_block(message) {
	var
		js_callback_block_snippet;
		
	var sel = studio.currentEditor.getSelectionInfo();
	js_callback_block_snippet = "DATA-METHOD(\n\t{ // callback block\n\t\tonSuccess: function(event) {\n\t\t\tconsole.log(event);\n\t\t},\n\t\tonError: function(error) {\n\t\t\tconsole.log(error);\n\t\t}\n\t},\n\t{ // parameter block\n\t\tparams: params\n\t}\n);\n";
	studio.currentEditor.insertText(js_callback_block_snippet);
	studio.currentEditor.selectByLineIndex(0, 2, sel.firstLineIndex, sel.firstLineIndex + 12);
};

actions.js_query_callback_block = function js_query_callback_block(message) {
	var
		js_callback_block_snippet;
		
	var sel = studio.currentEditor.getSelectionInfo();
	js_callback_block_snippet = "ds.CLASS_NAME.query(QUERY_STRING,\n\t{\n\t\tonSuccess: function(event) {\n\t\t\tconsole.log(event);\n\t\t},\n\t\tonError: function(error) {\n\t\t\tconsole.log(error);\n\t\t},\n\t\tparams: [PARAMS],\n\t\tpageSize: 40,\n\t\tautoExpand: '',\n\t\tpersistOnServer: false,\n\t\tprogressBar: '',\n\t\tqueryPlan: false,\n\t\tqueryPath: false,\n\t\torderBy: '',\n\t\tuserData: {}\n\t}\n);\n";
	studio.currentEditor.insertText(js_callback_block_snippet);
	studio.currentEditor.selectByLineIndex(0, 2, sel.firstLineIndex, sel.firstLineIndex + 18);
};


//point d'entree unique de l'extension 
exports.handleMessage = function handleMessage(message) {

	var
		actionName;
	
	actionName = message.action;
	
	if (!actions.hasOwnProperty(actionName)) {
		studio.alert("I don't know about this message: " + actionName);
		return false;
	}
	
	//if (message.event === "fromSender") {
		actions[actionName](message);
	//}
}

