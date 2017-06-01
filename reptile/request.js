var request = require('request');

request('http://app.mi.com/details?id=com.qqgame.hlddz', function (error, response, body) {
	if (!error && response.statusCode == 200) {
		console.log(response);
		//console.log(body);
	}
})