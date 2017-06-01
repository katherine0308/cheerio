var mongoose = require('mongoose');
var cheerio = require("cheerio");
var moment = require('moment');

var server = require("./curl");
var Jy = require('../models/jy.js');

exports.pachong = function() {
  var appurl = [];
  for(var i=1; i<19; i++)
  {
    url = 'http://www.360app.com/soft/19.html?page=' + i;
    appurl.push(url)
  }

  for(var i=0; i<appurl.length; i++)
  {
    server.download(appurl[i], function(data) {
      if (data) {
        //console.log(data);
        var $ = cheerio.load(data);
        $("div.game-tab-subcon-icon a").each(function(i, e) {
          var apphref = 'http://www.360app.com' + $(e).attr('href');
          var appName = $(e).find('img').attr('title');

          server.download(apphref, function(data) {
            if(data) {
              var $ = cheerio.load(data);
              var appCount = $('div.gamed-app-mes p.down_padding').eq(1).text();
              var appDownloadHref ='http://www.360app.com/' + $('div.gamed-app-qr div.left p a').attr('href');
              var appContent = $('.gamed-intro').text().trim();
              var appFrom = '360APP';

              Jy.findByCount(appName, appFrom, function(err, jy) {
                console.log(jy);
                if(jy === 0) {
                  _jy = new Jy({
                    appName: appName,
                    appFrom: appFrom,
                    appCount: appCount,
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
              
              //console.log(appjson);
            }else{
              console.log('error' + appName);
            }
          });
        })
        console.log('done')
      } else {
        console.log('error')
      }
    })
  }
}