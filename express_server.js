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

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};



const randomID = ()=>{
  //length of the string 
  const len = 6;
  return Math.random().toString(36).substring(2,len+2);
}
const findUser = (cookies) =>{
  if(cookies.user_id) return cookies.user_id;
  return null;
}
const getUserByEmail =(cookies)=>{
  const user = findUser(cookies);
  if(user) return user.email;
  return null ;
}
 app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase, 
    user: req.cookies['user_id']
     };
  res.render("urls_index",templateVars);
 });

 app.get("/urls/new", (req, res) => {
  const templateVars = {  
    user: req.cookies['user_id']
     };
  res.render("urls_new",templateVars);
});
app.get("/register", (req, res) => {
  const templateVars = {  
    user: req.cookies['user_id']
     };
  res.render("urls_register",templateVars);
});


 app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL:urlDatabase[req.params.id],
    user: req.cookies['user_id'] };
  res.render("urls_show",templateVars);
 });

 app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

 app.post("/urls", (req, res) => {
  // appends a random string to the posted url
  const shortUrl = randomID();
  urlDatabase[shortUrl] = req.body.longURL;
  const templateVars = { 
    id: shortUrl, 
    longURL:urlDatabase[shortUrl],
    user: req.cookies['user_id'] };
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
  
  res.cookie('user_id',{email:req.body.user});

  res.redirect(`/urls`);
});

app.post("/register", (req, res) => {
  
  const randomUserID = randomID();
  
  if(req.body.email === '' ||req.body.password === '' 
  ||req.body.email === getUserByEmail(req.cookies)){
    res.sendStatus(400);
  
  }

  else{
  users[`user${randomUserID}ID`] = {
    id: `user${randomUserID}ID`,
    email: req.body.email,
    password: req.body.password,
  };

  res.cookie('user_id',users[`user${randomUserID}ID`]);
}
  res.redirect('/register');
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect(`/urls`);
});

 app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});