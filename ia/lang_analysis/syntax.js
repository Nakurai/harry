"use strict";

var q = require("q");
var fs = require('fs');
var buckets = require('buckets-js');

var lefff = require('./lexicon_fr_lefff.js').lefff;
var word = require('./word.js');

/*
	All the functions to analyze sentences
*/
function Syntax(){
    this.lexicon_lefff = null;
    
    this.basePath = './ia/lang_analysis/';
	this.frLexiconBkpPath = this.basePath+'resources/lexicon_bkp.json';
}

/**
 * Load everything this module needs to work correctly:
 * the dictionary
 */
Syntax.prototype.prepare = function(){
    var def = q.defer();
    var that = this;
    lefff.load().then(
        function(lexicon){
            that.lexicon_lefff = lexicon;
            def.resolve();
        },
        function(err){
            console.log('[syntax.prepare] '+err);
            def.reject();
        }
    ).done();
    
    return def.promise;
};


/**
 * use the txtToJson function of the lefff form
 */
Syntax.prototype.extractLexiconFromTxt = function(){
    var def = q.defer();
    var that = this;
    lefff.txtToJson().then(
        function(lexicon){
            that.lexicon_lefff = lexicon;
            def.resolve();
        },
        function(err){
            console.log('[syntax.prepare] '+err);
            def.reject();
        }
    ).done();
    
    return def.promise;
};


/**
 * Look into all the different lexicon loaded to find a word according to its normal form
 */
Syntax.prototype.get = function(stringWord){
    var info = word.getInstance();
    
    // first, we fetch the word in all the lexicons we have, first as it is, then in lower case
    var lex = this.lexicon_lefff.get(stringWord);
    
    if(lex === undefined){
        lex = this.lexicon_lefff.get(stringWord.toLowerCase());
    }
    
    // Once all possible reseaches have been done, if it is found, we load the word instance with it, otherwise an empty one is sent back
    if(lex === undefined){
        info.word = stringWord;
    }
    else{
        info.load(lex);    
    }
    return info;
};



/** Allow us to get an array of words from a text.
 * Rules of splitting are the ones from the functions in this file:
 * splitText splitSentence
 */
Syntax.prototype.getWordsFromText = function(text){
    
    var result = this.splitSentences(this.splitText(text));
    
    return result;
};


/**
	erase punctuations signs and split the sentence upon spaces
	the idea is that by treating all sentences the same and learn on that, human rules does not
	really matter
    @todo O(n²) complexity, see how to fix that
	@param string, an array of sentences to split
	@return array, the splitted sentence
*/
Syntax.prototype.splitSentences = function (sentences){
	// this is an array which will contains all the words from all the sentences
    var res = [];
    
	if(sentences){
        var nbS = sentences.length,
        instance = this;
        
        //first we pare all the sentences in the parameter array
        for(var cpt=0; cpt<nbS; cpt++){
            var splittedWords = sentences[cpt].replace(/([;:,\\"\\']|[\*\+\-\.\?!]+)/g, " \$1 ").trim().split(" ");
            /*
            var wordsInfo = [];
            var nbW = splittedWords.length;
            for(var cpt=0; cpt<nbW; cpt++){
                console.log(splittedWords[cpt]);
                wordsInfo.push(this.get(splittedWords[cpt].trim()));
            }
            */
            
            var wordsInfo = splittedWords.map(function(word){
                return instance.get(word.trim());
            });
            
            res.push({sentence:sentences[cpt], words:wordsInfo});
        }
	}
	return res;
};

/**
 * A little function to split a text and get all the sentences in it
 * we split the text by the final punctuation symbol:
 * . ... ; ! ?
 */
Syntax.prototype.splitText = function(text){
    var res = [];
    if(text){
        var tmp = text.replace(/([\.\!\?;])\s(['"A-Z])/g, "\$1*iaNewSentence*\$2").trim().split('*iaNewSentence*');
        var nbSentences = tmp.length;
        for(var cpt3=0; cpt3<nbSentences; cpt3++){
            var s = tmp[cpt3].trim();
            if(s){
                res.push(s);
            }
        }
    }
    return res   
};


/**
 * Save the lexicon in a JSON format !
 * @todo: save the old file as a backup, write the new file
 */
Syntax.prototype.saveJson = function() {
    var def = q.defer();
        
    try{
        var writer = fs.createWriteStream(this.frLexiconBkpPath);
        writer.on('finish', function() {
            console.log('lefff lexicon saved');
            def.resolve();
        });
        writer.on('error', function(err) {
            console.log(err);
            def.resolve();
        });

        var nbWords = this.lexicon_lefff.size();    
        var nbWordsWritten = 0;
        if(nbWords !== 0) {
            this.lexicon_lefff.forEach(function(key, value) {
                writer.write(JSON.stringify(value)+'\n');
                nbWordsWritten++;
                if(nbWordsWritten == nbWords) {
                    console.log(nbWordsWritten+' written, over');
                    writer.end();
                }
            });   
        }
        
    }
    catch(err) {
        def.reject(err);
    }
    
    return def.promise;
};


/**
 * Save everything and release memory
 */
Syntax.prototype.close = function(){
    var d = q.defer();
    this.saveJson().then(
        function(){
            d.resolve();
        },
        function(err){
            console.log(err);
            d.reject(err);
        }
    ).done();
    
    return d.promise;
};





/**
	The only visible function in this module. It
	only creates a new instance and launch it.
*/
var getInstance = function(){
	return new Syntax();
};

module.exports.getInstance = getInstance;
