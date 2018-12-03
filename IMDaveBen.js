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
				page = buildResponsePage("Null", person);
				/* Send CSE305Response.html only when buildResponsePage() returns */
				page.then(
				function(result) {
					if (result) { console.log('Finished writing response!'); }
					res.sendFile(dir + '\\CSE305Response.html');
				},
				function(err) { console.log(err); });
			} else {
				console.log(person);
				/* Call buildResponsePage() to set up HTML response */
				page = buildResponsePage(postBody.type, person);
				/* Send CSE305Response.html only when buildResponsePage() returns */
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
				/* If no Shows were found, call buildResponsePage() with "Null" type */
				page = buildResponsePage("Null", title);
				/* Send CSE305Response only when buildResponsePage() returns */
				page.then(
				function(result) {
					if (result) { console.log('Finished writing response!'); }
					res.sendFile(dir + '\\CSE305Response.html');
				},
				function(err) { console.log(err); });
			} else {
				console.log(title);
				/* Call buildResponsePage() to set up HTML response */
				page = buildResponsePage(postBody.type, title);
				/* Send CSE305Response.html only when buildResponsePage() returns */
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

/* Handle requests for specific entries in Person, Show, etc. */
app.post('/CSE305Entry.html', (req, res) => {
	/* Retrieve request body */
	const postBody = req.body;
	var page;
	console.log(postBody);
	if (postBody.Type == 'Person') {
		getPerson(postBody.ID, function(person) {
			if (person == '' || person.length == 0) {
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
			if (show == '' || show.length == 0) {
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

/* Return a specific Title given its primary key (ShowName, ShowYear) */
function getTitle(name, year, callback){
	con.query("SELECT * FROM Shows WHERE ShowTitle = \'" + name + "\' AND ShowYear = " + year + ";", function (err, result, fields) {
	if (err) throw err;
		return callback(result);
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
				body += '<form id=\"personEntry\" method=\"post\" action=\"/CSE305Entry.html\"><table align=\"center\">';
				/* Set up headers for Person attributes */
				body += '<th>Name</th><th>ID #</th>';
				/* Create a new row in the table for each search result */
				var i;
				for (i = 0; i < list.length; i++) {
					body += '<tr><td>' + list[i].PersonName + '</td><td>'
					+ '<input type=\"hidden\" name=\"Type\" value=\"Person\">'
					+ '<button type=\"submit\" name=\"ID\" value=\"' + list[i].Id
					+ '\" class=\"link-button\">' + list[i].Id + '</button></td></tr>';
				}
			} else if (type == 'Titles') {
				body += '<form id=\"showEntry\" method=\"post\" action=\"/CSE305Entry.html\"><table align=\"center\">';
				/* Set up headers for Show attributes */
				body += '<th>Title</th><th>Year</th>';
				/* Create a new row in the table for each search result */
				var i;
				for (i = 0; i < list.length; i++) {
					body += '<tr><td>' + list[i].ShowTitle + '</td><td>'
					+ '<input type=\"hidden\" name=\"Type\" value=\"Show\">'
					+ '<button type=\"submit\" name=\"Key\" value=\"' + list[i].ShowTitle + ',' + list[i].ShowYear
					+ '\" class=\"link-button\">' + list[i].ShowYear + '</button></td></tr>';
				}
			}
			/* Close the table and finish the body var */
			body += '</table></form>'
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
		fs.truncate(entryFile, 0, function() {
			console.log("Response file cleared!");
			}
		);

		var html = '<!DOCTYPE html><html>'
					+ '<head><link rel=\"stylesheet\" href=\"style.css\">'
					+ '<title>IMDaveBen</title></head>'
					+ '<body><img src=\"logo.png\" alt="IMDaveBen" class = \"centerImage\">'
					+ '<div class = \"center\"><a href=\"/\">Back to query page</a>';
		if (type == 'Null') {
			html += '<h1>Entry does not exist!<h1>';
		} else if (type == 'Person' && entry != '') {
			console.log('Building entry page...');
			if (type == 'Person') {
				html += '<h1>' + entry[0].PersonName + '</h1>'
						+ '<p>DOB:' + entry[0].DOB
						+ '<br>Hometown:' + entry[0].Hometown
						+ '<br>Height:' + entry[0].Height
						+ '<br>Gender:' + entry[0].Gender
						+ '</p>';
				html += '<h2>Biography</h2><p>' + entry[0].Biography + '</p>';
						+ '<p>DOB: ' + entry[0].DOB
						+ '<br>Hometown: ' + entry[0].Hometown
						+ '<br>Height: ' + entry[0].Height
						+ '<br>Gender: ' + entry[0].Gender
						+ '</p>';
				html += '<h2>Biography</h2><p>' + entry[0].Biography + '</p>';
				html += '<h3>Cast Roles</h3>';
				html += '<h3>Crew Roles</h3>';
				html += '<h3>Awards</h3>';
			} else {
				console.log('Invalid entry request!');
				reject('Invalid entry request!');
			}
			/* Complete HTML code by closing tags. */
		}
		html += '</div></body></html>';
		/* Write completed HTML code to CSE305Response.html */
		fs.writeFile(entryFile, html, function (err) {
			if (err) { reject(err);	}
			resolve(true);
		});
	});
}

function buildShowEntry(type, entry) {
	/* Return a Promise to have response wait for write to complete */
	return new Promise((resolve, reject) => {
		/* Truncate server's copy of CSE305Entry.html */
		fs.truncate(entryFile, 0, function() {console.log("Response file cleared!");});

		var html = '<!DOCTYPE html><html>'
					+ '<head><link rel=\"stylesheet\" href=\"style.css\">'
					+ '<title>IMDaveBen</title></head>'
					+ '<body><img src=\"logo.png\" alt="IMDaveBen" class = \"centerImage\">'
					+ '<div class = \"center\"><a href=\"/\">Back to query page</a>';
		if (type == 'Null') {
			html += '<h1>Entry does not exist!<h1>';
		} else if (type == 'Show' && entry != '') {
			console.log('Building entry page...');
			html += '<h1>' + entry[0].showTitle + '</h1>'
					+ '<h3>' + entry[0].StudioName + '</h3>'
					+ '<h3>' + entry[0].ShowYear + '</h3>'
					+ '<p>' + entry[0].Genre + '<br>'
					+ entry[0].Reviews + '<br>'
					+ entry[0].Runtime + '<br>'
					+ entry[0].Rating + '<br></p>'
					+ '<h3>Synopsis</h3>'
					+ '<p>' + entry[0].Synopsis + '</p>';
		} else {
			console.log('Invalid entry request!');
			reject('Invalid entry request!');
		}
		/* Complete HTML code by closing tags. */
		html += '</div></body></html>';
		/* Write completed HTML code to CSE305Response.html */
		fs.writeFile(entryFile, html, function (err) {
			if (err) { reject(err);	}
			resolve(true);
		});
	});
}
