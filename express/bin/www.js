var express = require('express'),
    app = express(),
    session = require('express-session'),
    mysql = require('mysql');
app.use(session({
  secret: Math.random().toString(36).slice(2, 7),
  resave: true,
  saveUninitialized: true
}));
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'my-secret-pw'
})
connection.query("CREATE DATABASE users");
connection.query(`
CREATE TABLE Persons
 (
  Username varchar(32) NOT NULL,
  Password varchar(255) NOT NULL,
  UNIQUE (Username)
);
CREATE TABLE Roles
 (
  Role varchar(32) NOT NULL,
  Permissions bigint,
  UNIQUE (Username)
);
CREATE TABLE Messages
(
  ID int NOT NULL,
  Username varchar(32) NOT NULL,
  Message varchar(1024)
);
  `)
// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user === "amy" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};

// Login endpoint
app.get('/login', function (req, res) {
  if (!req.query.username || !req.query.password) {
    res.send('login failed');
  } else if(req.query.username === "amy" || req.query.password === "amyspassword") {
    req.session.user = "amy";
    req.session.admin = true;
    res.send("login success!");
  }
});

// Logout endpoint
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.send("logout success!");
});

// Get content endpoint
app.get('/content', auth, function (req, res) {
  res.send("You can only see this after you've logged in.");
});
app.get('/user', auth, function (req,res){
  res.send()
})
app.listen(3000);
console.log("app running at http://localhost:3000");