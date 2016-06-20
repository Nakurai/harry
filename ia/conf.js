"use strict";

/**
 * All the configuration variables we will need in the program. That willbe a huuuuge file in the the end,
 * but I just have to change the values in it to update everything, and to send a void file on github to avoid
 * all my personal information to be displayed. And that's cool
 */
function WolfConf(){
    this.conf = {
        // control behavior of the logs: code: 0=prod, 1=debug, 2=dev
        mode:{
            code:2,
            label:'dev'
        },
        //specifies which are the websites we should get voc from
        learnVocFrom:{
            vdm:true,
            coucherMoinsBete:false,
            dtc:false
        },
        // information about the mongodb database
        db:{
            url:'http://localhost:27017',
            name:'harry',
            user:'',
            pwd:''
        },
        // all the information related to twitter (urls, api keys...)
        twitter:{
            url:'https://twitter.com'
        },
        // all the information related to viedemerde (urls, api keys...)
        vdm:{
            urlrandom:'http://www.viedemerde.fr/aleatoire'
        },
        // all the information related to se coucher moins bete (urls, api keys...)
        coucherMoinsBete:{
            urlrandom:'http://secouchermoinsbete.fr/random'
        },
        // all the information related to dans ton chat(urls, api keys...)
        dtc:{
            urlrandom:'http://danstonchat.com/random.html'
        }
    };
}



/*
	The only visible function in this module. It
	only creates a new instance and launch it.
*/
var getConf = function(){
	return (new WolfConf()).conf;
};

module.exports.getConf = getConf;