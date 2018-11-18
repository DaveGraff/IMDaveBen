DROP DATABASE IF EXISTS IMDaveBen;
CREATE DATABASE IMDaveBen;
Use IMDaveBen;
CREATE TABLE Person(
	Id			INTEGER,
    	PersonName		CHAR(40) NOT NULL,
    	DOB			CHAR(8), -- MM/DD/YYYY
    	Hometown		CHAR(30),
    	Height			CHAR(10),
    	Gender			ENUM('Male', 'Female', 'Intersex'),
    	Biography		TEXT,
	CHECK(LEN(DOB) = 8),
    	PRIMARY KEY(Id));
    
CREATE TABLE Studio(
	StudioName 		CHAR(30),
	Location		CHAR(15),
    	PRIMARY KEY(StudioName, Location));

CREATE TABLE Shows(
	ShowTitle		CHAR(30),
    	ShowYear		INTEGER,
    	Genre			CHAR(40),
	Reviews			DOUBLE(2,2), -- xx.xx/10
    	Runtime			INTEGER,
    	Rating			ENUM('G', 'PG', 'PG-13', 'R', 'NC-17', 'NR', 'TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'),
    	Synopsis		TEXT,
	StudioName		CHAR(30),
    	StudioLocation	CHAR(3) DEFAULT 'USA', -- 3 digit country code
	IsTVShow		BOOLEAN,
	CHECK(ShowYear > 1850 AND ShowYear < 2019),
    	FOREIGN KEY (StudioName, StudioLocation) REFERENCES Studio(StudioName, Location),
    	PRIMARY KEY(ShowTitle, ShowYear));

CREATE TABLE CrewMembers(
	PersonID		INTEGER,
    	Role			CHAR(30),
    	ShowTitle		CHAR(30),
    	ShowYear		INTEGER,
    	PRIMARY KEY(personID, Role, ShowTitle, ShowYear),
    	FOREIGN KEY(ShowTitle, ShowYear) REFERENCES Shows(ShowTitle, ShowYear),
    	FOREIGN KEY(PersonID) REFERENCES Person(Id));


CREATE TABLE CastMembers(
	PersonID		INTEGER,
    	CharacterName		CHAR(30),
    	Role			CHAR(30),
    	ShowTitle		CHAR(30),
    	ShowYear		INTEGER,
    	PRIMARY KEY(personID, CharacterName, Role, ShowTitle, ShowYear),
    	FOREIGN KEY(ShowTitle, ShowYear) REFERENCES Shows(ShowTitle, ShowYear),
    	FOREIGN KEY(PersonID) REFERENCES Person(Id));

CREATE TABLE Award(
	PersonID		INTEGER,
    	ShowTitle		CHAR(30),
    	ShowYear		INTEGER,
    	Academy			CHAR(30),
	AwardName		CHAR(30),
    	YearAwarded		INTEGER,    	
	CHECK(YearAwarded > 1850 AND YearAwarded < 2019),
	PRIMARY KEY(Academy, AwardName, YearAwarded),
    	FOREIGN KEY(PersonID) REFERENCES Person(Id),
    	FOREIGN KEY(ShowTitle, ShowYear) REFERENCES Shows(ShowTitle, ShowYear));
    
CREATE TABLE Episode(
	EpisodeName		CHAR(30) NOT NULL,
    	ShowTitle		CHAR(30),
    	ShowYear		CHAR(30),
	EpisodeNum		INTEGER,
    	Season			INTEGER,
    	Synopsis		TEXT,
    	CHECK(EpisodeNum > 0 AND Season > 0),
    	PRIMARY KEY(ShowTitle, ShowYear, EpisodeNum, Season),
    	FOREIGN KEY(ShowTitle, ShowYear) REFERENCES Shows(ShowTitle, ShowYear));
