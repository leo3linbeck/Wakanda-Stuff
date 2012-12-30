/**

* @author admin


var array =[];
var att = ds.Reparsed.attributes;
for (a in att)
{
	array.push(att[a].name)
}
*/
//for (var vName in ds.dataClasses)
//{var x= ds[vName].length}

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

ds.Reparsed.all().remove();
ds.Reparsed.setAutoSequenceNumber(1)
ds.Reparsed.length;

/*var d = ds.Reparsed.all();
for (var i=0; i < d.length; i++)
{
	//d[i]['category']= 'State Upper Chamber';
	var e = ds.Reparsed.find("ID=" + d[i]['ID'])
	e.category ='State Upper Chamber';
	e.save();
}*/

//var d= ds.Reparsed.all().remove();