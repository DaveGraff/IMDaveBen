const mysql = require('mysql');
const querystring = require('querystring');
const path = require('path');
const dir = path.dirname(require.main.filename);

const express = require('express');
const bodyParser = require('body-parser');
const app = new express();

/* Setup for body-parser module. */
app.use(bodyParser.urlencoded({ extended: false }));

/* Respond to general requests with main page CSE305Search.html. */
app.get('/', function(req, res){
	res.sendFile(dir + '\\CSE305Search.html');
});

/* Respond to search queries with CSE305Response.html. */
app.get('/CSE305Response.html', function (req, res) {
	res.sendFile(dir + '\\CSE305Response.html');
});

/* Send style.css on request for each webpage. */
app.get('/style.css', function(req, res){
	res.sendFile(dir + '\\style.css');
});

/* Send logo image file on request for each page. */
app.get('/logo.png', function(req, res){
	res.sendFile(dir + '\\logo.png');
});

/* Handle post requests for search queries from CSE305Search.html. */
app.post('/CSE305Response.html', (req, res) => {
	/* Retrieve request body */
	const postBody = req.body;
	var page;
	console.log(postBody);
	if (postBody.type == 'People') {
		console.log("People");
		/* If search query was for a Person, call getPeople() */
		getPeople(postBody.name, function (person) {
			if (person == undefined || person.length == 0) {
				console.log("No results found!");
				/* If no Person was found, call buildPage() with "Null" type */
				page = buildPage("Null", person);
				/* Send CSE305Response.html only when buildPage() returns */
				page.then(
				function(result) {
					if (result) { console.log('Finished writing response!'); }
					res.sendFile(dir + '\\CSE305Response.html');
				},
				function(err) { console.log(err); });
			} else {
				console.log(person);
				/* Call buildPage() to set up HTML response */
				page = buildPage(postBody.type, person, res);
				/* Send CSE305Response.html only when buildPage() returns */
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
		/* If search query was for a Show, call getTitles() */
		getTitles(postBody.name, function (title) {
			if (title == undefined || title.length == 0) {
				console.log("No results found!");
				/* If no Shows were found, call buildPage() with "Null" type */
				page = buildPage("Null", title, res);
				/* Send CSE305Response only when buildPage() returns */
				page.then(
				function(result) {
					if (result) { console.log('Finished writing response!'); }
					res.sendFile(dir + '\\CSE305Response.html');
				},
				function(err) { console.log(err); });
			} else {
				console.log(title);
				/* Call buildPage() to set up HTML response */
				page = buildPage(postBody.type, title, res);
				/* Send CSE305Response.html only when buildPage() returns */
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

/* Start the server by listening on port 8080. */
const server = app.listen(8080);
server.keepAliveTimeout = 60000 * 2;

/* Create connection to locally hosted MySQL database. */
var con = mysql.createConnection({
	database : 'IMDaveBen',
	host: "localhost",
	user: "root",
	password: "#SeaShanty"
});

/* Print to console on a successful connection. */
con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
});

/* Returns the names & IDs for a given people search. */
function getPeople(search, callback){
	con.query("SELECT PersonName, Id FROM Person WHERE PersonName LIKE'%" + search + "%'", function (err, result, fields) {
	if (err) throw err;
		return callback(result);
	});
}

/* Returns the names & IDs for a given show search. */
function getTitles(search, callback){
	con.query("SELECT ShowTitle, ShowYear FROM Shows WHERE ShowTitle LIKE'%" + search + "%'", function (err, result, fields) {
	if (err) throw err;
		return callback(result);
	});
}

/* Returns a specific person given their ID #. */
function getPerson(id, callback){
	con.query("SELECT * FROM Person WHERE Id = " + id + ";", function (err, result, fields) {
	if (err) throw err;
		return callback(result);
	});
}

<<<<<<< HEAD
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
=======
/* Return a specific Title given its primary key (ShowName, ShowYear) */
>>>>>>> 54df54bfe152d06f67236ed1831abe2b16383b08
function getTitle(name, year, callback){
	con.query("SELECT * FROM Shows WHERE ShowTitle = " + name + "AND ShowYear = " + year + ";", function (err, result, fields) {
	if (err) throw err;
		return callback(result);
	});
}

/* Generate response page for search query. */
var fs = require('fs');
var filename = dir + '\\CSE305Response.html';

/* Build CSE305Response.html by writing with file I/O. */
function buildPage(type, list, res) {
	/* Return a Promise to have response wait for write to complete */
	return new Promise((resolve, reject) => {
		/* Truncate server's copy of CSE305Response.html */
		fs.truncate(filename, 0, function() {console.log("Response file cleared!");});
		
		var body = '';
		if ((type == 'Titles' || type == 'People') && list != '') {
			console.log('Appending results...');
			/* If results list is not empty, add <table> to HTML body */
			body += '<table align=\"center\">';
			if (type == 'People') {
				/* Set up headers for Person attributes */
				body += '<th>Name</th><th>ID #</th>';
				/* Create a new row in the table for each search result */
				var i;
				for (i = 0; i < list.length; i++) {
					body += '<tr><td>' + list[i].PersonName + '</td><td>' + list[i].Id + '</tr>';
				}
			} else if (type == 'Titles') {
				/* Set up headers for Show attributes */
				body += '<th>Title</th><th>Year</th>';
				/* Create a new row in the table for each search result */
				var i;
				for (i = 0; i < list.length; i++) {
					body += '<tr><td>' + list[i].ShowTitle + '</td><td>' + list[i].ShowYear + '</tr>';
				}
			}
			/* Close the table and finish the body var */
			body += '</table>'
		} else {
			/* If results list is empty, display "No results found!" on response page */
			body += "<h1>No results found!</h1>";
		}
		/* Create HTML code from string constant */
		const html = ('<!DOCTYPE html><html><head><link rel=\"stylesheet\" href=\"style.css\"></head><body><img src=\"logo.png\" alt=\"IMDaveBen\" class = \"centerImage\">'
					+ '<div class=\"center\"><a href=\"/\">Back to query page</a>' + body + '</div></body></html>');
		/* Write completed HTML code to CSE305Response.html */
		fs.writeFile(dir + "\\CSE305Response.html", html, function (err) {
			if (err) { reject(err);	}
			resolve(true);
		});
	});
<<<<<<< HEAD
}

//Generate HTML code for response
function buildHTML(type, list) {

}
=======
}
>>>>>>> 54df54bfe152d06f67236ed1831abe2b16383b08
