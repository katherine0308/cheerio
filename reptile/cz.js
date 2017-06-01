var mongoose = require('mongoose');
var cheerio = require("cheerio");
var moment = require('moment');
var async = require('async');

var server = require("./curl");
var Wz = require('../models/wz.js');

exports.pachong = function() {
	async.waterfall([
		function(callback) {
			var appurl = ['http://top.chinaz.com/hangye/index_jiaoyu.html'];
			for(var i=2; i<225; i++) {
				url = 'http://top.chinaz.com/hangye/index_jiaoyu_'+ i + '.html';
				appurl.push(url)
			}
			callback(null, appurl);
		}
	],function(err, appurl) {
		appurl.forEach(function(url) {
			server.download(url, function(data) {
		      if (data) {
		        //console.log(data);
		        var $ = cheerio.load(data);
		        $('.rightTxtHead a').each(function(i, e) {
		        	var namehref = 'http://top.chinaz.com' + $(e).attr('href');
		        	var name = $(e).attr('title');
		        	var website = $(e).next().text();
		        	server.download(namehref, function(data) {
		        		if (data) {
					        //console.log(data);
					        var $ = cheerio.load(data);
					        var content = $('.webIntro').text().trim();
					        var sort = '';
					        $('div.Tagone p').eq(0).find('a').each(function(i, e) {
					        	sort += $(e).text().trim() + ',';
					        })
					        var from = '站长之家';

					        var json = {
					        	name: name,
					        	website: website,
					        	sort: sort,
					        	content: content,
					        	from: from,
					        	appTime: moment().format('X'),
					        }

					        //save
					        Wz.findByCount(name, from, function(err, wz) {
			                	console.log(wz);
			                	if(wz === 0) {
			                    	_wz = new Wz(json);

			                    	_wz.save(function(err, wz) { if (err) {console.log(err)} })
			                	}
			                })
					    } else {
					    	console.log('err' + name)
					    }
		        	})
		        })
		      } else {
		      	console.log('err')
		      }
		    })
		})
	})
}