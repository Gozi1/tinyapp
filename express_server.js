/** TO MENTOR I'LL MAKE SURE TO ADD THE CSS STYLING TOWARDS AT THE END OF TESTING OR REST */
const express = require("express");
var cookieSession = require('cookie-session')
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080; // default port 8080
const {getUserByEmail,urlsForUser,randomID} = require("./helpers");
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))




const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "user@example.com",
    password: bcrypt.hashSync("ab",10),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("ab",10),
  },
};


//Functions

//generates a random ID


//Get and post request


//Get all urls
 app.get("/urls", (req, res) => {
  const userID =req.session.user_id;
  
  const templateVars = { 
    urls: urlsForUser(userID,urlDatabase), 
    user: users[userID]
     };

     //if not logged in redirect to login page 
    //  if(!userID) res.redirect('/login');
    //  else res.render("urls_index",templateVars);
    if(!userID){

      templateVars.message = "Please log in or register to view your urls"
      res.render("error_page",templateVars);

    } else { res.render("urls_index",templateVars);}
 });

 // Get request for adding new urls
 app.get("/urls/new", (req, res) => {
  const userID =req.session.user_id
  const templateVars = {  
    user: users[userID]
     };
  
  //if not logged in redirect to login page 
  if(!userID) res.redirect('/login');
  else res.render("urls_new",templateVars);
});


// Get request for a specific url ID
 app.get("/urls/:id", (req, res) => {
  const userID =req.session.user_id
  const ID =req.params.id;
  const longURL = urlDatabase[ID];
  
  const templateVars = { 
    id: ID, 
    longURL:longURL.longURL,
    user: users[userID] };
  const userKeys =  Object.keys(urlsForUser(userID,urlDatabase));
 //urls does not exist 
  if(!longURL){
    res.status(400)
    templateVars.message = "URL Does not exist"
    res.render("error_page",templateVars)
    return ;
 }
  //user isnt logged in
  if(!userID){
    templateVars.message = "Please login or register"
    res.render("error_page",templateVars)
    return;
  }
  // if user doesnt own that url 
  if(!userKeys.includes(ID) ){
    templateVars.message = "You do not have access to this url"
    res.render("error_page",templateVars)
    return;
  }
  else{
    //url doesnt exist
     res.render("urls_show",templateVars);
    }
 });


// Get request for the actual website of the shortened url
 app.get("/u/:id", (req, res) => {
  const userID =req.session.user_id
  const ID =req.params.id;
  const longURLObj = urlDatabase[ID];
  //urls does not exist sends message
  if(!longURLObj) return res.status(400).send("URL does not exist in our database");

  res.redirect(longURLObj.longURL);
});


// Get request for making a new user page 
app.get("/register", (req, res) => {
  const userID =req.session.user_id
  const templateVars = {  
    user: users[userID]
     };

  //if logged in redirect to urls page
  if(userID) res.redirect('/urls');
  else res.render("urls_register",templateVars);
});


// Get request for logging in as an exist user page
app.get("/login", (req, res) => {
  const userID =req.session.user_id
  const templateVars = {  
    user: users[userID]
     };

     //if logged in redirect to urls page
     if(userID) res.redirect('/urls');
     else res.render("urls_login",templateVars);
});


// Post request for  creating new urls
 app.post("/urls", (req, res) => {
  // appends a random string to the posted url
  const shortUrl = randomID();
  const userID =req.session.user_id

  const longURL = req.body.longURL;
  
  urlDatabase[shortUrl] = {};
  urlDatabase[shortUrl].longURL =longURL;
  urlDatabase[shortUrl].userID = userID;
  const templateVars = { 
    id: shortUrl, 
    longURL:longURL,
    user: users[userID] };
  //if not logged in error message
  if(!userID) return res.status(400).send('Unidentified user cannot make requests');
  res.render("urls_show",templateVars); 
});


// Post request for deleting a specific url in the database
app.post("/urls/:id/delete", (req, res) => {
  const userID =req.session.user_id
  const ID =req.params.id;
  const longURL = urlDatabase[ID];
  const userKeys =  Object.keys(urlsForUser(userID,urlDatabase));
  const templateVars = {  
    user: users[userID]
     };
  if(!longURL){
    res.status(400)
    templateVars.message = "URL Does not exist"
    res.render("error_page",templateVars)
    return ;
  }
  if(!userID){
    res.status(400)
    templateVars.message = "user is not logged in"
    res.render("error_page",templateVars)
    return ;
  }
  if(!userKeys.includes(ID)){
    res.status(400)
    templateVars.message = "user does not own the URL"
    res.render("error_page",templateVars)
    return ;
  }
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});


// Post request for updating a specific url in the database
app.post("/urls/:id/update", (req, res) => {
  const userID =req.session.user_id
  const ID =req.params.id;
  const URL = urlDatabase[ID];
  const userKeys =  Object.keys(urlsForUser(userID,urlDatabase));
  const templateVars = {  
    user: users[userID]
     };   
  if(!URL){
    res.status(400).send("URL does not exists");
    templateVars.message = "URL Does not exist"
    res.render("error_page",templateVars)
    return ;
  }
  if(!userID){
    res.status(400)
    templateVars.message = "user is not logged in"
    res.render("error_page",templateVars)
    return ;
  }
  if(!userKeys.includes(ID)){
    res.status(400)
    templateVars.message = "user does not own the URL"
    res.render("error_page",templateVars)
    return ;
  }
  urlDatabase[req.params.id].longURL = req.body.newURL;
  res.redirect(`/urls/${req.params.id}`);
});


// Post request for login with conditions to prevent wrong login
app.post("/login", (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);

  
  if (!email || !password) {
    return res.status(400).send('email and password cannot be blank');
}
  //if user email exist but wrong password user returns undefined
  else if(!bcrypt.compareSync(password,user.password)) return res.status(403).send('wrong password');
  else if(user)req.session.user_id = user.id;
  else return res.status(403).send('user does not exist');

  res.redirect(`/urls`);
});

// Post request for  registering a new user
app.post("/register", (req, res) => {
  
  const randomUserID = randomID();
  
  const email = req.body.email;
  const password = req.body.password; 
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = getUserByEmail(email, users);
  if (!email || !password) {
        return res.status(400).send('email and password cannot be blank');
    }
     //if user exist
  else if (user) {
        return res.status(400).send("a user similar credentials already exists");
    }
  else{
  users[randomUserID] = {
    id:randomUserID,
    email: email,
    password: hashedPassword,
  };

  req.session.user_id = users[randomUserID].id
  
}

res.redirect('/urls');
});

// Post request for logging out
app.post("/logout", (req, res) => {
    
  req.session.user_id = undefined;
  res.redirect(`/login`);
});

//Listen request
 app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports = {getUserByEmail};