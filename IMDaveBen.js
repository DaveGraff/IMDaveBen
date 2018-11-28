var mysql = require('mysql');
const querystring = require('querystring');
var path = require('path');
var dir = path.dirname(require.main.filename);

const express = require('express');
const bodyParser = require('body-parser');
const app = new express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res){
	res.sendFile(dir + '\\CSE305Search.html');
});

app.get('/style.css', function(req, res){
	res.sendFile(dir + '\\style.css');
});

app.get('/logo.png', function(req, res){
	res.sendFile(dir + '\\logo.png');
});

app.post('/query', (req, res) => {
	const postBody = req.body;
	console.log(postBody);
});

app.listen(8080);

var con = mysql.createConnection({
  database : 'IMDaveBen',
	host: "localhost",
  user: "root",
  password: "#SeaShanty"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//This is the proper way to call the getPeople function
getPeople("a", function (person) {
  console.log(String(person[0].PersonName));
});


//Returns the names & IDs for a given people search
function getPeople(search, callback){
  con.query("SELECT PersonName, Id FROM Person WHERE PersonName LIKE'%" + search + "%'", function (err, result, fields) {
  if (err) throw err;
    return callback(result);
  });
}

//Returns the names & IDs for a given show search
function getTitles(search, callback){
  con.query("SELECT ShowTitle, ShowYear FROM Shows WHERE ShowTitle LIKE'%" + search + "%'", function (err, result, fields) {
  if (err) throw err;
	  return callback(result);
  });
}

//Returns a specific person given their ID #
function getPerson(id, callback){
	con.query("SELECT * FROM Person WHERE Id = " + id + ";", function (err, result, fields) {
  if (err) throw err;
	  return callback(result);
  });
}

//Return a specific Title given the key
function getTitle(name, year, callback){
	con.query("SELECT * FROM Shows WHERE ShowTitle = " + name + "AND ShowYear = " + year + ";", function (err, result, fields) {
  if (err) throw err;
	  return callback(result);
  });
}
