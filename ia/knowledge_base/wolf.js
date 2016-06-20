"use strict";
var q = require("q");
var fs = require('fs');
var byline = require('byline');
var buckets = require('buckets-js');
/**
 * This is the root of the ia knowledge
*/
function Wolf() {
    this.basePath = './ia/knowledge_base/';
	this.wolfXmlPath = this.basePath+'/resources/wolf-1.0b4.xml';
	//this.wolfXmlPath = this.basePath+'/resources/wolf_test.xml';
	this.wolfTagsPath = this.basePath+'/resources/wolfTags.txt';
	this.wolfJsonPath = this.basePath+'/resources/wolf.json';
	this.wolfRootConceptsPath = this.basePath+'/resources/roots.json';
	this.wolfLexicalListPath = this.basePath+'/resources/lexicon.json';
    this.db = null;
}


/**
 * Read all the xml file from the INRIA website and only keep the information we want
 */
Wolf.prototype.xmlToJson = function(){
    var d = q.defer(),
    closingTags = [],
    start = Date.now(),
    nbLines = 0;
    
    try {
        var stream = byline.createStream(fs.createReadStream(this.wolfXmlPath)),
        jsonWriter = fs.createWriteStream(this.wolfJsonPath),
        tagsWriter = fs.createWriteStream(this.wolfTagsPath),
        rootWriter = fs.createWriteStream(this.wolfRootConceptsPath),
        instance = this;   
        
        // For each line read, a word structure is stored
        stream.on('data', function(line) {
            nbLines++;
            if(nbLines%50000 === 0){
                console.log(nbLines + ' saved...');
            }
            var l = String(line);
            var tags = instance.getTags(l);
            // Reformatting of the same information. only the synsets line are interesting
            if(tags !== null){
                if(tags.literals.length !== 0){
                    // For exploration purpose, list all the root concepts (ie, the ones without hypernym !)
                    if(tags.hypernyms.length === 0){
                        tags.isRoot = true;
                        rootWriter.write(JSON.stringify(tags.literals)+'\n');
                    }
                    else{
                        tags.isRoot = false;
                    }
                    jsonWriter.write(JSON.stringify(tags)+'\n');
                }
            }
            
            
            
            // For documentation purpose, keep all the different tags in the file
            var ct = instance.getClosingTags(l);
            if(ct !== null){
                var nbT = ct.length;
                for(var cpt=0; cpt<nbT; cpt++){
                    if(closingTags.indexOf(ct[cpt]) === -1){
                        closingTags.push(ct[cpt]);
                        tagsWriter.write(ct[cpt]+'\n');
                    }
                }
            }
        });
        
        // When the file is completely loaded, just display the number of words keeped
        stream.on('end', function() {
            jsonWriter.end();
            tagsWriter.end();
            console.log(nbLines+' concepts saved in '+((Date.now()-start)/1000)+'s');
            d.resolve();
        });
        
        // If any error occurs
        stream.on('error', function(err) {
            console.log(err);
            jsonWriter.end();
            tagsWriter.end();
            d.reject();
        });
    }
    catch(err) {
        console.log(err);
        d.reject();
    }
    
    
    return d.promise;
};


/**
 * Getting all the different tag and ther value of a synset from on of the file's line
 */
Wolf.prototype.getClosingTags = function(stringLine){
    var res = stringLine.match(/<\/[A-Z]+>/g);
    if(res !== null)
        res = res.map(function(val){return val.replace(/[\/<>]/g, '')});
    return res;
};



/**
 * Getting all the different tag and ther value of a synset from on of the file's line
 */
Wolf.prototype.getTags = function(stringLine){
    // first, let's see if is a line of interest, ie a synset line (and not a comment or anything else)
    var res = null;

    if(stringLine.indexOf('SYNSET') !== -1){
        res = {};
        // get the ID of the concept (only one per line)
        res.id = this.cleanTag(stringLine.match(/<ID.+<\/ID>/g)[0]);
        
        // keep the DEF definition of the concept (only one per line)
        res.def = this.cleanTag(stringLine.match(/<DEF.+<\/DEF>/g)[0]);
        
        // for literals and co, we have to split the line several times
        var lit = stringLine.match(/<LITERAL.+<\/LITERAL>/g);
        if(lit !== null){
            res.literals = lit.join().replace(/<\/LITERAL>/g, '</LITERAL>**SPLITHERE**').split('**SPLITHERE**').filter(function(val){return val.indexOf('EMPTY') === -1;}).map(this.cleanTag).filter(function(val){return val !== ''});    
        }
        else{
            res.literals = [];
        }
        
        // find the hypernym among ILR tags
        var ilr = stringLine.match(/<ILR.+<\/ILR>/g);
        if(ilr !== null){
            res.hypernyms = ilr.join().replace(/<\/ILR>/g, '</ILR>**SPLITHERE**').split('**SPLITHERE**').filter(function(val){return val.indexOf('hypernym') !== -1;}).map(this.cleanTag).filter(function(val){return val !== ''});
        }
        else{
            res.hypernyms = [];
        }
    }
    
    return res;
};



/**
 * Get rid of the brackets, keep only the values
 */
Wolf.prototype.cleanTag = function(tag){
    return tag.substring(tag.indexOf('>')+1, tag.lastIndexOf('<'));
};



/*
	The only visible function in this module. It
	only creates a new instance and launch it.
*/
var getInstance = function(){
	return new Wolf();
};

module.exports.getInstance = getInstance;