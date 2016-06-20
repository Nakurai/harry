"use strict";
var request = require("request");
var cheerio = require("cheerio");
var q = require("q");
var c = require("./conf.js");
var log = require("./log.js").getInstance();


/**
	This is a module dedicated to the scraping of vdm website
    the target page is specified in the conf file which allow us to get a full panel
    of common language
*/
function Vdm(){
    
    this.conf = c.getConf();

}

/**
 * connexion to the random category of vdm, getting only what's interesting
 * @TODO: insert the id in the database to avoid duplicated results !!
 */
Vdm.prototype.scrap = function(){
    var def = q.defer();
    var that = this;
    
    this.getRandomPage().then(
        function(html){
            var $ = cheerio.load(html);
            //var posts = [];
            var res = '';
            
            //all the posts are identified and added to a temp array
            $('.post').each(function(i, elem) {
                if($(this).attr('id') !==undefined){
                    //posts.push('vdm'+$(this).attr('id'));
                    res += that.sanitize($(this).children('.content').first().text());
                }
            });
            def.resolve(res);
        },
        function(){
            log.err('erreur when getting random page', 'scrap_vdm.scrap');
        });
    
    return def.promise;
};

/**
 * Just send back the random vdm category
 */
Vdm.prototype.getRandomPage = function (){
   
    var def = q.defer();
    var url = this.conf.vdm.urlrandom;
    request(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            def.resolve(html);
        }
        else{
            log.err('parsing '+url+' '+error, 'scrap_vdm.getRandomPage');
            def.reject();
        }
    });
    
    //def.resolve(htmlvdm)
    return def.promise;
};

/**
 * All the posts begin with Aujourd'hui and end with VDM. Therefore, these words are irrelevant
 * and have to be erased
 */
Vdm.prototype.sanitize = function(text){
    return text.replace(/Aujourd'hui, |VDM/g, '');
};





/*
	The only visible function in this module. It
	only creates a new instance and launch it.
*/
var getInstance = function(){
	return new Vdm();
};

module.exports.getInstance = getInstance;