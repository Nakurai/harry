"use strict";
var q = require("q");
var l = require("./language.js");
var v = require("./scrap_vdm.js");
var dbWords = require("./db_words.js");
var dbSentences = require("./db_sentences.js");
var c = require("./conf.js");
var log = require("./log.js").getInstance();


/**
	this module is made to get sentences from several different
    sources on the internet and store words and information about them
*/
function LearnVoc (){

    this.conf = c.getConf();
    this.lang = l.getInstance();
	//this.twitter = t.getInstance();
	this.vdm = v.getInstance();
    this.dbW = dbWords.getInstance();
    this.dbS = dbSentences.getInstance();
    
    // from the conf file, we check what website we should scrap to get more sentences
    if(this.conf.learnVocFrom.vdm){
        setInterval(this.probeVdm.bind(this), 1000*30);    
    }
}

/**
 * here must be placed everything that could take a bit to initialize,
 * like db connection and so on. The server won't start before the end
 * of this function.
 */
LearnVoc.prototype.prepare = function(){
    var def = q.defer();
    def.resolve('ready');
    return def.promise;
    
};

/**
 * at a regular interval, the last tweet from twitter is fetched, providing us with several
 * sentences
 *
LearnVoc.prototype.probeTwitter = function(){
   var that = this;
   this.twitter.getLasTweet().then(
    function(tweet){
        // first we get all the sentences and each words from one tweet
        var sentences = that.lang.splitText(tweet);
        var words = that.lang.getWordsFromText(tweet);
        
        // then we store everything in the database
        sentences.map(function(sentence){
            that.dbS.add(sentence.trim());
        });
        words.map(function(word){
            that.dbW.add(word.trim());
        });
        
        
    },
    function(err){
        console.log('[ERR] (learn_voc.probetwitter)'+err);
    }
   );
};
*/



/**
 * at a regular interval, the last tweet from twitter is fetched, providing us with several
 * sentences
 */
LearnVoc.prototype.probeVdm = function(){
   var that = this;
   this.vdm.scrap().then(
    function(randVdm){
        // first we get all the sentences and each words from one tweet
        var sentences = that.lang.splitText(randVdm);
        var words = that.lang.getWordsFromText(randVdm);
        
        // then we store everything in the database
        sentences.map(function(sentence){
            that.dbS.add(sentence.trim());
        });
        words.map(function(word){
            that.dbW.add(word.trim());
        });
        
        
    },
    function(err){
        log.err('[ERR] (learn_voc.probevdm) erreur while scraping VDM', 'learn_voc.probeVdm');
    }
   );
};






/*
	The only visible function in this module. It
	only creates a new me and launch it.
*/
var getInstance = function(){
	return new LearnVoc();
};

module.exports.getInstance = getInstance;