var db = require('./db.js');

async function startConv(user_id,firstReply)
{
	db.checkConnection();
	rvalue = {"success":false,"conv_id":null,"error":null}

	var insertflag = false, selectflag = false;
	await db.query("INSERT INTO Conversations (text,user_id) VALUE (?,?)",[JSON.stringify({"mind":[firstReply],"client":[]}),user_id])
	.then(response=>{
		insertflag = true;
	})
	.catch(error=>{
		console.log('Error in startConv.1 @ middleware/dataentry.js: ',error);
		rvalue.error = error;
	});

	if(insertflag)
	{
		await db.query("SELECT id FROM Conversations WHERE text->>'$.client'='[]' AND user_id=?",[user_id])
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
		await db.query("UPDATE Users SET last_conv_id=? WHERE id=?",[rvalue.conv_id,user_id])
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

async function nextConv(user_id,message,nextReply)
{
	db.checkConnection();
	rvalue = {"success":false,"conv_id":null,"error":null}

	var selectflag=false,updateflag=false;
	await db.query("SELECT last_conv_id FROM Users WHERE id=?",[user_id])
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