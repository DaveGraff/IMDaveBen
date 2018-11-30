//Initialize DB connection
var mysql = require('mysql');
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

//Delete old data
con.query("DROP DATABASE IF EXISTS IMDaveBen;");
con.query("CREATE DATABASE IMDaveBen;");
con.query("Use IMDaveBen;");

//Set up new Tables
con.query("CREATE TABLE Person(Id INTEGER, PersonName CHAR(40) NOT NULL, DOB CHAR(8), Hometown CHAR(30), Height CHAR(10), Gender ENUM('Male', 'Female', 'Intersex'), Biography TEXT, CHECK(LEN(DOB) = 8), PRIMARY KEY(Id));");
con.query("CREATE TABLE Studio(StudioName CHAR(30), Location CHAR(15), PRIMARY KEY(StudioName, Location));");
con.query("CREATE TABLE Shows(ShowTitle CHAR(30), ShowYear INTEGER, Genre CHAR(40), Reviews DOUBLE(2,2), Runtime INTEGER, Rating ENUM('G', 'PG', 'PG-13', 'R', 'NC-17', 'NR', 'TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'), Synopsis TEXT, StudioName CHAR(30), StudioLocation CHAR(3) DEFAULT 'USA', IsTVShow BOOLEAN, CHECK(ShowYear > 1850 AND ShowYear < 2019), FOREIGN KEY (StudioName, StudioLocation) REFERENCES Studio(StudioName, Location), PRIMARY KEY(ShowTitle, ShowYear));");
con.query("CREATE TABLE CrewMembers(PersonID INTEGER, Role CHAR(30), ShowTitle CHAR(30), ShowYear INTEGER, PRIMARY KEY(personID, Role, ShowTitle, ShowYear), FOREIGN KEY(ShowTitle, ShowYear) REFERENCES Shows(ShowTitle, ShowYear), FOREIGN KEY(PersonID) REFERENCES Person(Id));");
con.query("CREATE TABLE CastMembers(PersonID INTEGER, CharacterName CHAR(30), Role CHAR(30), ShowTitle CHAR(30), ShowYear INTEGER, PRIMARY KEY(personID, CharacterName, Role, ShowTitle, ShowYear), FOREIGN KEY(ShowTitle, ShowYear) REFERENCES Shows(ShowTitle, ShowYear),FOREIGN KEY(PersonID) REFERENCES Person(Id));");
con.query("CREATE TABLE Award(PersonID INTEGER, ShowTitle CHAR(30), ShowYear INTEGER, Academy CHAR(30), AwardName CHAR(30), YearAwarded INTEGER, CHECK(YearAwarded > 1850 AND YearAwarded < 2019), PRIMARY KEY(Academy, AwardName, YearAwarded), FOREIGN KEY(PersonID) REFERENCES Person(Id), FOREIGN KEY(ShowTitle, ShowYear) REFERENCES Shows(ShowTitle, ShowYear));");
con.query("CREATE TABLE Episode(EpisodeName CHAR(30) NOT NULL, ShowTitle CHAR(30), ShowYear INTEGER, EpisodeNum INTEGER, Season INTEGER, Synopsis TEXT, CHECK(EpisodeNum > 0 AND Season > 0), PRIMARY KEY(ShowTitle, ShowYear, EpisodeNum, Season), FOREIGN KEY(ShowTitle, ShowYear) REFERENCES Shows(ShowTitle, ShowYear));");

//Insert data
con.query("INSERT INTO Studio VALUES ('Paramount', 'USA')");
con.query("INSERT INTO Studio VALUES ('Fox', 'USA')");
con.query("INSERT INTO Studio VALUES ('Universal', 'USA')");
con.query("INSERT INTO Studio VALUES ('Sony', 'USA')");
con.query("INSERT INTO Studio VALUES ('TriStar', 'USA')");
con.query("INSERT INTO Studio VALUES ('Walt Disney', 'USA')");

con.query("INSERT INTO Person VALUES (0, 'Tom Cruise', NULL, 'Syracuse, NY', NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (1, 'Robert Downey Jr.', NULL, NULL, NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (2, 'Scarlett Johansson', NULL, NULL, NULL, 'Female', 'A cool lady')");
con.query("INSERT INTO Person VALUES (3, 'Tom Hanks', NULL, NULL, NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (4, 'Brad Pitt', NULL, NULL, NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (5, 'George Clooney', NULL, NULL, NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (6, 'Will Smith', NULL, NULL, NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (7, 'Matt Damon', NULL, NULL, NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (8, 'Johnny Depp', NULL, NULL, NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (9, 'Dwayne Johnson', NULL, NULL, NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (10, 'Harrison Ford', NULL, NULL, NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (11, 'Jim Carrey', NULL, NULL, NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (12, 'Meryl Streep', NULL, NULL, NULL, 'Female', 'A cool lady')");
con.query("INSERT INTO Person VALUES (13, 'Jennifer Lawrence', NULL, NULL, NULL, 'Female', 'A cool lady')");
con.query("INSERT INTO Person VALUES (14, 'Natalie Portman', NULL, NULL, NULL, 'Female', 'A cool lady')");
//con.query(INSERT INTO Show(Title, Year));
