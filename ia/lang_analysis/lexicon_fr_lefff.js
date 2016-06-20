"use strict";
var q = require('q');
var fs = require('fs');
var byline = require('byline');
var buckets = require('buckets-js');
var word = require('./word.js');

/**
	A new dictionary constructor. This object will allow all dictionary related transaction (loading in memory, look up a word,...)
*/
function Lefff() {
	this.basePath = './ia/lang_analysis/';
	this.frLefffPath = this.basePath+'resources/lexicon_fr_lefff-3.4.elex';
	this.frLefffJsonPath = this.basePath+'resources/lexicon.json';
	this.frPossibleTypesPath = this.basePath+'resources/lefffPossibleTypes.txt';
	this.frPossibleMorphoPath = this.basePath+'resources/lefffPossibleMorphologicalForms.txt';
	this.frPossibleLexicalPath = this.basePath+'resources/lefffPossibleLexicalForms.txt';

}


/**
	Sends back a word from the dictionary
*/
Lefff.prototype.get = function (stringWord) {
	var res = this.dict.get(stringWord);
    var info = {"word":stringWord, "found":false, "forms":[]};
    if(res!==null) {
        info.found = true;
        info.forms = res.forms;
    }

	return info;
};



/**
 * Load all french words in a tree data structure from the lemma formatted file. 
 * If savePossibleValues= true, three filess are created with all possible types, morphological forms and lexical form
*/
Lefff.prototype.txtToJson = function (savePossibleValues) {
	var def = q.defer(),
    start = Date.now(),
    types = [],
    morphs = [],
    lexes = [];
    
    try {
        var stream = byline.createStream(fs.createReadStream(this.frLefffPath)),
        lexiconJsonFile = fs.createWriteStream(this.frLefffJsonPath),
        lexicon = new buckets.Dictionary(),
        instance = this;
        
        if(savePossibleValues){
            var typesFile = fs.createWriteStream(this.frPossibleTypesPath);
            var morphFile = fs.createWriteStream(this.frPossibleMorphoPath);
            var lexesFile = fs.createWriteStream(this.frPossibleLexicalPath);
        }
        
        
        // For each line read, a word structure is stored
        stream.on('data', function(line) {
            
            var form = instance.parseLine(String(line));
           
            // we get the word from the in memory dictionary
            var w = word.getInstance();
            var oldWord = lexicon.get(form.word);
            
            var l = [];
            l.push(form.lex);
            
            var f = [];
            f.push(
                {type:form.type,
                    lemma:form.lemma,
                    lex:l,
                    morphological:form.morphological
                }
            );
            // if it alreay exists, then the new form is concatenate to the old ones
            if(oldWord){
                w.load(oldWord);
                w.addForm(f[0]);
                
            }
            else{
                w.load({word:form.word, forms:f});
            }
            
            lexicon.set(w.word, w);

            // if we have to store all the possible interesting values, then wewrite everything in the relevant files
            if(savePossibleValues){
                
                // save a new type if not already encountered
                if(types.indexOf(form.type) === -1){
                    types.push(form.type);
                    typesFile.write(form.type+'\n');
                }
                
                // save a new morphological form if not already encountered
                var nbF = form.morphological.length;
                for(var cpt=0; cpt<nbF; cpt++){
                    if(morphs.indexOf(form.morphological[cpt]) === -1){
                        morphs.push(form.morphological[cpt]);
                        morphFile.write(form.morphological[cpt]+'\n');
                    }
                }
                
                // save a new lexical form if not already encountered
                if(lexes.indexOf(form.lex) === -1){
                    lexes.push(form.lex);
                    lexesFile.write(form.lex+'\n');
                }
            }
            
           
        });
        
        
        
        // When the file is completely loaded, just display the number of words keeped
        stream.on('end', function() {
            if(savePossibleValues){
                typesFile.end();
                morphFile.end();
                lexesFile.end();    
            }
            
            console.log(lexicon.size()+' words loaded in '+((Date.now()-start)/1000)+'s');
            def.resolve(lexicon);
        });
        
        // If any error occurs
        stream.on('error', function(err) {
            if(savePossibleValues){
                typesFile.end();
                morphFile.end();
                lexesFile.end();    
            }
            def.reject(err);
        });
    }
    catch(err) {
        def.reject(err);
    }
    
    return def.promise;
};


/**
 * take one of the file's line and gives back the information about the word
 * @params string
 * @return {}
 */
Lefff.prototype.parseLine = function(stringLine) {
    // the file has one line per possible form, so there will only be one form object required for each line
    var form = {word: '', type:'', lemma:'', lex:'', morphological:[], attr:{}};
    
    var line = stringLine.split('\t');
    
    // the word itself is always the first part of the line
    form.word = line[0];
    
    // The type of word, like adj, v, nc...
    form.type = line[2];
    // manage the case of "auxEtre" and "auxAvoir"
    if(form.type.startsWith('aux'))
        form.type = 'v';
    
    // get the morphological form of the word, like <Sub:sn>
    form.morphological = this.getMorphologicalForm(line[3]);
    
    // the lemma is always shown as something like: lemma______1
    // sometimes it is specified as a predicate information like [pred="lemma______1< and sometimes not, so if not we check the fourth index of the splitted line, otherwise we get the predicate
    var predicate = line[3].match(/\[pred=\".*</g);
    if(predicate !== null){
        predicate = predicate[0].replace(/\[pred=\"/g, '').replace(/</g, '');
    }
    else{
        predicate = line[4];
    }
    var indexOfEnd = predicate.indexOf('_');
    predicate = predicate.substring(0, indexOfEnd);
    form.lemma = predicate;
    
    // Lexical information about the word (ex: T2p)
    form.lex = line[6];
    
    /** FOLLOWING CODE IS TO GET OTHER ATTRIBUTES FROM THE LINE, BUT IT'S NOT RELEVANT FOR NOW SO THE CODE CAN BE REACTIVATED EASILY BUT WON'T BE USED
        // the line looks like 'morphologicalForm,othersattributes' so
        // we get rid of the first after having saving it
        var rawAttributes = (line[3].split('",'))[1];
        // if any unexpected format occurs
        if(rawAttributes != undefined) {
        var l = rawAttributes.length;
        // the attributes are separated by commas, they are all stored in an array
        rawAttributes = (rawAttributes.substring(0, l-1)).split(',');
        // all the array's value are transformed
        rawAttributes = rawAttributes.map(instance.getAttr);
        
        // for each attributes formatted in the previous line, only the one actually identified are stored
        l = rawAttributes.length;
        for(var cpt=0; cpt<l; cpt++) {
        if(rawAttributes[cpt].identified) {
        form.attr[rawAttributes[cpt].name] = rawAttributes[cpt].value;
        }
        }
        }
        else{
        }
     */   
    
    return form;
};


/**
 * from a substring of the file's line, return an array of all the different morphological information surrounding this word
 * @params string
 * @return array
 */
Lefff.prototype.getMorphologicalForm = function(rawString) {
    var forms = rawString.substring(rawString.indexOf('<')+1, rawString.indexOf('>')).trim();
    var res = [];
    if(forms != ''){
        res = forms.split(',');
    }
    return res;
};

/**
 * FOR NOW, ISN'T USED
 * from a substring of the file's attributes, returns an object wih the attribute information if it has been recognized. If not, the object has a status identified true/false
 * @params string
 * @return array
 */
Lefff.prototype.getAttr = function(attrString) {
    var res = {identified:false, name:'', value:''};
    var l = attrString.length;
    
    // Analyze the word's lexical information (sg, pl, the verb tense and mode...) if it exists: PFIJCYSTKGW 123 mf sp
    var lex = attrString.match(/^@([PFIJCYST]+[123]+[sp]*|K*[mf]{1}[sp]{1}|K{1}|W{1}|G{1})$/g);
    
    if(lex !== null) {
        res.identified = true;
        res.name= 'lex';
        res.value= lex[0].replace('@', '');
    }
    
    return res;
};



/**
	Load all french words in a tree data structure from the Json formatted file
*/
Lefff.prototype.load = function () {
	var def = q.defer(),
    lexicon = new buckets.Dictionary(),
    start = Date.now();
    try{
        // dictionary file opening
        var stream = byline.createStream(fs.createReadStream(this.frLefffJsonPath)),
        instance = this;
        
        // For each line read, a word structure is stored
        stream.on('data', function(line) {
            var word = JSON.parse(line);
            /*
            var word = {
                "word":stringLine.word,
                "forms":stringLine.forms
            };
            */
            lexicon.set(word.word, word);
        });
        
        // When the file is completely loaded, just display the number of words keeped
        stream.on('end', function() {
            console.log(lexicon.size()+' words loaded in '+((Date.now()-start)/1000)+'s');
            def.resolve(lexicon);
        });
        
        // If any error occurs
        stream.on('error', function(err) {
            console.log(err);
            def.reject(lexicon);
        });
    }
    catch(err) {
        def.reject(lexicon);
    }
    
    return def.promise;
};









/**
	The only visible function in this module. It
	only creates a new dictionary and sends it back
*/
exports.lefff = new Lefff();