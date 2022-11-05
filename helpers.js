const randomID = () =>{
  //length of the string
  const len = 6;
  return Math.random().toString(36).substring(2,len + 2);
};

const getUserByEmail = function(email, database) {
  // lookup magic...
  for (const userId in database) {
    const user = database[userId];
    if (user.email === email) return user;
  }
  return undefined;
};

const urlsForUser = (id,database)=>{
  // Convert `obj` to a key/value array
  const asArray = Object.entries(database);
  // filters array to find items with id
  const filtered = asArray.filter(([key, value]) => value.userID === id);
  // converts array back to obect
  const fitleredObj = Object.fromEntries(filtered);
  
  return fitleredObj;
};
module.exports = {getUserByEmail,urlsForUser,randomID};