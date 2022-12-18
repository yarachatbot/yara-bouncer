const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwt_key = "chodu6969";

var db = require('./db.js');


// queryPromise(connection,"SELECT ...",[name,email]).then();
// 


// need to safeguard this function at all costs
//iska return value has  a success field, a jwt field, and an error field.
function createJWT(user_id){
	rvalue = {'success':false, 'jwt':null, 'error':null};

	const token = jwt.sign({ user_id:user_id },jwt_key,{expiresIn: "2h",});
	rvalue.jwt = token;
	rvalue.success = true;

	//console.log('sending rvalue from createJWT');
	return rvalue;
}

//returns user id of the guy
function verifyJWT(token){
	try
	{
		const decoded = jwt.verify(token, jwt_key);
		return decoded.user_id;
	}
	catch(err)
	{
		return null;
	}
}

async function legacyRegister(name,email,password){
	//onsole.log('Called legacyRegister with args: ',name,email,password);
  db.checkConnection();
  rvalue = {'success':false, 'jwt':null, 'error':null};

  hashpass = await bcrypt.hash(password,10);

  await db.query("INSERT INTO Users (name,email,hashpass) VALUE (?,?,?)",[name,email,hashpass])
  .then(async function (results){
    rvalue = await legacyLogin(email,password);
  })
  .catch(function(error){
	console.log('Error occurred: ',error);
 	rvalue.error = error.sqlMessage;
	console.log('rvalue obj: ',rvalue);
  });

  //console.log('sending rvalue from legacyRegister');
  return rvalue;
}

//iska return value has either a jwt field, or an error field
async function legacyLogin(email,password) {
  db.checkConnection();
  rvalue = {'success':false, 'jwt':null, 'error':null};
  
  var db_hashpass = null;
  await db.query("SELECT hashpass FROM Users WHERE email=?",[email])
    .then(function(results){
        db_hashpass = results[0].hashpass;
    })
    .catch(function(error){
      console.log('Error occured: ',error);
    });

  if(await bcrypt.compare(password,db_hashpass))
  {
    var idflag = false;
    var db_user_id = null;

    await db.query("SELECT id FROM Users Where email=?",[email])
    .then(results=>{
        db_user_id = results[0].id;
        idflag = true;
    })
    .catch(error=>{
        console.log('Error occured: ',error);
    });

    if(idflag)
      rvalue = createJWT(db_user_id);
  }
  else
    rvalue.error = "Incorrect Password";

  console.log('sending rvalue from legacyLogin');
  return rvalue;
}

exports.legacyLogin = legacyLogin;
exports.legacyRegister = legacyRegister;
exports.verifyJWT = verifyJWT;

//console.log(verifyJWT("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlMmVfZW1haWwiLCJpYXQiOjE2NzEyODk3NDcsImV4cCI6MTY3MTI5Njk0N30.i8uqXVtcGHDyLS3ZVMU3GzfLOHQirN9HgSTijvEj9m0"));