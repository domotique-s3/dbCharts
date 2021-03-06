/*global
Promise,$
 */
function Request () {
	"use strict";
	/**
	 * Send a request to the server in Synchrone mode
	 * @file 		{string}
	 * @parameters 	{string - Object}
	 * @return 		{promise}
	 */
	this.send = function (file, parameters) { 
	 	return new Promise(function(resolve, reject) {
	 		$.ajax({
	 			url: file,
	 			type: 'GET',
	 			data: parameters
	 		})
	 		.done(function(data) {
	 			resolve(data);
	 		})
	 		.fail(function(data) {
	 			reject(data);
	 		});
	 	});
	};

}