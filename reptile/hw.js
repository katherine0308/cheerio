var mongoose = require('mongoose');
var cheerio = require("cheerio");
var moment = require('moment');

var server = require("./curl");
var Jy = require('../models/jy.js');

var appurl = [];
for(var i=1; i<11; i++) {
	url = 'http://appstore.huawei.com/soft/list_30_1_' + i;
	appurl.push(url);
}

exports.pachong = function() {
	for(var i=0; i<appurl.length; i++)
	{
		server.download(appurl[i], function(data) {
			//console.log(data);
			if(data) {
				var $ = cheerio.load(data);
		        $("div.game-info").each(function(i, e) {
		        	var appName = $(e).find('h4.title a').text();
		        	var appUpdateTime = $(e).find('div.game-info-dtail p.date span').text();
		        	var appCount = $(e).find('div.app-btn span').text();
		        	var prehref = $(e).find('div.app-btn a.down').attr('onclick').slice(21,-2).split(',');
		        	var appDownloadHref = prehref[5].slice(2,-2);
		        	var appContent = $(e).find('p.content').text().trim();
		        	var appFrom = '华为';

		        	Jy.findByCount(appName, appFrom, function(err, jy) {
		                console.log(jy)
		                if(jy === 0) {
		                  _jy = new Jy({
		                    appName: appName,
		                    appFrom: appFrom,
		                    appCount: appCount,
		                    appContent: appContent,
		                    appUpdateTime: appUpdateTime,
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
		        })
			} else {
              console.log('error' + appName);
            }
		})
		console.log('done')
	}
}
