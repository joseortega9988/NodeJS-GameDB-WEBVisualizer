// Import libraries
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
//const mustacheExpress = require('mustache-express');
const path = require("path");

// Initialise objects and declare constants
// Create app
const app = express();
// Declare webport
const port = 8800;

// create connection
const db = mysql.createConnection({
	host: "localhost",
	user: "sqluser",
	password: "password",
	database: 'steam_games_test'
});
// cahnge the database to steam_games for the lab

// run .connect() to make connection
db.connect((err) => {
	if(err) {
		throw err;
	}
	console.log("Connected to database");
});

global.db = db;

app.use(bodyParser.urlencoded({ extended: true }));

// Routes
require("./routes/main")(app);



// Templating engines
app.engine("html", require("ejs").renderFile);
app.set("views",__dirname +"/views");
app.set("view engine", "ejs");
//app.engine('ejs', mustacheExpress());

// Static files: use express.static to allow adding styles.css and scripts.js to the web app
app.use('/css', express.static(path.join(__dirname, "css")));
//app.use('/src', express.static(path.join(__dirname, "scr")));
app.use('/js', express.static(path.join(__dirname, "js")));


// Listen at the port
app.listen(port, () => console.log(`Node server is running... on port ${port}!`));