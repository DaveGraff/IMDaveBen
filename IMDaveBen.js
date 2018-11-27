var mysql = require('mysql');

var path = require('path');
var dir = path.dirname(require.main.filename);

const express = require('express');
const app = new express();

app.get('/', function(request, response){
	response.sendFile(dir + '\\CSE305Search.html');
});
app.listen(8080);

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "#SeaShanty"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
