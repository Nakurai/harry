"use strict";
var request = require("request");
var cheerio = require("cheerio");
var q = require("q");
var conf = require("./conf.js");


var tweets = [
    'wesh jamais tu répond ? Sérieux quoi',
    'Je suis. Tu aimes. Il/elle aime. Nous...',
    'Ne dites pas que la tomate est un légume. Non.',
    'POur cq j\'en sais tu peux être bien bas #toupeti',
    'Appeler lepère noël une ordure. OKLM. #OKLM',
    'Tu prend juste tp cher qd tu mens ac lui'
];

/*
	Operator to be able to merge this code in a more ambitious one later
*/
function Twitter(){
    console.log(JSON.stringify(wolfConf));
    this.accountsToFollow = [];
}

/**
 * connection to twitter's server and we fetch the last tweet.
 * then we 
 */
Twitter.prototype.getLasTweet = function(){
    var def = q.defer();
    
    this.falseConnect().then(
        function(tweet){
            def.resolve(tweet);
        });
    
    return def.promise;
};

/**
 * function to simulate the http asynchronous system to connect to twitter's server
 */
Twitter.prototype.falseConnect = function (){
   
    var def = q.defer();
    /*
    request('https://twitter.com', function (error, response, html) {
        if (!error && response.statusCode == 200) {
            //console.log(html);
            var $ = cheerio.load(html);
            var tweets = $('p').attr('class', 'tweet-text')
        }
    });*/
    
    setTimeout(function(){
        var $ = cheerio.load(htmltest);
        var tweets = $('.tweet-text');
        console.log(tweets.length);
    }, 1000*3);
    
    return def.promise;
};








/*
	The only visible function in this module. It
	only creates a new instance and launch it.
*/
var getInstance = function(){
	return new Twitter();
};

module.exports.getInstance = getInstance;