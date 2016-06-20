"use strict";
var os = require("os");
var q = require("q");


/*
	This is a hardware analysis class. It helps Harry knows 
	if something's physically wrong and ask some help or
	take action to save what must be saved
*/
function Hardware (){
	
	this.cpus = [];
	this.freeRam = 0;
	this.myRam = 9999;
	this.diskspace = 0;

};

/*
	Update the memory usage. It returns the percentage of free RAM
*/
Hardware.prototype.memInfo = function(){
	this.freeRam = parseInt(100*os.freemem()/os.totalmem());
	
	return 0;
};

/*
	Update how much RAM is used by harry
*/
Hardware.prototype.myRamInfo = function(){
	this.myRam = parseInt(100*process.memoryUsage().rss/os.totalmem());
	
	return 0;
};


/*
	Update the current cpus usage
*/
Hardware.prototype.cpusInfo = function(){

	var cpus = os.cpus();
	var cpuLoad = [];
	for(var i in cpus){
		var notIdle = cpus[i].times.user+cpus[i].times.nice+cpus[i].times.sys+cpus[i].times.irq;
		var idle = cpus[i].times.idle;
		cpuLoad.push(100*notIdle/idle);
	}
	
	this.cpus = cpuLoad;
	
	return 0;
};

/*
	Update the current disk space available (in MB). This is an asynchronous function,
	returns a promise.
*/
Hardware.prototype.diskSpaceInfo = function(){
	var dir = "/";
	if(os.platform() === "win32"){
		dir = process.cwd().substring(0,1).toUpperCase();
	}
	var diskspace = require('diskspace');
	var c = this;
	
	var deferred = q.defer();
	diskspace.check(dir, function (err, total, free, status){
		if(err){
			deferred.reject(new Error(error));
		}
		else{
			c.diskSpace = free/1000000;
			deferred.resolve("free disk space calculated");
		}
	});
	
	return deferred.promise;
};

/*
	Update the current hardware information. Only the diskSpace function is asynchronous,
	so others are executed once we are sure it is over.
	This function returns a promise so when called, one knows exactly when
	it is over
*/
Hardware.prototype.updateStatus = function(){
	var context = this;
	var deferred = q.defer();
	
	this.diskSpaceInfo().then(
		function(value){
			context.cpusInfo();
			context.memInfo();
			context.myRamInfo();
			//console.log("state updated");
			deferred.resolve("state updated");
		},
		function(err){
			deferred.reject(new Error(err));
		}
	).done();
	
	return deferred.promise;
}





































/*
	The only visible function in this module. It
	only creates a new me and launch it.
*/
var getInstance = function(){
	return new Hardware();
};

exports.getInstance = getInstance;