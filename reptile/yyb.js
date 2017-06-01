var mongoose = require('mongoose');
var cheerio = require("cheerio");
var moment = require('moment');

var server = require("./curl");
var Jy = require('../models/jy.js');

var appurl = [
      'http://android.myapp.com/myapp/category.htm?orgame=1&categoryId=111',
      'http://android.myapp.com/myapp/category.htm?orgame=1&categoryId=111&pageSize=999&pageContext=41',
      'http://android.myapp.com/myapp/category.htm?orgame=1&categoryId=111&pageSize=999&pageContext=82',
    ];


exports.pachong = function() {
  var _jy;

  for(var i=0; i<3; i++)
  {
    server.download(appurl[i], function(data) {
      if (data) {
        //console.log(data);
        var $ = cheerio.load(data);
        $("a.ofh").each(function(i, e) {
          var apphref ='http://android.myapp.com/myapp/' + $(e).attr('href');
          var appName = $(e).text();
          server.download(apphref, function(data) {
            if(data) {
              var $ = cheerio.load(data);
              var appCount = $('.det-ins-num').text();
              var appTag;
              $('.det-type-link').each(function(i, e) {
                appTag = $(e).text();
              })
              var appDownloadHref = $('.det-down-btn').data('apkurl');
              var appContent = $('.det-app-data-info').text().trim();
              var appFrom = '应用宝';

              Jy.findByCount(appName, appFrom, function(err, jy) {
                console.log(jy);
                if(jy === 0) {
                  _jy = new Jy({
                    appName: appName,
                    appFrom: appFrom,
                    appCount: appCount,
                    appTag: appTag,
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
                } else {
                  
                }
              })
              //console.log(appjson)
              
            }else{
              console.log('error' + appName + apphref)
            }
          })
        });
        console.log("done");
      } else {
        console.log("error");
      } 
    });
  }
}