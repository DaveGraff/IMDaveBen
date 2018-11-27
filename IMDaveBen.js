var mysql = require('mysql');

var path = require('path');
var dir = path.dirname(require.main.filename);

const express = require('express');
const app = new express();

app.get('/', function(req, res){
	res.sendFile(dir + '\\CSE305Search.html');
});

app.get('/style.css', function(req, res){
	res.sendFile(dir + '\\style.css');
});

app.get('/logo.png', function(req, res){
	res.sendFile(dir + '\\logo.png');
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
