var urllib = require('urllib');

function download(url, callback) {
	urllib.request(url, function (err, data, res) {
	  if (err) {
	    //throw err; // you need to handle error
	    console.log('error')
	  }
	  //console.log(res.statusCode);
	  //console.log(res.headers);
	  // data is Buffer instance
	  if(data){
	  	callback(data.toString());
	  } else {
	  	console.log('done');
	  }
	  
	});
}

exports.download = download;