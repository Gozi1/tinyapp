/** TO MENTOR I'LL MAKE SURE TO ADD THE CSS STYLING TOWARDS AT THE END OF TESTING OR REST */
const express = require("express");
const  cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());




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

//generates a random ID
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
          //if password is wrong but email exist 
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

     //if not logged in redirect to login page 
    //  if(!userID) res.redirect('/login');
    //  else res.render("urls_index",templateVars);
    if(!userID){

      templateVars.message = "Please log in or register to view your urls"
      res.render("error_page",templateVars);

    } else res.render("urls_index",templateVars);
 });

 // Get request for adding new urls
 app.get("/urls/new", (req, res) => {
  const userID =req.cookies['user_id']
  const templateVars = {  
    user: users[userID]
     };
  
  //if not logged in redirect to login page 
  if(!userID) res.redirect('/login');
  else res.render("urls_new",templateVars);
});

// Get request for a specific url ID
 app.get("/urls/:id", (req, res) => {
  const userID =req.cookies['user_id']
  const ID =req.params.id;
  const templateVars = { 
    id: ID, 
    longURL:urlDatabase[ID].longURL,
    user: users[userID] };
  if(!userID) res.redirect('/login');
  else{

    if(!urlDatabase[ID]) return res.status(400).send("URL does not exist in our database");
  
     res.render("urls_show",templateVars);
    }
 });

// Get request for the actual website of the shortened url
 app.get("/u/:id", (req, res) => {
  const userID =req.cookies['user_id']
  const ID =req.params.id;
  const longURL = urlDatabase[ID].longURL;
  //urls does not exist sends message
  if(!longURL) return res.status(400).send("URL does not exist in our database");

  res.redirect(longURL);
});

// Get request for making a new user page 
app.get("/register", (req, res) => {
  const userID =req.cookies['user_id']
  const templateVars = {  
    user: users[userID]
     };

  //if logged in redirect to urls page
  if(userID) res.redirect('/urls');
  else res.render("urls_register",templateVars);
});
// Get request for logging in as an exist user page
app.get("/login", (req, res) => {
  const userID =req.cookies['user_id']
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
  const userID =req.cookies['user_id']

  urlDatabase[shortUrl].longURL = req.body.longURL;
  urlDatabase[shortUrl].userID = userID;
  const templateVars = { 
    id: shortUrl, 
    longURL:urlDatabase[shortUrl].longURL,
    user: userID };
  //if not logged in error message
  if(!userID) return res.status(400).send('Unidentified user cannot make requests');
  res.render("urls_show",templateVars); 
});
// Post request for deleting a specific url in the database
app.post("/urls/:id/delete", (req, res) => {
  
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});
// Post request for updating a specific url in the database
app.post("/urls/:id/update", (req, res) => {
  
  urlDatabase[req.params.id].longURL = req.body.newURL;
  res.redirect(`/urls/${req.params.id}`);
});
// Post request for login with conditions to prevent wrong login
app.post("/login", (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  const user = findUserByEmailAndPassword(email, password);

  if(user)res.cookie('user_id',user.id);
  //if user email exist but wrong password user returns undefined
  else if(user === undefined) return res.status(403).send('wrong password');

  else return res.status(403).send('user does not exist');

  res.redirect(`/urls`);
});

// Post request for  registering a new user
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

// Post request for logging out
app.post("/logout", (req, res) => {

  res.clearCookie('user_id');
  res.redirect(`/login`);
});

//Listen request
 app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});