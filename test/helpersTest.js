const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert(user.id === expectedUserID,"does not returns user with valid email");
  });
  it('should return undefined for user with invalid email', function() {
    const user = getUserByEmail("user200@example.com", testUsers);
    const expectedUser = undefined;
    // Write your assert statement here
    assert(user === expectedUser,"does not returns user with valid email");
  });
});