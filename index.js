var mongoose = require('mongoose');

mongoose.connect('mongodb://192.168.2.9/reptile');
//mongoose.connect('mongodb://localhost/reptile');

//01. 引入新模块
var yyb = require('./reptile/yyb');
var wdj = require('./reptile/wdj');
var sll = require('./reptile/sll');
var xm = require('./reptile/xm');
var hw = require('./reptile/hw');
var iphone = require('./reptile/iphone');
var ipad = require('./reptile/ipad');
var cz = require('./reptile/cz')

//02. 添加文件
var gule = {
  yyb: function() {
    yyb.pachong();
  },
  wdj: function() {
    wdj.pachong();
  },
  sll: function() {
    sll.pachong();
  },
  xm: function() {
    xm.pachong();
  },
  hw: function() {
    hw.pachong();
  },
  iphone: function() {
    iphone.pachong();
  },
  ipad: function() {
    ipad.pachong();
  },
  cz: function() {
    cz.pachong();
  },
}

//03. 当前爬取的文件相关
var run = {
  name: 'cz',
  url: '',
  func: 'cz'
}

gule[run.func]();