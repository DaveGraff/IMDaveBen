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

app.get('/CSE305Response.html', function (req, res) {
	res.sendFile(dir + '\\CSE305Response.html');
});

app.get('/style.css', function(req, res){
	res.sendFile(dir + '\\style.css');
});

app.get('/logo.png', function(req, res){
	res.sendFile(dir + '\\logo.png');
});

app.post('/CSE305Response.html', (req, res) => {
	const postBody = req.body;
	var page;
	console.log(postBody);
	if (postBody.type == 'People') {
		console.log("People");
		getPeople(postBody.name, function (person) {
			if (person == undefined || person.length == 0) {
				console.log("No results found!");
				page = buildPage("Null", person);
				page.then(
				function(result) {
					if (result) { console.log('Finished writing response!'); }
					res.sendFile(dir + '\\CSE305Response.html');
				},
				function(err) { console.log(err); });
			} else {
				console.log(person);
				page = buildPage(postBody.type, person, res);
				page.then(
				function(result) {
					if (result) { console.log('Finished writing response!'); }
					res.sendFile(dir + '\\CSE305Response.html');
				},
				function(err) { console.log(err); });
			}
		});
	} else if (postBody.type == 'Titles') {
		console.log("Titles");
		getTitles(postBody.name, function (title) {
			if (title == undefined || title.length == 0) {
				console.log("No results found!");
				page = buildPage(postBody.type, title, res);
				page.then(
				function(result) {
					if (result) { console.log('Finished writing response!'); }
					res.sendFile(dir + '\\CSE305Response.html');
				},
				function(err) { console.log(err); });
			} else {
				console.log(title);
				page = buildPage(postBody.type, title, res);
				page.then(
				function(result) {
					if (result) { console.log('Finished writing response!'); }
					res.sendFile(dir + '\\CSE305Response.html');
				},
				function(err) { console.log(err); });
			}
		});
	}
});

const server = app.listen(8080);
server.keepAliveTimeout = 60000 * 2;

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

function getPersonCastRoles(id, callback){
	con.query("SELECT * FROM CastMembers WHERE Id = " + id + " ORDER BY ShowYear, ShowTitle;", function (err, result, fields) {
	if (err) throw err;
		return callback(result);
	});
}

function getPersonCrewRoles(id, callback){
	con.query("SELECT * FROM CrewMembers WHERE Id = " + id + " ORDER BY ShowYear, ShowTitle;", function (err, result, fields) {
	if (err) throw err;
		return callback(result);
	});
}

function getPersonAwards(id, callback){
	con.query("SELECT AwardName, YearAwarded FROM Award WHERE Id = " + id + " ORDER BY YearAwarded;", function (err, result, fields) {
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

function buildPage(type, list, res) {
	return new Promise((resolve, reject) => {
		fs.truncate(filename, 0, function() {console.log("Response file cleared!");});
		var body = '';
		if ((type == 'Titles' || type == 'People') && list != '') {
			console.log('Appending results...');
			body += '<table align=\"center\">';
			if (type == 'People') {
				body += '<th>Name</th><th>ID #</th>';
				var i;
				for (i = 0; i < list.length; i++) {
					body += '<tr><td>' + list[i].PersonName + '</td><td>' + list[i].Id + '</tr>';
				}
			} else if (type == 'Titles') {
				body += '<th>Title</th><th>Year</th>';
				var i;
				for (i = 0; i < list.length; i++) {
					body += '<tr><td>' + list[i].ShowTitle + '</td><td>' + list[i].ShowYear + '</tr>';
				}
			}
			body += '</table>'
		} else {
			body += "<h1>No results found!</h1>";
		}
		var html = ('<!DOCTYPE html><html><head><link rel=\"stylesheet\" href=\"style.css\"></head><body><img src=\"logo.png\" alt=\"IMDaveBen\" class = \"centerImage\">'
					+ '<div class=\"center\">' + body + '<a href=\"/\">Back to query page</a></div></body></html>');
		fs.writeFile(dir + "\\CSE305Response.html", html, function (err) {
			if (err) { reject(err);	}
			resolve(true);
		});
	});
}

//Generate HTML code for response
function buildHTML(type, list) {

}
