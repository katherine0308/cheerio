var mongoose = require('mongoose');

var WzSchema = new mongoose.Schema({
	name:String,
	from:String,
	sort:String,
	website: String,
    content: String,
    appTime: Number
});

WzSchema.pre('save',function(next){
	next()
});

WzSchema.statics = {
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
	findByCount:function(name, from, cb){
		return this
			.count({name:name, from: from})
			.exec(cb)
	},
	findByName:function(name, from, cb) {
		return this
			.findOne({name:name, from: from})
			.exec(cb)
	},
	findFrom:function(name, cb){
		return this
			.find({name: from})
			.exec(cb)
	},
	findKeyword:function(keyword,cb){
		return this
			.find({name: new RegExp("^.*"+keyword+".*$")})
			.exec(cb)
	},
	distinctName: function(cb) {
		return this
			.distinct('name', {})
			.exec(cb)
	}
}

module.exports = 	WzSchema