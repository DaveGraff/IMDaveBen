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
con.query("CREATE TABLE Shows(showTitle CHAR(60), ShowYear INTEGER, Genre CHAR(40), Reviews DECIMAL(4,2), Runtime INTEGER, Rating ENUM('G', 'PG', 'PG-13', 'R', 'NC-17', 'NR', 'TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'), Synopsis TEXT, StudioName CHAR(30), StudioLocation CHAR(3) DEFAULT 'USA', IsTVShow BOOLEAN, CHECK(ShowYear > 1850 AND ShowYear < 2019), FOREIGN KEY (StudioName, StudioLocation) REFERENCES Studio(StudioName, Location), PRIMARY KEY(ShowTitle, ShowYear));");
con.query("CREATE TABLE CrewMembers(PersonID INTEGER, Role CHAR(30), showTitle CHAR(60), ShowYear INTEGER, PRIMARY KEY(personID, Role, ShowTitle, ShowYear), FOREIGN KEY(ShowTitle, ShowYear) REFERENCES Shows(ShowTitle, ShowYear), FOREIGN KEY(PersonID) REFERENCES Person(Id));");
con.query("CREATE TABLE CastMembers(PersonID INTEGER, CharacterName CHAR(30), Role CHAR(30), showTitle CHAR(60), ShowYear INTEGER, PRIMARY KEY(personID, CharacterName, Role, ShowTitle, ShowYear), FOREIGN KEY(ShowTitle, ShowYear) REFERENCES Shows(ShowTitle, ShowYear),FOREIGN KEY(PersonID) REFERENCES Person(Id));");
con.query("CREATE TABLE Award(PersonID INTEGER, showTitle CHAR(60), ShowYear INTEGER, Academy CHAR(30), AwardName CHAR(30), YearAwarded INTEGER, CHECK(YearAwarded > 1850 AND YearAwarded < 2019), PRIMARY KEY(Academy, AwardName, YearAwarded), FOREIGN KEY(PersonID) REFERENCES Person(Id), FOREIGN KEY(ShowTitle, ShowYear) REFERENCES Shows(ShowTitle, ShowYear));");
con.query("CREATE TABLE Episode(EpisodeName CHAR(30) NOT NULL, showTitle CHAR(60), ShowYear INTEGER, EpisodeNum INTEGER, Season INTEGER, Synopsis TEXT, CHECK(EpisodeNum > 0 AND Season > 0), PRIMARY KEY(ShowTitle, ShowYear, EpisodeNum, Season), FOREIGN KEY(ShowTitle, ShowYear) REFERENCES Shows(ShowTitle, ShowYear));");

//Insert data
//Studios
con.query("INSERT INTO Studio VALUES ('Paramount', 'USA')");
con.query("INSERT INTO Studio VALUES ('Fox', 'USA')");
con.query("INSERT INTO Studio VALUES ('Universal', 'USA')");
con.query("INSERT INTO Studio VALUES ('Sony', 'USA')");
con.query("INSERT INTO Studio VALUES ('Pixar', 'USA')");
con.query("INSERT INTO Studio VALUES ('Marvel', 'USA')");
con.query("INSERT INTO Studio VALUES ('New Line Cinema', 'USA')");
con.query("INSERT INTO Studio VALUES ('Walt Disney', 'USA')");

//People
con.query("INSERT INTO Person VALUES (0, 'Tom Cruise', '7/3/1968', 'Syracuse, NY', NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (1, 'Robert Downey Jr.', NULL, NULL, NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (2, 'Scarlett Johansson', NULL, NULL, NULL, 'Female', 'A cool lady')");
con.query("INSERT INTO Person VALUES (3, 'Tom Hanks', NULL, NULL, NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (4, 'Brad Pitt', NULL, NULL, NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (5, 'George Clooney', NULL, NULL, NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (6, 'Will Smith', NULL, NULL, NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (7, 'Matt Damon', NULL, NULL, NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (8, 'Johnny Depp', '7/9/1963', 'Owensboro, Kentucky', NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (9, 'Dwayne Johnson', NULL, NULL, NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (10, 'Harrison Ford', NULL, NULL, NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (11, 'Jim Carrey', NULL, NULL, NULL, 'Male', 'A cool dude')");
con.query("INSERT INTO Person VALUES (12, 'Meryl Streep', NULL, NULL, NULL, 'Female', 'A cool lady')");
con.query("INSERT INTO Person VALUES (13, 'Jennifer Lawrence', NULL, NULL, NULL, 'Female', 'A cool lady')");
con.query("INSERT INTO Person VALUES (14, 'Natalie Portman', NULL, NULL, NULL, 'Female', 'A cool lady')");

//Shows
con.query("INSERT INTO Shows VALUES ('Up', 2009, 'Animation, Adventure, Comedy', 8.3, 96, 'PG', 'Seventy-eight year old Carl Fredricksen travels to Paradise Falls in his home equipped with balloons, inadvertently taking a young stowaway.', 'Pixar', 'USA', false)");
con.query("INSERT INTO Shows VALUES ('Deadpool', 2016, 'Action, Adventure, Comedy', 8, 108, 'R', 'A fast-talking mercenary with a morbid sense of humor is subjected to a rogue experiment that leaves him with accelerated healing powers and a quest for revenge.', 'Marvel', 'USA', false)");
con.query("INSERT INTO Shows VALUES ('Rush Hour', 1998, 'Action, Comedy, Crime', 7, 98, 'PG-13', 'A loyal and dedicated Hong Kong Inspector teams up with a reckless and loudmouthed L.A.P.D. detective to rescue the Chinese Consuls kidnapped daughter, while trying to arrest a dangerous crime lord along the way.', 'New Line Cinema', 'USA', false)");
con.query("INSERT INTO Shows VALUES ('Rush Hour 2', 2001, 'Action, Comedy, Crime', 6.6, 90, 'PG-13', 'Carter and Lee head to Hong Kong for a vacation, but become embroiled in a counterfeit money scam.', 'New Line Cinema', 'USA', false)");
con.query("INSERT INTO Shows VALUES ('Rush Hour 3', 2007, 'Action, Comedy, Crime', 6.2, 91, 'PG-13', 'After an attempted assassination on Ambassador Han, Lee and Carter head to Paris to protect a French woman with knowledge of the Triads secret leaders.', 'New Line Cinema', 'USA', false)");
con.query("INSERT INTO Shows VALUES ('Pirates of the Caribbean: The Curse of the Black Pearl', 2003, 'Action, Adventure, Fantasy', 8, 143, 'PG-13', 'Blacksmith Will Turner teams up with eccentric pirate Captain Jack Sparrow to save his love, the governors daughter, from Jacks former pirate allies, who are now undead.', 'Walt Disney', 'USA', false)");
con.query("INSERT INTO Shows VALUES ('The Lone Ranger', 2013, 'Action, Adventure, Western', 6.4, 150, 'PG-13', 'Native American warrior Tonto recounts the untold tales that transformed John Reid, a man of the law, into a legend of justice.', 'Walt Disney', 'USA', false)");
con.query("INSERT INTO Shows VALUES ('A Nightmare on Elm Street', 1984, 'Horror', 5.5, 91, 'R', 'The monstrous spirit of a slain janitor seeks revenge by invading the dreams of teenagers whose parents were responsible for his untimely death.', 'New Line Cinema', 'USA', false)");
con.query("INSERT INTO Shows VALUES ('Alice in Wonderland', 2010, 'Adventure, Family, Fantasy', 6.5, 108, 'PG', 'Nineteen-year-old Alice returns to the magical world from her childhood adventure, where she reunites with her old friends and learns of her true destiny: to end the Red Queens reign of terror.', 'Walt Disney', 'USA', false)");
con.query("INSERT INTO Shows VALUES ('Untitled Keith Richards Documentary', 2016, 'Documentary', 5.6, NULL, NULL, 'A glimpse into the life of The Rolling Stones guitarist Keith Richards, whose musical career spans across five decades.', NULL, NULL, false)");

//Cast
con.query("INSERT INTO CastMembers VALUES (8, 'Captain Jack Sparrow', 'Lead Actor', 'Pirates of the Caribbean: The Curse of the Black Pearl', 2003)");
con.query("INSERT INTO CastMembers VALUES (8, 'Tonto', 'Lead Actor', 'The Lone Ranger', 2013)");
con.query("INSERT INTO CastMembers VALUES (8, 'Glen Lantz', 'Lead Actor', 'A Nightmare on Elm Street', 1984)");
con.query("INSERT INTO CastMembers VALUES (8, 'The Mad Hatter', 'Lead Actor', 'Alice in Wonderland', 2010)");

//Crew
con.query("INSERT INTO CrewMembers VALUES (8, 'Director', 'Untitled Keith Richards Documentary', 2016)")
