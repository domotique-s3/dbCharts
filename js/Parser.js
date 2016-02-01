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

		var regex = /sensors\[([^\]]*)\]=\[((\d+_?\D?,*)*)\]/gmi;
		while ((res = regex.exec(url)) !== null) {
		    if (res.index === regex.lastIndex) {
		        regex.lastIndex++;
		    }
		    rtn[res[1]] = res[2];
		}

		regex = /sensors\[([^\]]*)\]\[\]=(\d+_?\D?,*)/gmi; 
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
	 * @return {array}
	 */	
	var getSensorsByType = function (str) {
		var regex = /(\d+)_?(\D?)/gmi; 
		var res;
		 
		var rtn = {};

		while ((res = regex.exec(str)) !== null) {
		    if (res.index === regex.lastIndex) {
		        regex.lastIndex++;
		    }

		    if(res[2] === 'l' || res[2] === 'line')
            {rtn[res[1]] = 'line';}
		    else if(res[2] === 'b' || res[2] === 'binary')
            {rtn[res[1]] = 'binary';}
		    else if(res[2] === 'c' || res[2] === 'column')
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
			        temp.data.push([parseFloat(serie.timestamp) * 100, parseFloat(serie.value)]);
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
		var urlQueryString = removeSensorsType(url);
		if(urlQueryString.indexOf('?') !== -1){
			return urlQueryString.substr(urlQueryString.indexOf('?') + 1).trim();
		} else {
			return '';
		}
		
	};

	/**
	 * Remove sensors type in string (1_t)
	 * @param  {string} str 
	 * @return {string}
	 */
	var removeSensorsType = function (str) {
		var regex_replace = /(\d+)_?(\D?)/gmi; 
		var regex_findSensor = /sensors\[([^\]]*)\]=\[((\d+_?\D?,*)*)\]/gmi; 

		var res;
		var replace = [];

		/*In case : sensors[table]=[9_b, 15_c]*/
		while ((res = regex_findSensor.exec(str)) !== null) {
		    if (res.index === regex_findSensor.lastIndex) {
		        regex_findSensor.lastIndex++;
		    }
		    replace.push({
		    	origin : res[0],
		    	sensor : res[2]
		    });
		}

		/*In case : sensors[table][]=9_b*/
		regex_findSensor = /sensors\[([^\]]*)\]\[\]=(\d+_?\D?,*)/gmi; 
	 	while ((res = regex_findSensor.exec(str)) !== null) {
	 		if (res.index === regex_findSensor.lastIndex) {
	 			regex_findSensor.lastIndex++;
	 		}
		    replace.push({
		    	origin : res[0],
		    	sensor : res[2]
		    });
		}

		$.each(replace, function(index, val) {
			str = str.replace(val.origin, val.origin.replace(val.sensor, val.sensor.replace(regex_replace, '$1')));
		});
		return str;
	};
}