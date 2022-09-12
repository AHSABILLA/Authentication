/*const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const bcrypt = require("bcrypt");

const app = express();
const dBPath = path.join(__dirname, "userData.db");
app.use(express.json());

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dBPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running on http://localhost:3000");
    });
  } catch (error) {
    console.log(`server got error at: ${error.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

//create user API
app.post("/register", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const checkuserQuery = `
    SELECT username
      FROM user
      WHERE username='${username}';`;
  const checkuserRes = await db.get(checkuserQuery);
  if (checkuserRes === undefined) {
    //create userDetails
    const createUserQuery = `
    INSERT INTO user(username,name,password,gender,location)
     VALUES('${username}','${name}','${hashedPassword}','${gender}','${location}';`;
    if (password.length > 5) {
      const createUser = await db.run(createUserQuery);
      response.send("'User created successfully"); //scenario 3
    } else {
      response.status(400);
      response.send("Password is too short"); //scenario 2
    }
  } else {
    response.status(400);
    response.send("User already exists"); //scenario 1
  }
});

//login API
app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const checkuserQuery = `
    SELECT *
      FROM user
      WHERE username='${username}';`;
  const userNameResponse = await db.get(checkuserQuery);
  if (userNameResponse === undefined) {
    response.status(400);
    response.send("Invalid user"); //scenario 1
  } else {
    const isPasswordMatch = await bcrypt.compare(
      password,
      userNameResponse.password
    );
    if (isPasswordMatch === true) {
      response.status(200);
      response.send("Login Successful"); //scenario 3
    } else {
      response.status(400);
      response.send("Invalid Password"); //scenario 2
    }
  }
});

//change Password API
app.put("/change-password", async (request, response) => {
  const { username, oldpassword, newpassword } = request.body;
  const checkuserQuery = `select * from user where username='${username}';`;
  const checkuserRes = await db.get(checkuserQuery);
  if (checkuserRes !== undefined) {
    const ispasswordValid = await bcrypt.compare(
      oldpassword,
      checkuserRes.password
    );
    if (ispasswordValid) {
      if (newpassword.length > 5) {
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        const updatePasswordQuery = `update user set 
            password='${hashedPassword}' where username='${username}';`;
        const updatePasswordRes = await db.run(updatePasswordQuery);
        response.status(200);
        response.send("Password updated"); //scenario 3
      } else {
        response.status(400);
        response.send("Password is too short"); //scenario 2
      }
    } else {
      response.status(400);
      response.send("Invalid current password");
    }
  } else {
    response.status(400);
    response.send("Invalid User"); //scenario 4
  }
});

module.exports = app;
*/
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
//for password encryption
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
const databasePath = path.join(__dirname, "userData.db");
let database = null;

const initializeDnAndServer = async () => {
  try {
    database = await open({ filename: databasePath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log(`Server is running on http://localhost:3000`);
    });
  } catch (error) {
    console.log(`Database Error is ${error}`);
    process.exit(1);
  }
};

initializeDnAndServer();

//                               API 1
//                         user registration
//          Scenarios
// 1) If the username already exists
// 2) Password is too short
// 3) User created successfully
//change the password to encrypted format using bcrypt() third part library
//npm install bcrypt --save
// const hashedPassword = await bcrypt.hash(password,saltRounds);

app.post("/register", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  //encrypt password
  const hashedPassword = await bcrypt.hash(password, 10);
  // check if user exists
  const checkUserQuery = `select username from user where username = '${username}';`;
  const checkUserResponse = await database.get(checkUserQuery);
  if (checkUserResponse === undefined) {
    const createUserQuery = `
      insert into user(username,name,password,gender,location) 
      values('${username}','${name}','${hashedPassword}','${gender}','${location}');`;
    if (password.length > 5) {
      const createUser = await database.run(createUserQuery);
      response.send("User created successfully"); //Scenario 3
    } else {
      response.status(400);
      response.send("Password is too short"); //Scenario 2
    }
  } else {
    response.status(400);
    response.send(`User already exists`); //Scenario 1
  }
});

//                             API 2
//                           USER LOGIN
//                Scenarios
// 1) If an unregistered user tries to login
// 2) If the user provides incorrect password
// 3) Successful login of the user
// compare the encrypted password  and given password is same.
// const result = await bcrypt.compare(givenPassword, passwordInDb)

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const checkUserQuery = `select * from user where username = '${username}';`;
  const userNameResponse = await database.get(checkUserQuery);
  if (userNameResponse !== undefined) {
    const isPasswordMatched = await bcrypt.compare(
      password,
      userNameResponse.password
    );
    if (isPasswordMatched) {
      response.status(200);
      response.send(`Login success!`); // Scenario 3
    } else {
      response.status(400);
      response.send(`Invalid password`); // Scenario 2
    }
  } else {
    response.status(400);
    response.send(`Invalid user`); //Scenario 1
  }
});

//                                    API 3
//                                change Password
//      Scenarios
// 1) If the user provides incorrect current password
// 2)Password is too short
//  3) Password updated
// 4) invalid user

app.put("/change-password", async (request, response) => {
  const { username, oldPassword, newPassword } = request.body;
  // check user
  const checkUserQuery = `select * from user where username = '${username}';`;
  const userDetails = await database.get(checkUserQuery);
  if (userDetails !== undefined) {
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (isPasswordValid) {
      if (newPassword.length > 5) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatePasswordQuery = `update user set 
        password = '${hashedPassword}' where username = '${username}';`;
        const updatePasswordResponse = await database.run(updatePasswordQuery);
        response.status(200);
        response.send("Password updated"); //Scenario 3
      } else {
        response.status(400);
        response.send("Password is too short"); //Scenario 2
      }
    } else {
      response.status(400);
      response.send("Invalid current password"); //Scenario 1
    }
  } else {
    response.status(400);
    response.send(`Invalid user`); // Scenario 4
  }
});

module.exports = app;
