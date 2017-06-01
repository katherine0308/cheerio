var mongoose = require('mongoose');
var cheerio = require("cheerio");
var moment = require('moment');

var server = require("./curl");
var Jy = require('../models/jy.js');

var appurl = [];
for(var i=1; i<62; i++)
{
	var url = 'http://www.i4.cn/app_12_2_1_119_' + i + '.html';
	appurl.push(url);
}

exports.pachong = function() {
	appurl.forEach(function(url) {
		server.download(url, function(data) {
	    	if (data) {
	        	//console.log(data);
	        	var $ = cheerio.load(data);
	        	$("a.app_title").each(function(i, e) {
	        		var appName = $(e).attr('title');
	        		var apphref ='http://www.i4.cn/' + $(e).attr('href');

	        		server.download(apphref, function(data) {
	        			if(data)
	        			{
	        				//console.log(data)
	        				var $ = cheerio.load(data);
	        				var appCount = $('div.downcount span').text();
	        				var appUpdateTime = $('div.udate span').text();
	        				var appDownloadHref = $('a.install').data('download');
	        				var appContent = $('div.content').text().trim();
	        				var appFrom = '爱思ipad'

	        				Jy.findByCount(appName, appFrom, function(err, jy) {
				                console.log(jy);
				                if(jy === 0) {
				                  _jy = new Jy({
				                    appName: appName,
				                    appFrom: appFrom,
				                    appCount: appCount,
				                    appUpdateTime: appUpdateTime,
				                    appContent: appContent,
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
				            })
	        			}
	        		})
	        		
	        	})
	        }
	    })
	})

}

