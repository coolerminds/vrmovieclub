const fs = require('fs');
const bcrypt = require('bcryptjs');
const users = require('./clubUsers2.json');
let nRounds = 12;
let hashedUsers = [];
let start = new Date(); // timing code
console.log(`Starting password hashing with nRounds = ${nRounds}, ${start}`);

// Your code here to process the passwords
let salt = bcrypt.genSaltSync(nRounds);
users.forEach(function(element) {
  let passHash = bcrypt.hashSync(element.password, salt);
  let userInfo = new Object();
  userInfo.firstName = element.firstName;
  userInfo.lastName = element.lastName;
  userInfo.email = element.email;
  userInfo.passhash = passHash;
  userInfo.role = element.role;
  hashedUsers.push(userInfo);
});

let elapsed = new Date() - start; // timing code
console.log(`Finished password hashing, ${elapsed/1000} seconds.`);
fs.writeFileSync("clubUsersHash.json", JSON.stringify(hashedUsers, null, 2));
