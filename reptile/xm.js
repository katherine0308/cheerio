var mongoose = require('mongoose');
var cheerio = require("cheerio");
var moment = require('moment');
var async = require('async');
var _ =require('underscore');

var server = require("./curl");
var urllib = require('./urllib');
var Jy = require('../models/jy.js');

var url = 'http://app.mi.com/categotyAllListApi?page=0&categoryId=12&pageSize=9999';

exports.pachong = function() {
	async.waterfall([
		function(callback) {
			server.download(url, function(data) {
				if(data) {
					//console.log(data);
					var allhref = JSON.parse(data).data;
					callback(null, allhref)
				}
			})
		},
		function(allhref, callback) {
			allhref.forEach(function(href) {
				urllib.download('http://app.mi.com/details?id=' + href.packageName, function(data) {
					if(data) {
						var $ = cheerio.load(data);
						var appName = $('div.intro-titles h3').text();
						var appScore = parseInt($('div.star1-empty div').attr('class').trim().slice(18))/2 + '星';
						var appUpdateTime = $('ul.cf li').eq(5).text();
						var appContent = $('div.app-text p.pslide').text().trim();
						var appDownloadHref = 'http://app.mi.com/download/' + href.appId;
						var appFrom = '小米';

						Jy.findByName(appName, appFrom, function(err, jy) {
			                if(!jy) {
			                	_jy = new Jy({
				                    appName: appName,
				                    appFrom: appFrom,
				                    appContent: appContent,
				                    appDownloadHref: appDownloadHref,
				                    appUpdateTime: appUpdateTime,
				                    appTime: moment().format('X'),
				                });

				                _jy.save(function(err, jy) {
				                      if (err)
				                      {
				                        console.log(err)
				                      }
				                      console.log('0')
				                })
			                } else {
			                	var id = jy[0]._id;
			                	_jy = _.extend(jy[0], {
			                		//_id: id,
			                		appName: appName,
									appScore: appScore,
									appUpdateTime: appUpdateTime,
									appContent: appContent,
									appDownloadHref: appDownloadHref,
									appFrom: appFrom
			                	});

				                _jy.save(function(err, jy) {
				                    if (err)
				                    {
				                        console.log(err)
				                    }
				                    console.log('1')
				                })
			                }
			            })
					} else {
						console.log('err' + href.displayName)
					}
				})

			})
		},
	],function(err, result) {
		console.log('done')
	})
}
/*
exports.pachong = function() {
  	server.download(url, function(data) {
	    if (data) {
		    //console.log(data);
		    var alldata = JSON.parse(data).data;
		    alldata.forEach(function(data) {
		    	async.series({
		    		data: function(callback) {
		    			var appName = data.displayName;
				    	var appDownloadHref = 'http://app.mi.com/download/' + data.appId;
				    	var apphref = 'http://app.mi.com/details?id=' + data.packageName;
				    	var appFrom = '小米';

				    	callback(null, {
				    		appName: appName,
				    		appDownloadHref: appDownloadHref,
				    		apphref: apphref,
				    		appFrom: appFrom
				    	}) 

		    		}
		    	},function(err, results) {
		    		urllib.download(results.data.apphref, function(data) {
			    		if(data) {
	              			var $ = cheerio.load(data);
	              			var appScore = parseInt($('div.star1-empty div').attr('class').trim().slice(18))/2 + '星';
	              			var appUpdateTime = $('ul.cf li').eq(5).text();
	              			var appContent = $('div.app-text p.pslide').text().trim();

	              			Jy.findByCount(results.data.appName, results.appFrom, function(err, jy) {
				                console.log(jy)
				                if(jy === 0) {
				                  _jy = new Jy({
				                    appName: results.data.appName,
				                    appFrom: results.data.appFrom,
				                    appScore: appScore,
				                    appContent: appContent,
				                    appDownloadHref: results.data.appDownloadHref,
				                    appUpdateTime: appUpdateTime, 
				                    appTime: moment().format('X'),
				                  });

				                  _jy.save(function(err, jy) {
				                      if (err)
				                      {
				                        console.log(err)
				                      }
				                  })
				                }
				            })
	              		}
			    	})

		    	})*/
		    	/*Jy.findByCount(appName, appFrom, function(err, jy) {
	                console.log(jy)
	                if(jy === 0) {
	                  _jy = new Jy({
	                    appName: appName,
	                    appFrom: appFrom,
	                    appDownloadHref: appDownloadHref,
	                    appTime: moment().format('X'),
	                  });

	                  _jy.save(function(err, jy) {
	                      if (err)
	                      {
	                        console.log(err)
	                      }
	                  })
	                }
	            })*/
		   /* })
		}
	})
}
*/