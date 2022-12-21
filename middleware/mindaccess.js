const axios = require('axios');

const mind_url = "http://yaramind-env.eba-fvwprprv.ap-south-1.elasticbeanstalk.com";
const start_ep = "/startConvo";
const next_ep = "/nextMessage";

async function start(user_id)
{
	rvalue = {'success':false, 'reply':null, 'error':null};

	await axios.post(mind_url+start_ep,{user_id:user_id})
	.then(response=>{
		rvalue.reply = response.data.result;
		rvalue.success = true;
	})
	.catch(error=>{
		rvalue.error = error;
	});

	return rvalue;
}

async function next(user_id, message)
{
	rvalue = {'success':false, 'reply':null, 'error':null};

	await axios.post(mind_url+next_ep,{user_id:user_id,user_message:message})
	.then(response=>{
		rvalue.reply = response.data.result;
		rvalue.success = true;
	})
	.catch(error=>{
		rvalue.error = error;
	});

	return rvalue;
}

exports.start = start;
exports.next = next;