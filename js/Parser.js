/*global
    $
 */

function Parser () {
	'use strict';
	
	/**
	 * Return the chart's title
	 * @param  {string} url 
	 * @return {string}     
	 */
	this.getTitle = function (url){	
		var regex = /chartTitle=([a-z]*)/i;
		var title = url.match(regex);

		if(title !== null)
        {return title[1];}
		else
        {return "";}
	};

	/**
	 * Return table associated to their sensors
	 * @param  {string} url 
	 * @return {Object}     
	 */
	 var getSensorsByTable = function (url) {
		var res;
		var rtn = {};

		var regex = /sensors\[([^\]]*)\]=\[((\d+(_[a-z]+)?,*)*)\]/gmi;
		while ((res = regex.exec(url)) !== null) {
		    if (res.index === regex.lastIndex) {
		        regex.lastIndex++;
		    }
		    rtn[res[1]] = res[2];
		}

		//case sensors[table][]=21
		regex = /sensors\[([^\]]*)\]\[\]=(\d+(_[a-z]+)?)/gmi; 
	 	while ((res = regex.exec(url)) !== null) {
	 		if (res.index === regex.lastIndex) {
	 			regex.lastIndex++;
	 		}
	 		if(rtn[res[1]] === undefined || rtn[res[1]] === null){
	 			rtn[res[1]] = '';
	 		}
	 		rtn[res[1]] += ',' + res[2];
		}

		return rtn;
	};

	/**
	 * Return sensors' id associated to their type
	 * @param  {string} str 
	 * @return {object}
	 */	
	var getSensorsByType = function (str) {
		var regex = /(\d+)(_([a-z]+))?/gmi; 
		var res;
		 
		var rtn = {};

		while ((res = regex.exec(str)) !== null) {
		    if (res.index === regex.lastIndex) {
		        regex.lastIndex++;
		    }
		    if(res[3] === 'l' || res[3] === 'line')
            {rtn[res[1]] = 'line';}
		    else if(res[3] === 'b' || res[3] === 'binary')
            {rtn[res[1]] = 'binary';}
		    else if(res[3] === 'c' || res[3] === 'column')
            {rtn[res[1]] = 'column';}
		    else
            {rtn[res[1]] = 'line';}
		}
		return rtn;
	};

	/**
	 * Return the sensors' type
	 * @param  {string} url 
	 * @return {Object}     
	 */
	this.getType = function (url) {
		var sensorsByTable = getSensorsByTable(url);

		$.each(sensorsByTable, function(index, val) {
			sensorsByTable[index] = getSensorsByType(val);
		});

		return sensorsByTable;
	};

	/**
	 * Format data for HighCharts
	 * @param  {Object} data 
	 * @param  {Object} type 
	 * @return {Object}      
	 */
	this.responseForChart = function (data, type) {
		var formattedSensors = [];
		$.each(data, function(tableName, sensors) {
			$.each(sensors, function(id, series) {
			    var temp = {};
			    temp.data = [];
			    temp.name = tableName + '.' + id;

			    if(
			    	!(typeof type === 'undefined' || type === null) && 
			    	!(typeof type[tableName] === 'undefined' || type[tableName] === null) &&
			    	!(typeof type[tableName][id] === 'undefined' || type[tableName][id] === null)
			    ){
			    	if(type[tableName][id] === 'binary'){
			    		temp.type = "line";
			    		temp.step = 'left';
			    	} else {
			    		temp.type = type[tableName][id];
			    	}
			    }

			    $.each(series, function(k, serie) {
			        temp.data.push([parseFloat(serie.timestamp) * 1000, parseFloat(serie.value)]);
			    });
			    
			    formattedSensors.push(temp);
			});
		});
		return formattedSensors;
	};

	/**
	 * Return only the parameters in the url
	 * @param  {string} url
	 * @return {string} 
	 */
	this.getQueryString = function (url) {
		if(url.indexOf('?') !== -1){
			return url.substr(url.indexOf('?') + 1).trim();
		} else {
			return '';
		}
		
	};
}