/**

* @author richard r fernandez
for the below to work
first create an ssh tunnel

ssh -l richard -L 3036:localhost:3306 richard@amazing.umeme.us


SELECT * FROM `CLA_amit_3`.`a_zips` WHERE idZip9=10;

*/

var net = require('net');
var socket = new net.Socket();
socket.connect(3036, '127.0.0.1', function () {


});


var mysql = require('waf-mysql');
var params = {
    hostname: '127.0.0.1',
    user: 'root',
    password: 'sambre1917',
    database: 'CLA_amit_3',
    port: 3036,  //3306 by default
    ssl: true
};
var dbconn = mysql.connect(params);
var result=dbconn.execute('SELECT * FROM a_zips WHERE idZip9=10');
result;
dbconn.close();