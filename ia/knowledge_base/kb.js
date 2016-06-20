"use strict";
var q = require("q");
var fs = require('fs');
var byline = require('byline');
var buckets = require('buckets-js');
/**
 * This is the root of the ia knowledge
*/
function Kb() {
    this.basePath = './ia/knowledge_base/';
	this.frLefffPath = this.basePath+'/resources/core.kb';
    this.db = null;
}


Kb.prototype.load = function(){
    var d = q.defer();
    var db = this.db;
    

    
    return d.promise;
};



/*
	The only visible function in this module. It
	only creates a new instance and launch it.
*/
var getInstance = function(){
	return new Kb();
};

module.exports.getInstance = getInstance;