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

app.post('/CSE305Response.html', (req, res) => {
	const postBody = req.body;
	console.log(postBody);
	if (postBody.type == 'People') {
		console.log("People");
		getPeople(postBody.name, function (person) {
			if (person == undefined || person.length == 0) {
				console.log("No results found!");
				buildPage("Null", person);
			} else {
				console.log(person);
				buildPage(postBody.type, person);
			}
			res.sendFile(dir + "\\CSE305Response.html");
		});
	} else if (postBody.type == 'Titles') {
		console.log("Titles");
		getTitles(postBody.name, function (title) {
			if (title == undefined || title.length == 0) {
				console.log("No results found!");
				buildPage("Null", title);
			} else {
				console.log(title);
				buildPage(postBody.type, title);
			}
			res.sendFile(dir + "\\CSE305Response.html");
		});
	}
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

//Generate response page for search query
var fs = require('fs');
var filename = dir + '\\CSE305Response.html';

function buildPage(type, res) {
	fs.truncate(filename, 0, function() {console.log("Response file cleared!");});
	var stream = fs.createWriteStream(filename);
	stream.once('open', function(fd) {
		var html = buildHTML(type, res);
		stream.end(html);
	});
}

//Generate HTML code for response
function buildHTML(type, res) {
	var body = '';
	if (type == 'Titles' || type == 'People') {
		body += res;
	} else {
		body += "<h1 class=\"center\">No results found!</h1>";
	}
	return '<!DOCTYPE html>' + '<html><head>'
	+ '<link rel=\"stylesheet\" href=\"style.css\"><title>IMDaveBen</title></head>'
	+ '<body>'	+ body + '</body></html>';
}

