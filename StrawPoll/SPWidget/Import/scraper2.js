/**

* @author admin

*/

debugger;
function getHTML(URLText)
{ 
var xhr, headers, result, resultObj, URLText, URLJson;
var headersObj = {};
   
xhr = new XMLHttpRequest(); 
   
 xhr.onreadystatechange = function() { // event handler
     var state = this.readyState;
     if (state !== 4) { // while the status event is not Done we continue
         return;
     }
     var headers = this.getAllResponseHeaders(); //get the headers of the response
     var result = this.responseText;  //get the contents of the response
     var headersArray = headers.split('\n'); // split and format the headers string in an array
     headersArray.forEach(function(header, index, headersArray) {
         var name, indexSeparator, value;
 
        if (header.indexOf('HTTP/1.1') === 0) { // this is not a header but a status         
             return; // filter it
         }
  
        indexSeparator = header.indexOf(':');
        name = header.substr(0,indexSeparator);
        if (name === "") {
            return;
        }
        value = header.substr(indexSeparator + 1).trim(); // clean up the header attribute
        headersObj[name] = value; // fills an object with the headers
     });
     if (headersObj['Content-Type'] && headersObj['Content-Type'].indexOf('json') !== -1) { 
             // JSON response, parse it as objects
         resultObj = JSON.parse(result);
     } else { // not JSON, return text
         resultTxt = result;
     }
 };
   

xhr.open('GET', URLText); // to connect to a Web site
   // or xhr.open('GET', URLJson) to send a REST query to a Wakanda server
   
xhr.send(); // send the request
statusLine = xhr.status + ' ' + xhr.statusText; // get the status
return resultTxt
};


function HTMLParser(aHTMLString, HTMLparser){
  var html = document.implementation.createDocument("http://www.w3.org/1999/xhtml", "html", null),
    body = document.createElementNS("http://www.w3.org/1999/xhtml", "body");
  html.documentElement.appendChild(body);

  body.appendChild(Components.classes["@mozilla.org/feed-unescapehtml;1"]
    .getService(Components.interfaces.nsIScriptableUnescapeHTML)
    .parseFragment(aHTMLString, false, null, body));

  return body;
};

var HTMLparser  = getHTML("http://www.w3.org/1999/xhtml");
//var aHTMLString = getHTML("http://www.ballotpedia.org/wiki/index.php/John_Maglio");

//var y = HTMLParser(aHTMLString, HTMLparser)


 
 // we build the following object to display the responses in the code editor
 /*({
     statusLine: statusLine,
     headers: headersObj,
     result: resultObj || resultTxt
 })*/
 