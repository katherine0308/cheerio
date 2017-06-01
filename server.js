var express = require('express');
var mongoose = require('mongoose');
var cheerio = require("cheerio");
var moment = require('moment');
var _ =require('underscore');
var async = require('async');
var bodyParser = require('body-parser');
var nodeExcel = require('excel-export');

var Jy = require('./models/jy.js');
var Wz = require('./models/wz.js');

var app = express();

//mongoose.connect('mongodb://localhost/reptile');
mongoose.connect('mongodb://192.168.2.9/reptile');
mongoose.set('debug', true);

//设置handlebars视图引擎
var handlebars = require('express3-handlebars').create({defaultLayout:'main'});
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.set('port',process.env.PORT || 8123);


//路由开始
//APP展示页
app.get('/', function(req, res) {
	async.series({
		yyb: function(callback) {
			Jy.findFrom('应用宝', function(err, yyb) {
				if (err) { console.log(err)}
				callback(null, yyb)
			})
		},
		wdj: function(callback) {
			Jy.findFrom('豌豆荚', function(err,wdj){
				if (err) { console.log(err)}
				callback(null, wdj)
			})
		},
		sll: function(callback) {
			Jy.findFrom('360APP', function(err, sll) {
				if (err) { console.log(err)}
				callback(null, sll)
			})
		},
		xm: function(callback) {
			Jy.findFrom('小米', function(err, xm) {
				if (err) { console.log(err)}
				callback(null, _.sortBy(xm, _.iteratee('appScore')))
			})
		},
		hw: function(callback) {
			Jy.findFrom('华为', function(err, hw) {
				if (err) { console.log(err)}
				callback(null, hw)
			})
		},
		iphone: function(callback) {
			Jy.findFrom('爱思iphone', function(err, iphone) {
				if (err) { console.log(err)}
				callback(null, iphone)
			})
		},
		ipad: function(callback) {
			Jy.findFrom('爱思ipad', function(err, ipad) {
				if (err) { console.log(err)}
				callback(null, ipad)
			})
		},
		all: function(callback) {
			Jy.distinctName(function(err, all) {
				if (err) { console.log(err)}

				all = all.map(function(item) {
					return {appName: item}
				})
				callback(null, all)
			})
		}
	},function(err, results) {		
		res.render('show',{
			title:'教育类APP爬虫',
			yyb: results.yyb,
			wdj: results.wdj,
			sll: results.sll,
			xm: results.xm,
			hw: results.hw,
			iphone:results.iphone,
			ipad: results.ipad,
			all: _.sortBy(results.all, _.iteratee('appName')),
			count: results.all.length
		})
	})
})

//website展示页
app.get('/website', function(req, res) {
	Wz.fetch(function(err, wz) {
		if(err) { console.log(err) }

		res.render('website', {
			title: '教育类网站',
			wz: wz,
			length: wz.length
		})
	})
})

//获取APP详情内容api
app.post('/api/getContent', function(req, res) {
	var id = req.query.id;
	
	Jy.findById(id, function(err, data) {
		if(data.appContent) {
			res.json({
				content: data.appContent
			})
		} else {
			res.json({ content: '评星为空则不含详情' })
		}
		
	})
})

//获取website详情内容api
app.post('/api/getWebsiteContent', function(req, res) {
	var id = req.query.id;
	
	Wz.findById(id, function(err, data) {
		if(data.content) {
			res.json({
				content: data.content
			})
		} else {
			res.json({ content: '评星为空则不含详情' })
		}
		
	})
})

//下载成为excel表格app
app.get('/downloadapp', function(req, res) {
	async.parallel([
		function(callback){
			var yyb = {};
			//yyb.stylesXmlFile = '';

			yyb.cols = [{
				caption: '应用宝',
				type: 'string'
			},{
				caption: '下载量',
				type:'string'
			},{
				caption: '标签',
				type: 'string'
			},{
				caption: '详情',
				type: 'string'
			}];

			Jy.findFrom('应用宝', function(err, yybin) {
				if (err) { console.log(err)}
				yyb.rows = yybin.map(function(item) {
					return [item.appName, item.appCount, item.appTag, item.appContent ];
				})
				callback(null, yyb)
			})
		},
		function(callback){
			var wdj = {};
			//wdj.stylesXmlFile = '';

			wdj.cols = [{
				caption: '豌豆荚',
				type: 'string'
			},{
				caption: '下载量',
				type:'string'
			},{
				caption: '喜爱',
				type: 'string'
			},{
				caption: '评论',
				type: 'string'
			},{
				caption: '标签',
				type: 'string'
			},{
				caption: '最后更新时间',
				type: 'string'
			},{
				caption: '详情',
				type: 'string'
			}];

			Jy.findFrom('豌豆荚', function(err, wdjin) {
				if (err) { console.log(err)}
				wdj.rows = wdjin.map(function(item) {
					return [item.appName, item.appCount, item.appLike, item.appcomment, item.appTag, item.appUpdateTime, item.appContent ];
				})
				callback(null, wdj)
			})
		},
		function(callback){
			var sll = {};
			//wdj.stylesXmlFile = '';

			sll.cols = [{
				caption: '360APP',
				type: 'string'
			},{
				caption: '下载量',
				type:'string'
			},{
				caption: '详情',
				type: 'string'
			}];

			Jy.findFrom('360APP', function(err, sllin) {
				if (err) { console.log(err)}
				sll.rows = sllin.map(function(item) {
					return [item.appName, item.appCount, item.appContent ];
				})
				callback(null, sll)
			})
		},
		function(callback){
			var xm = {};
			//wdj.stylesXmlFile = '';

			xm.cols = [{
				caption: '小米',
				type: 'string'
			},{
				caption: '下载量',
				type:'string'
			},{
				caption: '详情',
				type: 'string'
			}];

			Jy.findFrom('小米', function(err, xmin) {
				if (err) { console.log(err)}
				xm.rows = xmin.map(function(item) {
					return [item.appName, item.appCount, item.appContent ];
				})
				callback(null, xm)
			})
		},
		function(callback){
			var hw = {};
			//wdj.stylesXmlFile = '';

			hw.cols = [{
				caption: '华为',
				type: 'string'
			},{
				caption: '下载量',
				type:'string'
			},{
				caption: '更新时间',
				type: 'string'
			},{
				caption: '详情',
				type: 'string'
			}];

			Jy.findFrom('华为', function(err, hwin) {
				if (err) { console.log(err)}
				hw.rows = hwin.map(function(item) {
					return [item.appName, item.appCount, item.appUpdateTime, item.appContent ];
				})
				callback(null, hw)
			})
		},
		function(callback){
			var iphone = {};
			//wdj.stylesXmlFile = '';

			iphone.cols = [{
				caption: 'iphone',
				type: 'string'
			},{
				caption: '下载量',
				type:'string'
			},{
				caption: '更新时间',
				type: 'string'
			},{
				caption: '详情',
				type: 'string'
			}];

			Jy.findFrom('iphone', function(err, iphonein) {
				if (err) { console.log(err)}
				iphone.rows = iphonein.map(function(item) {
					return [item.appName, item.appCount, item.appUpdateTime, item.appContent ];
				})
				callback(null, iphone)
			})
		},
		function(callback){
			var ipad = {};
			//wdj.stylesXmlFile = '';

			ipad.cols = [{
				caption: 'ipad',
				type: 'string'
			},{
				caption: '下载量',
				type:'string'
			},{
				caption: '更新时间',
				type: 'string'
			},{
				caption: '详情',
				type: 'string'
			}];

			Jy.findFrom('ipad', function(err, ipadin) {
				if (err) { console.log(err)}
				ipad.rows = ipadin.map(function(item) {
					return [item.appName, item.appCount, item.appUpdateTime, item.appContent ];
				})
				callback(null, ipad)
			})
		}],function(err, results){
			var finresult = nodeExcel.execute(results);
		    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
		    res.setHeader("Content-Disposition", "attachment; filename=" + "app.xlsx");
		    res.end(finresult, 'binary');
	});
})

//下载成为excel表格web
app.get('/downloadweb', function(req, res) {
	var web = {};
	web.stylesXmlFile = 'website3.xml';

	web.cols = [{
		caption: '网站名',
		type: 'string',
		wrap: true
	},{
		caption: '域名',
		type:'string',
		wrap: true
	},{
		caption: '分类',
		type: 'string',
		wrap: true
	},{
		caption: '详情',
		type: 'string',
		wrap: true
	}];

	Wz.fetch(function(err, wz) {
		if (err) { console.log(err)}
		web.rows = wz.map(function(item) {
			return [ item.name, item.count, item.sort, item.content ];
		})
		var result = nodeExcel.execute(web);
	    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
	    res.setHeader("Content-Disposition", "attachment; filename=" + "website.xlsx");
	    res.end(result, 'binary');
	})
})


//定制404页面
app.use(function(req,res,next){
	res.status(404);
	res.render('404');
});

//定制500页面
app.use(function(err,req,ers,next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'),function(){
	console.log('Express started on http://localhost:' + app.get('port') + ';press Ctrl-C to terminate.');
});
