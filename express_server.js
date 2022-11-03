const express = require("express");
const  cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const randomString = function generateRandomString() {
  //length of the string 
  const len = 6;
  return Math.random().toString(36).substring(2,len+2);
}
//I dont think I need these but I wasnt told to remove them so yh ...
// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });
// app.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
//  });
 
//  app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
//  });

 app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase, 
    username: req.cookies["username"]
     };
  res.render("urls_index",templateVars);
 });

 app.get("/urls/new", (req, res) => {
  const templateVars = {  
    username: req.cookies["username"]
     };
  res.render("urls_new",templateVars);
});
app.get("/register", (req, res) => {
  const templateVars = {  
    username: req.cookies["username"]
     };
  res.render("urls_register",templateVars);
});


 app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL:urlDatabase[req.params.id],
    username: req.cookies["username"] };
  res.render("urls_show",templateVars);
 });

 app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

 app.post("/urls", (req, res) => {
  // appends a random string to the posted url
  const shortUrl = randomString();
  urlDatabase[shortUrl] = req.body.longURL;
  const templateVars = { 
    id: shortUrl, 
    longURL:urlDatabase[shortUrl],
    username: req.cookies["username"] };
  res.render("urls_show",templateVars); 
});

app.post("/urls/:id/delete", (req, res) => {
  
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});
app.post("/urls/:id/update", (req, res) => {
  
  urlDatabase[req.params.id] = req.body.newURL;
  res.redirect(`/urls/${req.params.id}`);
});
app.post("/login", (req, res) => {
  
  res.cookie('username',req.body.username);
  console.log(req.body.username);
  res.redirect(`/urls`);
});
app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect(`/urls`);
});

 app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});