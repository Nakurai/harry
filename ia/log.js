"use strict";
var q = require("q");
var c = require("./conf.js");


/**
	this module is made to manage the collections words_index and words
*/
function Log (){
    this.conf = c.getConf();
}

Log.prototype.err= function(msg, src){
    console.log('[ERR] ('+src+')'+msg);
};

Log.prototype.info= function(msg, src){
    console.log('[INFO] ('+src+')'+msg);
};

Log.prototype.dev= function(msg, src){
    if(this.conf.mode.code == 2){
        console.log('[DEV] ('+src+')'+msg);    
    }
};




/*
	The only visible function in this module. It
	only creates a new instance and launch it.
*/
var getInstance = function(){
	return new Log();
};

module.exports.getInstance = getInstance;