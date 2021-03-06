const mysql = require('mysql');
const querystring = require('querystring');
const path = require('path');
const dir = path.dirname(require.main.filename);

const express = require('express');
const bodyParser = require('body-parser');
const app = new express();

/* Generate response page for search query. */
const fs = require('fs');
const logoFile = dir + '\\logo.png';
const styleFile = dir + '\\style.css';
const searchFile = dir + '\\CSE305Search.html';
const responseFile = dir + '\\CSE305Response.html';
const entryFile = dir + '\\CSE305Entry.html';

/* Setup for body-parser module. */
app.use(bodyParser.urlencoded({ extended: false }));

/* Respond to general requests with main page CSE305Search.html. */
app.get('/', function(req, res){
	res.sendFile(searchFile);
});

/* Respond to search queries with CSE305Response.html. */
app.get('/CSE305Response.html', function (req, res) {
	res.sendFile(responseFile);
});

/* Send style.css on request for each webpage. */
app.get('/style.css', function(req, res){
	res.sendFile(styleFile);
});

/* Send logo image file on request for each page. */
app.get('/logo.png', function(req, res){
	res.sendFile(logoFile);
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
				buildResponsePage("Null", person).then(
				function(result) {
					if (result) { console.log('Finished writing response!'); }
					res.sendFile(dir + '\\CSE305Response.html');
				},
				function(err) { console.log(err); });
			} else {
				console.log(person);
				/* Call buildResponsePage() to set up HTML response, and send only when method returns */
				buildResponsePage(postBody.type, person).then(
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
				/* If no Shows were found, call buildResponsePage() with "Null" type */
				page = buildResponsePage("Null", title).then(
				function(result) {
					if (result) { console.log('Finished writing response!'); }
					res.sendFile(dir + '\\CSE305Response.html');
				},
				function(err) { console.log(err); });
			} else {
				console.log(title);
				/* Call buildResponsePage() to set up HTML response */
				buildResponsePage(postBody.type, title).then(
				function(result) {
					if (result) { console.log('Finished writing response!'); }
					res.sendFile(dir + '\\CSE305Response.html');
				},
				function(err) { console.log(err); });
			}
		});
	}
});

/* Handle requests for specific entries in Person, Show, etc. */
app.post('/CSE305Entry.html', (req, res) => {
	/* Retrieve request body */
	const postBody = req.body;
	var page;
	console.log(postBody);
	if (postBody.Type == 'Person') {
		getPerson(postBody.ID, function(person) {
			if (person == undefined || person == '' || person.length == 0) {
				console.log('Person not found!');
				page = buildPersonEntry('Null', person);
				page.then(
				function(result) {
					if (result) { console.log('Finished building entry page!'); }
					res.sendFile(entryFile);
				},
				function(err) { console.log(err); });
			} else {
				console.log(person);
				page = buildPersonEntry(postBody.Type, person);
				page.then(
				function(result) {
					if (result) { console.log('Finished building entry page!'); }
					res.sendFile(entryFile);
				},
				function(err) { console.log(err); });
			}
		});
	} else if (postBody.Type == 'Show') {
		var ind = postBody.Key.indexOf(',');
		var title = postBody.Key.substring(0, ind);
		var year = postBody.Key.substring(ind + 1);
		getTitle(title, year, function(show) {
			if (show == undefined || show == '' || show.length == 0) {
				console.log('Show not found!');
				page = buildShowEntry('Null', show);
				page.then(
				function(result) {
					if (result) {
						console.log('Finished building entry page!');
						res.sendFile(entryFile);
					} else { console.log('Could not build entry page!'); }
				},
				function(err) { console.log(err); });
			} else {
				console.log(show);
				page = buildShowEntry(postBody.Type, show);
				page.then(
				function(result) {
					if (result) {
						console.log('Finished building entry page!');
						res.sendFile(entryFile);
					} else { console.log('Could not build entry page!'); }
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
	con.query("SELECT ShowTitle, ShowYear FROM Shows WHERE ShowTitle LIKE'%" + search + "%' ORDER BY ShowYear DESC;", function (err, result, fields) {
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

function getPersonCastRoles(id, callback){
	return new Promise((resolve, reject) => {
		con.query("SELECT * FROM CastMembers WHERE PersonId = " + id + " ORDER BY ShowYear, ShowTitle;",
		function (err, result, fields) {
			if (err) { reject(err); }
			else { resolve(callback(result)); }
		});
	});
}

function getPersonCrewRoles(id, callback){
	return new Promise((resolve, reject) => {
		con.query("SELECT * FROM CrewMembers WHERE PersonId = " + id + " ORDER BY ShowYear, ShowTitle;",
		function (err, result, fields) {
			if (err) { reject(err); }
			else { resolve(callback(result)); }
		});
	});
}

function getPersonAwards(id, callback){
	return new Promise((resolve, reject) => {
		con.query("SELECT AwardName, YearAwarded, Academy FROM Award WHERE PersonId = " + id + " ORDER BY YearAwarded;",
		function (err, result, fields) {
			if (err) { reject(err); }
			else { resolve(callback(result)); }
		});
	});
}

/* Return a specific Title given its primary key (ShowName, ShowYear) */
function getTitle(name, year, callback) {
	con.query("SELECT * FROM Shows WHERE ShowTitle = \'" + name + "\' AND ShowYear = " + year + ";", function (err, result, fields) {
	if (err) throw err;
		return callback(result);
	});
}

function getTitleCast(name, year, callback){
	return new Promise((resolve, reject) => {
		con.query("SELECT P.PersonName, C.Role, C.CharacterName "
		+ "FROM CastMembers C, Person P "
		+ "WHERE C.PersonID = P.ID AND C.showTitle = \'" + name + "\' AND C.ShowYear = " + year + ";",
		function (err, result, fields) {
			if (err) { reject(err); }
			else { resolve(callback(result)); }
		});
	});
}

function getTitleCrew(name, year, callback){
	return new Promise((resolve, reject) => {
		con.query("SELECT P.PersonName, C.Role "
		+ "FROM CrewMembers C, Person P "
		+ "WHERE C.PersonID = P.ID AND C.showTitle = \'" + name + "\' AND C.ShowYear = " + year + ";",
		function (err, result, fields) {
			if (err) { reject(err); }
			else { resolve(callback(result)); }
		});
	});
}

/* Build CSE305Response.html by writing with file I/O. */
function buildResponsePage(type, list) {
	/* Return a Promise to have response wait for write to complete */
	return new Promise((resolve, reject) => {
		/* Truncate server's copy of CSE305Response.html */
		fs.truncate(responseFile, 0, function() {console.log("Response file cleared!");});

		var body = '';
		if ((type == 'Titles' || type == 'People') && list != '') {
			console.log('Appending results...');
			/* If results list is not empty, add <table> to HTML body */
			if (type == 'People') {
				/* Set up headers for Person attributes */
				body += '<table align=\"center\"><th>Name</th><th>ID #</th>';
				/* Create a new row in the table for each search result */
				var i;
				for (i = 0; i < list.length; i++) {
					body += '<tr><td>' + list[i].PersonName + '</td><td>'
					+ '<form id=\"personEntry\" method=\"post\" action=\"/CSE305Entry.html\">'
					+ '<input type=\"hidden\" name=\"Type\" value=\"Person\">'
					+ '<button type=\"submit\" name=\"ID\" value=\"' + list[i].Id
					+ '\" class=\"link-button\">' + list[i].Id + '</button></form></td></tr>';
				}
			} else if (type == 'Titles') {
				/* Set up headers for Show attributes */
				body += '<table align=\"center\"><th>Title</th><th>Year</th>';
				/* Create a new row in the table for each search result */
				var i;
				for (i = 0; i < list.length; i++) {
					body += '<tr><td>' + list[i].ShowTitle + '</td><td>'
					+ '<form id=\"showEntry\" method=\"post\" action=\"/CSE305Entry.html\">'
					+ '<input type=\"hidden\" name=\"Type\" value=\"Show\">'
					+ '<button type=\"submit\" name=\"Key\" value=\"' + list[i].ShowTitle + ',' + list[i].ShowYear
					+ '\" class=\"link-button\">' + list[i].ShowYear + '</button></form></td></tr>';
				}
			}
			/* Close the table and finish the body var */
			body += '</table>';
		} else {
			/* If results list is empty, display "No results found!" on response page */
			body += "<h1>No results found!</h1>";
		}
		/* Create HTML code from string constant */
		const html = ('<!DOCTYPE html><html><head><link rel=\"stylesheet\" href=\"style.css\"></head>'
					+ '<body><img src=\"logo.png\" alt=\"IMDaveBen\" class = \"centerImage\">'
					+ '<div class=\"center\"><a href=\"/\">Back to query page</a>'
					+ body + '</div></body></html>');
		/* Write completed HTML code to CSE305Response.html */
		fs.writeFile(responseFile, html, function (err) {
			if (err) { reject(err);	}
			resolve(true);
		});
	});
}

/* Build CSE305Entry.html by writing with file I/O. */
function buildPersonEntry(type, entry) {
	/* Return a Promise to have response wait for write to complete */
	return new Promise((resolve, reject) => {
		/* Truncate server's copy of CSE305Entry.html */
		fs.truncate(entryFile, 0,
		function() {
			console.log("Response file cleared!");
		});

		var html = '<!DOCTYPE html><html>'
					+ '<head><link rel=\"stylesheet\" href=\"style.css\">'
					+ '<title>IMDaveBen</title></head>'
					+ '<body><img src=\"logo.png\" alt="IMDaveBen" class = \"centerImage\">'
					+ '<div class = \"center\"><a href=\"/\">Back to query page</a>';
		if (type == 'Null') {
			html += '<h1>Entry does not exist!<h1>';
		} else if (type == 'Person' && entry != undefined) {
			console.log('Building entry page...');

			var cast, crew, awards;
			getPersonCastRoles(entry[0].Id, function(result) {
				cast = result;
				html += '<h1>' + entry[0].PersonName + '</h1>'
					+ '<p>' + entry[0].Gender + ' | ' + entry[0].Height + ' | Born ' +  entry[0].DOB + ' in ' + entry[0].Hometown + '</p>';
				html += '<h2>Biography</h2><p>' + entry[0].Biography + '</p>';
				/* Query database for list of roles that this Person has had */
				html += '<h2>Credits</h2>';
				if (cast != undefined) {
					console.log(cast);
					if (cast != '' && cast.length != 0) {
						html += '<table style=\"width:75%\" align=\"center\"><th>Character Name</th><th>Role</th><th>Show Title</th>';
						var i;
						for (i = 0; i < cast.length; i++) {
							html += '<tr><td>' + cast[i].CharacterName + '</td>'
									+ '<td>' + cast[i].Role + '</td>'
									+ '<td>' + cast[i].showTitle + ' (' + cast[i].ShowYear + ')</td></tr>';
						}
						html += '</table>';
					}
				}
			}).then(
			getPersonCrewRoles(entry[0].Id, function(result) {
				crew = result;
				if (crew != undefined) {
					console.log(crew);
					if (crew != '' && crew.length != 0) {
						html += '<table style=\"width:75%\" align=\"center\"><th>Role</th><th>Show Title</th>';
						var i;
						for (i = 0; i < crew.length; i++) {
							html += '<tr><td>' + crew[i].Role + '</td>'
									+ '<td>' + crew[i].showTitle + ' (' + crew[i].ShowYear + ')</td></tr>';
						}
						html += '</table>';
					}
				}
			}).then(
			getPersonAwards(entry[0].Id, function(result) {
				awards = result;
				html += '<h2>Awards</h2>';
				if (awards != undefined) {
					console.log(awards);
					if (awards != '' && awards.length != 0) {
						html += '<table style=\"width:75%\" align=\"center\"><th>Award Name</th><th>Year Awarded</th><th>Academy</th>';
						var i;
						for (i = 0; i < awards.length; i++) {
							html += '<tr><td>' + awards[i].AwardName + '</td>'
									+ '<td>' + awards[i].YearAwarded + '</td>'
									+ '<td>' + awards[i].Academy +'</tr>';
						}
						html += '</table>';
					}
				}

				/* Complete HTML code by closing tags. */
				html += '</div></body></html>';
				/* Write completed HTML code to CSE305Response.html */
				fs.writeFile(entryFile, html, function (err) {
					if (err) { reject(err);	}
					resolve(true);
				});
			})));
		} else {
			console.log('Invalid entry request!');
			reject('Invalid entry request!');
		}
	});
}

/* Build CSE305Entry.html by writing with file I/O. */
function buildShowEntry(type, entry) {
	/* Return a Promise to have response wait for write to complete */
	return new Promise((resolve, reject) => {
		/* Truncate server's copy of CSE305Entry.html */
		fs.truncate(entryFile, 0, function() {console.log("Response file cleared!");});

		var html = '<!DOCTYPE html><html>'
					+ '<head><link rel=\"stylesheet\" href=\"style.css\">'
					+ '<title>IMDaveBen</title></head>'
					+ '<body><img src=\"logo.png\" alt="IMDaveBen" class = \"centerImage\">'
					+ '<div class=\"center"><a href=\"/\">Back to query page</a>';
		if (type == 'Null') {
			html += '<h1>Entry does not exist!<h1>';
		} else if (type == 'Show' && entry != '') {
			console.log('Building entry page...');

			var cast, crew, awards;
			getTitleCast(entry[0].showTitle, entry[0].ShowYear, function(result) {
				html += '<h1>' + entry[0].showTitle + ' (' + entry[0].ShowYear + ')</h1>'
				+ '<p>' + entry[0].Rating + ' | ' + parseInt(entry[0].Runtime / 60) + 'h ' + entry[0].Runtime % 60 + 'min | ' + entry[0].Genre + ' | ' + entry[0].Reviews + '/10 </br>'
					+ 'Produced by ' + entry[0].StudioName + '</p>'
					+ '<h2>Synopsis</h2>'
					+ '<p>' + entry[0].Synopsis + '</p>';
				html += '<h2>Cast & Crew</h2>';

				cast = result;
				if (cast != undefined) {
					console.log(cast);
					if (cast != '' && cast.length != 0) {
						html += '<table style=\"width:75%\" align=\"center\"><th>Character</th><th>Actor/Actress</th><th>Role</th>';
						var i;
						for (i = 0; i < cast.length; i++) {
							html += '<tr><td>' + cast[i].CharacterName + '</td>'
									+ '<td>' + cast[i].PersonName + '</td>'
									+ '<td>' + cast[i].Role + '</td></tr>';
						}
						html += '</table>';
					}
				}
			}).then(
			getTitleCrew(entry[0].showTitle, entry[0].ShowYear, function(result) {
				crew = result;
				if (crew != undefined) {
					console.log(crew);
					if (crew != '' && crew.length != 0) {
						html += '<table style=\"width:75%\" align=\"center\"><th>Role</th><th>Person</th>';
						var i;
						for (i = 0; i < crew.length; i++) {
							html += '<tr><td>' + crew[i].Role + '</td>'
									+ '<td>' + crew[i].PersonName + '</td>'
									+ '</tr>';
						}
						html += '</table>';
					}
				}

				/* Complete HTML code by closing tags. */
				html += '</div></body></html>';
				/* Write completed HTML code to CSE305Response.html */
				fs.writeFile(entryFile, html, function (err) {
					if (err) { reject(err);	}
					resolve(true);
				});
			}));
		} else {
			console.log('Invalid entry request!');
			reject('Invalid entry request!');
		}
	});
}
