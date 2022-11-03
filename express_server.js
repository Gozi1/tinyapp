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


//Functions
const randomID = () =>{
  //length of the string 
  const len = 6;
  return Math.random().toString(36).substring(2,len+2);
}
const findUserByEmailAndPassword = (email, password) =>{

  for (const userId in users) {
      const user = users[userId];
      if (user.email === email) {
          if(user.password === password) return user;

          else return undefined;
      }
      
  }
  return null;
}


//Get and post request

//Get all urls
 app.get("/urls", (req, res) => {
  const userID =req.cookies['user_id'];
  const templateVars = { 
    urls: urlDatabase, 
    user: users[userID]
     };
  res.render("urls_index",templateVars);
 });

 //Get new url page
 app.get("/urls/new", (req, res) => {
  const userID =req.cookies['user_id']
  const templateVars = {  
    user: users[userID]
     };
  res.render("urls_new",templateVars);
});

 app.get("/urls/:id", (req, res) => {
  const userID =req.cookies['user_id']
  const templateVars = { 
    id: req.params.id, 
    longURL:urlDatabase[req.params.id],
    user: users[userID] };
  res.render("urls_show",templateVars);
 });

 //Get website for URL
 app.get("/u/:id", (req, res) => {
  const userID =req.cookies['user_id']
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

//Get register
app.get("/register", (req, res) => {
  const userID =req.cookies['user_id']
  const templateVars = {  
    user: users[userID]
     };
  res.render("urls_register",templateVars);
});
//Get login
app.get("/login", (req, res) => {
  const userID =req.cookies['user_id']
  const templateVars = {  
    user: users[userID]
     };
  res.render("urls_login",templateVars);
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
//Post urls id delete
app.post("/urls/:id/delete", (req, res) => {
  
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});
//Post urls ids update
app.post("/urls/:id/update", (req, res) => {
  
  urlDatabase[req.params.id] = req.body.newURL;
  res.redirect(`/urls/${req.params.id}`);
});
//Post Login
app.post("/login", (req, res) => {
  
  const email = req.body.email;
  const password = req.body.password;
  const user = findUserByEmailAndPassword(email, password);

  if(user)res.cookie('user_id',user.id);

  else if(user === undefined) return res.status(403).send('wrong password');

  else return res.status(403).send('user does not exist');

  res.redirect(`/urls`);
});

//Post register
app.post("/register", (req, res) => {
  
  const randomUserID = randomID();
  
  const email = req.body.email;
  const password = req.body.password;
    
  if (!email || !password) {
        return res.status(400).send('email and password cannot be blank');
    }
    const user = findUserByEmailAndPassword(email, password);
    console.log(user);
    if (user || user === undefined) {
        return res.status(400).send("a user similar credentials already exists");
    }

  else{
  users[`user${randomUserID}ID`] = {
    id: `user${randomUserID}ID`,
    email: req.body.email,
    password: req.body.password,
  };

  res.cookie('user_id',users[`user${randomUserID}ID`].id);
  
}

res.redirect('/urls');
});

//Post logout
app.post("/logout", (req, res) => {

  res.clearCookie('user_id');
  res.redirect(`/login`);
});

 app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});