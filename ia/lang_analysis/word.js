"use strict";
/**
 * Everything to cope with usual needs about a word
 * { word: string,
 *   forms:[ type:'', lemma:'', lex:[], morphological:[], attr:{} ] 
 * }
*/
function Word() {
    this.word = '';
    this.found = false;
    this.forms = [];
    this.nbForms = 0;
    this.canBeInfinitive = false;
    this.canBeParticipe = false;
    
}

/**
 * Given an object {word:string, forms:[type:string, lemma:string, lex:[], morphological:[], attr:{}]}, fill the current object
 */
Word.prototype.load = function(w){
    if(w.word && w.forms){
        this.word = w.word;
        this.found = true;
        this.forms = w.forms;
        this.nbForms = this.forms.length;    
    }
};

/**
 * Add a possible form to the current word. Check type+lemma, and if it is the same, add a possible lexical and morphological form if it doesn't already exist
 * form is: [type:string, lemma:string, lex:string, morphological:[], attr:{}]
 */
Word.prototype.addForm = function(f){
    if(f !== [] && this.forms !== []){
        // first, checking if the type+lemma form already exists for this word
        var indexOfExistingForm = -1;
        for(var cpt=0; cpt<this.nbForms; cpt++){
            if(this.forms[cpt].type === f.type && this.forms[cpt].lemma === f.lemma){
                indexOfExistingForm = cpt;
            }
        } 
        
        // if it does, then the new information are concatenate
        if(indexOfExistingForm !== -1){

            // since there is only one possible lexical form in the parameter, the new one just has to be pushed in the relevant array
            if(f.lex[0] !== undefined && f.lex[0] !== '' && this.forms[indexOfExistingForm].lex.indexOf(f.lex[0]) === -1){
                this.forms[indexOfExistingForm].lex.push(f.lex[0]);
            }
            
            // it's a bit more complicated for the morphological form, since there are two arrays to compare. So for each new morphological form, it is added only if it does not alreay exists
            var nbNewMorph = f.morphological.length;
            for(var m=0; m<nbNewMorph; m++){
                if(this.forms[indexOfExistingForm].morphological.indexOf(f.morphological[m]) === -1 ){
                    this.forms[indexOfExistingForm].morphological.push(f.morphological[m]);
                }
            }
        }
        // if the type+lemma form does not alreay exist, then a new one is added to the forms array of the word
        else{
            this.forms.push({type:f.type, lemma:f.lemma, lex:f.lex, morphological:f.morphological});
        }
    }
    
    this.nbForms = this.forms.length;
    
    return true;
};


/**
 * Given an object {word:string, forms:[type:string, lemma:string, lex:[], morphological:[], attr:{}]}, fill the current object
 */
Word.prototype.formatted = function(w){
    
    return '['+this.getLemmasTypes()+']';
};



/**
 * create a string of all possible lemmas
 */
Word.prototype.getLemmasTypes = function(){
    var res = [];
    for(var cpt=0; cpt<this.nbForms; cpt++){
        var tmp = this.forms[cpt].lemma+' '+this.forms[cpt].type;
        if(res.indexOf(tmp) === -1){
            res.push(tmp);
        }
        
    }
    return res.join(' ');
};



/**
 * create a string of all possible lemmas
 */
Word.prototype.getLemmas = function(){
    var res = [];
    for(var cpt=0; cpt<this.nbForms; cpt++){
        if(res.indexOf(this.forms[cpt].lemma) === -1)
        res.push(this.forms[cpt].lemma);
    }
    return res.join(' ');
};



/**
 * create a string of all possible types
 */
Word.prototype.getTypes = function(){
    var res = [];
    for(var cpt=0; cpt<this.nbForms; cpt++){
        if(res.indexOf(this.forms[cpt].type) === -1)
            res.push(this.forms[cpt].type);
    }
    return res.join(' ');
};


/**
 * Get the different forms to write in the json file. It's useless to save everything else since it's only
 * deducted data
 */
Word.prototype.lexiconToSave = function(f){
    return JSON.stringify({word:this.word, forms:this.forms});
};



/*
	The only visible function in this module. It
	only creates a new instance and launch it.
*/
var getInstance = function(){
	return new Word();
};

module.exports.getInstance = getInstance;