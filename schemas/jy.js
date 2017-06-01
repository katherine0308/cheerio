var mongoose = require('mongoose');

var JySchema = new mongoose.Schema({
	appName:String,
	appFrom:String,
	appCount:String,
	appLike: String,
    appComment: String,
    appUpdateTime: String,
    appScore: String,
	appTag: String,
	appContent: String,
    appDownloadHref: String,
    appTime: Number
});

JySchema.pre('save',function(next){
	next()
});

JySchema.statics = {
	fetch:function(cb){
		return this
			.find({})
			.exec(cb)
	},
	findById:function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb)
	},
	findByCount:function(appName, appFrom, cb){
		return this
			.count({appName:appName, appFrom: appFrom})
			.exec(cb)
	},
	findByName:function(appName, appFrom, cb) {
		return this
			.find({appName:appName, appFrom: appFrom})
			.exec(cb)
	},
	findFrom:function(appFrom, cb){
		return this
			.find({appFrom: appFrom})
			.exec(cb)
	},
	findKeyword:function(keyword,cb){
		return this
			.find({name: new RegExp("^.*"+keyword+".*$")})
			.exec(cb)
	},
	distinctName: function(cb) {
		return this
			.distinct('appName', {})
			.exec(cb)
	}
}

module.exports = JySchema