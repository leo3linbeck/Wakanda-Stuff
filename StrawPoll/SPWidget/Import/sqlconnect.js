/**

* @author richard r fernandez
for the below to work
first create an ssh tunnel

ssh -l richard -L 3306:localhost:3306 richard@amazing.umeme.us


SELECT * FROM `CLA_amit_3`.`a_zips` WHERE idZip9=10;

strawpolldb9178.czwsdjwqkdmi.us-east-1.rds.amazonaws.com

*/

/*var net = require('net');
var socket = new net.Socket();
socket.connect(3306, '127.0.0.1', function () {


});*/


var mysql = require('waf-mysql');
/*var params = {
    hostname: '127.0.0.1',
    user: 'root',
    password: 'barnaclebill',
    database: 'test',
    port: 3306,  //3306 by default
    ssl: false
};*/

/*var params = {
    hostname: '127.0.0.1',
    user: 'root',
    password: 'sambre1917',
    database: 'CLA_amit_3',
    port: 3306,  //3306 by default
    ssl: false
};*/

var params = {
    hostname: 'strawpolldb9178.czwsdjwqkdmi.us-east-1.rds.amazonaws.com',
    user: 'dormammu',
    password: 'kanlaong$',
    database: 'strawpoll',
    port: 3306,  //3306 by default
    ssl: false
};


var dbconn = mysql.connect(params);
var rs=dbconn.execute("SELECT * FROM a_zips WHERE ZIP5='03031' AND ZIP4='0005'");
var counter= rs.getRowsCount();
var result = rs.getAllRows();
var ZIP9= result[0].ZIP5 + result[0].ZIP4;
if (dbconn.isConnected)
{dbconn.close();};