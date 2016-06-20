"use strict";
var syntax = require('./lang_analysis/syntax.js').getInstance();

/**
 * This file is used to load the json lexicon from its original format in txt
*/ 
console.log('Program is getting ready...');
syntax.extractLexiconFromTxt()
.then(syntax.close.bind(syntax))
.done(function(){
    console.log('ok');
});


