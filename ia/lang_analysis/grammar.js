"use strict";
var q = require("q");


/**
 * Grammatical analysis of a sentence:
 * find the first verb, check if it is a compossed tense => split the sentence in half
 * find pattern x "de" y => associate x to y
 * find adjectives [noun][adj] => associates the adj to the noun
 * 
 * The sentence must be formatted like the rsult of a syntax analysis:
 * {
 *  sentence:sentence_as_string,
 *  words:[
 *      word:word_as_string,
 *      found:bool_to_indicate_if_found_in_lexicon
 *      forms:[
 *          root:lemma_of_word,
 *          attr:{
 *              type:lexical_type
 *              gender:
 *              number:
 *              person:
 *              mode:
 *              tense:
 *          }
 *      ]
 *  ]
 * }
 * 
 * /!\ if the words has not been found, the forms array is empty
*/
function Grammar (){
	this.sentence = {};
    this.sentence.mainVerb = '';
    this.nbWords = 0;
}


/**
 * Receive a sentence formatted like the result of the syntax analysis and launch all the analysis steps
 */
Grammar.prototype.analyze = function(sentence){
    if(sentence){
        this.sentence = sentence;
        this.nbWords = sentence.words.length;
        this.possibleForms();
    }
    
};


/**
 * Receive a sentence formatted like the result of the syntax analysis and create a graph of the most probable forms chaining
 */
Grammar.prototype.possibleForms = function(){
    
    var chainsForms = [];
    for(var cpt=0; cpt<this.nbWords; cpt++){
        var forms = this.sentence.words[cpt].forms;
        var nbForms = forms.length;
        for(var cpt2=0; cpt2<nbForms; cpt2++){
            if(cpt==0){
                
            }
            else{
                
            }
        }
        
        
    }
   
    console.log(this.sentence.sentence);
    console.log(chainsForms);
    
    return possibleForms;
};

Grammar.prototype.formatForm = function(form){
    var stringForm = form.root + '('+form.attr.type.toUpperCase()+')';
    /*
    if(form.attr.gender){
        stringForm += '-'+form.attr.gender;
    }
    if(form.attr.number){
        stringForm += '-'+form.attr.number;
    }
    if(form.attr.mode){
        stringForm += '-'+form.attr.mode;
    }
    */    
    return stringForm;
}; 


/**
 * Load everything this module needs to work correctly:
 * the dictionary
 *
Grammar.prototype.findMainVerb = function(){
    var mainVerbFound = false;
    // for each word of the sentence,
    for(var cpt=0; cpt<this.nbWords; cpt++){
        if(mainVerbFound){
            break;
        }
        var w = this.sentence.words[cpt];
        var nbForms = w.forms.length;
        // their forms are scanned
        for(cpt2=0; cpt2<nbForms; cpt2++){
            // if the word can be a verb and is not infinitive
            if(w.forms[cpt2].attr.type == 'ver' && w.forms[cpt2].attr.mode != 'inf'){
                // the current word is probably the main verb, its index is stored
                var indexFound = cpt;
                // then we check the next to see if it is a past participe. If it is, then the main verb is this one
                if(this.sentence.words[cpt+1].forms[0].attr.type == 'ver' && this.sentence.words[cpt+1].forms[0].attr.mode == 'part'){
                    indexFound = cpt+1;
                }
                
                this.sentence.words[indexFound].isMainVerb = true;
                mainVerbFound = true;
                break;
            }
        }
    }
};
*/




/*
	The only visible function in this module. It
	only creates a new me and launch it.
*/
var getInstance = function(){
	return new Grammar();
};

module.exports.getInstance = getInstance;