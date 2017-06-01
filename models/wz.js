var mongoose = require('mongoose');
var WzSchema = require('../schemas/wz.js');
var Wz = mongoose.model('Wz',WzSchema);

module.exports = Wz;