var mongoose = require('mongoose');
var cheerio = require("cheerio");
var moment = require('moment');

var server = require("./curl");
var Jy = require('../models/jy.js');

exports.pachong = function() {
  var appurl = [];
  for(var i=1; i<44; i++)
  {
    url = 'http://www.wandoujia.com/category/396_' + i;
    appurl.push(url)
  }

  for(var i=0; i<appurl.length; i++)
  {
    server.download(appurl[i], function(data) {
      if (data) {
        //console.log(data);
        var $ = cheerio.load(data);
        $("h2.app-title-h2 a.name").each(function(i, e) {
          var appName = $(e).attr('title');
          var apphref = $(e).attr('href');
          server.download(apphref, function(data) {
            if(data) {
              var $ = cheerio.load(data);
              var appCount = $('div.num-list span.item i[itemprop="interactionCount"]').text();
              var appLike = $('div.num-list span.love i').text();
              var appComment = $('div.num-list a.comment-open i').text();
              var appDownloadHref = $('div.download-wp a').attr('href');
              var appUpdateTime = $('time#baidu_time').text();
              var appTag = '';
              $('div.side-tags div.tag-box a').each(function(i, e) {
                appTag += $(e).text().trim() + ',';
              })
              var appContent = $('div.desc-info div.con').text().trim();
              var appFrom = '豌豆荚';

              Jy.findByCount(appName, appFrom, function(err, jy) {
                console.log(jy)
                if(jy === 0) {
                  _jy = new Jy({
                    appName: appName,
                    appFrom: appFrom,
                    appCount: appCount,
                    appLike: appLike,
                    appComment: appComment,
                    appContent: appContent,
                    appDownloadHref: appDownloadHref,
                    appUpdateTime: appUpdateTime,
                    appTag: appTag,
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
        });
        console.log('done');
      } else {
        console.log('error')
      }
    });
  }
}