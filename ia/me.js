"use strict";
var q = require("q");
var s = require("./lang_analysis/syntax.js");
var g = require("./lang_analysis/grammar.js");


/**
	This is the IA object. This is Harry, with all its components.
	It can monitor the cpus and RAM usage, the space yet available on the disk
	it is alive on and has its own feelings scales.
	
	Harry will have only one goal hard-coded: to maximize its feelings level.
*/
function Me (){
	this.name = "harry";
	this.syntax = s.getInstance();
	this.gram = g.getInstance();
}



/**
	Load everything the IA needs to perform well.
	For example, its current state is calculated, its memory and sensors
	are loaded,...
*/
Me.prototype.prepare = function(){
	
	var deferred = q.defer();
    this.syntax.prepare().then(
        function(value){
            deferred.resolve('ready');
        },
        function(err){
            deferred.resolve(err);
        }
    ).done();

	return deferred.promise;
};

/** When the program is shutting done, checked that everything is closed and save volatile data
 */
Me.prototype.sleep = function(){
   var d = q.defer();
   this.syntax.close().then(
        function(val){
            d.resolve();    
        },
        function(err){
            console.log(err);
            d.reject();
        }
   ).done();
   
   return d.promise;
};


/**
 * Get the syntactical components from a text (several sentences possible)
 */
Me.prototype.analyze = function(text){
    var that =this;
    var res = function(){
        
        var sentences = that.syntax.getWordsFromText(text);
        //var tmp = that.gram.analyze(sentences[0]);
        return sentences;
    };
  
    return q.fcall(res);
};



/**
 * Search a word in the vocabulary list by its string expression
 * @params w:String
 */
Me.prototype.findVocWord = function(w){
    var d = q.defer();
    var that = this;
    var res = function(){
        return that.syntax.get(w);
    };
    
    return q.fcall(res);
};










/*
	The only visible function in this module. It
	only creates a new me and launch it.
*/
var getInstance = function(){
	return new Me();
};

module.exports.getInstance = getInstance;