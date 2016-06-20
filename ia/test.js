"use strict";

var log = require('./log.js').getInstance();
var ia = require('./me.js').getInstance();

//console.log(' \'frg"ergre:ere;erg*erge+erg-erge!!??egrg.egrg??erg '.replace(/([;:,\\"\\']|[\*\+\-\.\?!]+)/g, " \$1 "));
//console.log(' ?? '.replace(/([[\?]+])/g, " \$1 "));

//     /[,"'\+-*;:!+\.+\?+]/g



console.log('Program is getting ready...');
ia.prepare()
.then(function(){
    return ia.analyze('je mange une pomme');
})
.then(function(info){
    console.log(JSON.stringify(info));
    var cpt = 0;
    while(cpt<1000000000){
        cpt++;
    }
    ia.sleep().then(function(){
        console.log('ok');
    }).done();
});



/*
var tests = [
            ['1a', '1b', '1c'],
            ['2a', '2b', '2c', '2d', '2e'],
            ['3a'],
            ['4a', '4b', '4c'],
           ];
var nbT = tests.length;


var graph = [];

var node = function(index){
   
    if(!tests[index+1])
        return tests[index];
    else
        console.log(tests[index]+' '+node(index+1));
   
};

node(0);
*/