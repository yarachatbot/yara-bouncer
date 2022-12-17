var db = require('./db.js');

async function startConv(email,firstReply)
{
	db.checkConnection();
	rvalue = {"success":false,"conv_id":null,"error":null}

	var insertflag = false, selectflag = false;
	await db.query("INSERT INTO Conversations (text,user_email) VALUE (?,?)",[JSON.stringify({"mind":[firstReply],"client":[]}),email])
	.then(response=>{
		insertflag = true;
	})
	.catch(error=>{
		console.log('Error in startConv.1 @ middleware/dataentry.js: ',error);
		rvalue.error = error;
	});

	if(insertflag)
	{
		await db.query("SELECT id FROM Conversations WHERE text->>'$.client'='[]' AND user_email=?",[email])
		.then(response=>{
			selectflag = true;
			rvalue.conv_id = response[response.length-1].id;
		})
		.catch(error=>{
			console.log('Error in startConv.2 @ middleware/dataentry.js: ',error);
			rvalue.error = error.sqlMessage;
		});
	}

	if(selectflag)
	{
		await db.query("UPDATE Users SET last_conv_id=? WHERE email=?",[rvalue.conv_id,email])
		.then(response=>{
			rvalue.success = true;
		})
		.catch(error=>{
			console.log('Error in startConv.3 @ middleware/dataentry.js: ',error);
			rvalue.error = error.sqlMessage;
		})
	}

	return rvalue;
}

async function nextConv(email,message,nextReply)
{
	db.checkConnection();
	rvalue = {"success":false,"conv_id":null,"error":null}

	var selectflag=false,updateflag=false;
	await db.query("SELECT last_conv_id FROM Users WHERE email=?",[email])
	.then(response=>{
		rvalue.conv_id = response[0].last_conv_id;
		selectflag = true;
	})
	.catch(error=>{
		console.log('Error in nextConv.1 @ middleware/dataentry.js: ',error);
		rvalue.error = error.sqlMessage;
	});

	if(selectflag)
	{
		await db.query("UPDATE Conversations SET text=JSON_ARRAY_APPEND(text,'$.client',?,'$.mind',?) WHERE id=?",[message,nextReply,rvalue.conv_id])
		.then(response=>{
			rvalue.success = true;
		})
		.catch(error=>{
			console.log('Error in nextConv.2 @ middleware/dataentry.js: ',error);
			rvalue.error = error.sqlMessage;
		});
	}

	return rvalue;
}

exports.startConv = startConv;
exports.nextConv = nextConv;