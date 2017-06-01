var mongoose = require('mongoose');
var JySchema = require('../schemas/jy.js');
var Jy = mongoose.model('Jy',JySchema);

module.exports = Jy;