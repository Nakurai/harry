"use strict";


/*****************************
 Dependencies loading
*****************************/
var express = require('express');
// This is for getting easily the input from web POST method forms
var bodyParser = require('body-parser'); 
var ia = require('./ia/me.js').getInstance();
// This is to sanitize the above input
var expressValidator = require('express-validator');
// This is to allow connexion to the server from mobile phone for example
var cors = require('cors');

var app = express();

/*****************************
 Server parameters definition
******************************/
// the ./public directory will be parsed when js script or images are loaded through html pages
app.use('/img', express.static(  __dirname+'/public/img' ) );
app.use('/js', express.static(  __dirname+'/public/js' ) );
app.use('/css', express.static(  __dirname+'/public/css' ) );

// bodyparser is used to get "POST" parameters from a form
// Validator is a sanitizer for input fields
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cors());

// ejs is used to render html pages !
app.engine('ejs', require('ejs').renderFile);
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');





/*****************************
 Custom variables definition
******************************/
var port = process.env.PORT || 8081;
console.log('will listen on port '+port);


/*****************************
 URL param
******************************
app.param('voc_wordToFind', function (request, response, next, userto) {
  //look for the word in the available voc
  console.log('mot à chercherrécupéré !');
  request.wordToFind = 'test';
  return next();
});
*/


/*****************************
 Router
*****************************/


// display the form to search all information about a particular word
app.get('/', function(req, res) {
	res.render('page_chat', {"status":"init", "info":[]});
});

// get a word trhough POST method and disp information about this word
app.post('/', function(req, res) {
    var s = req.body.sentence;
    if(s){
        ia.analyze(s).then(
            function(analyzedSentences){
                var nbSentences = analyzedSentences.length;
                var infoS =[];
                for(var indexS=0; indexS<nbSentences; indexS++){
                    var nbWords = analyzedSentences[indexS].words.length;
                    var infoW = [];
                    for(var indexW=0; indexW<nbWords; indexW++){
                        infoW.push(analyzedSentences[indexS].words[indexW].formatted());
                    }
                    infoS.push(infoW);
                }
                res.render('page_chat', {"status":"ok", "info":infoS});
                return true;
            },
            function(err){
                res.render('page_chat', {"status":"error", "info":err});
                return true;
            }
        ).done();
    }
    else{
        res.render('page_chat', {"status":"noInput", "info":""});
    }
	
});



// index page, the frameslist.json file is read and frames are displayed on the page 
app.get('/about', function(req, res) {
	res.render('page_about');
});







// 404 handling
app.use(function(req, res, next){
    res.status(404).render('page_error_not_found');
});

// When the server must be shut down, some operations can be executed
var gracefulShutdown = function(){
    console.log('Server [off]');
    process.exit();
};

// listen for TERM signal .e.g. kill 
process.on ('SIGTERM', gracefulShutdown);
// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', gracefulShutdown);  


/*****************************
 Launching
*****************************/
// All its needs are prepared
ia.prepare().then(
	function(value){
		if(value === 'ready'){
			app.listen(port);
			console.log('Server [on]');
		}
		else{
			console.log('Server [off]');
		}
	},
	function(err){
		console.log(err+'\nServer [off]');
	}
).done();