const fs = require('fs');
const bcrypt = require('bcryptjs');
const users = require('./clubUsers2.json');
let nRounds = 14;
let hashedUsers = [];
let start = new Date(); // timing code
console.log(`Starting password hashing with nRounds = ${nRounds}, ${start}`);

// Your code here to process the passwords
for(var cur in hashedUsers)
    {
        let salt= bcrypt.genSaltSync(nRounds);
        users[cur].password = bcrypt.hashSync(hashedUsers[cur].password, salt);

    }


let elapsed = new Date() - start; // timing code
console.log(`Finished password hashing, ${elapsed/1000} seconds.`);
fs.writeFileSync("clubUsersHash.json", JSON.stringify(hashedUsers, null, 2));

console.log('End of program')


