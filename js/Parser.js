function Parser () {
	
	/**
	 * Return the chart's title
	 * @url 	{String}
	 * @return 	{String}
	 */
	this.getTitle = function (url){	
		var regex = /chartTitle=([a-z]*)/i;
		var title = url.match(regex);

		if(title !== null)
			return title[1];
		else
			return "";
	};

	var getSensorsByTable = function (url) {
		var regex = /sensors\[([^\]]*)\]=\[((\d+_?\D?,*)*)\]/gmi; 
		var res;

		var rtn = {};

		while ((res = regex.exec(url)) !== null) {
		    if (res.index === regex.lastIndex) {
		        regex.lastIndex++;
		    }
		    rtn[res[1]] = res[2];
		}

		return rtn;
	};

	var getSensorsByType = function (str) {
		var regex = /(\d)_(\D)/gmi; 
		var res;
		 
		var rtn = [];

		while ((res = regex.exec(str)) !== null) {
		    if (res.index === regex.lastIndex) {
		        regex.lastIndex++;
		    }
		    rtn.push({
		    	id : res[1],
		    	type : res[2]
		   	});
		}

		return rtn;
	};

	/** 
	 * Return the sensors' type
	 * @url 	{String}
	 * @return 	{Object}
	 */
	this.getType = function (url) {
		var sensorsByTable = getSensorsByTable(url);

		$.each(sensorsByTable, function(index, val) {
			sensorsByTable[index] = getSensorsByType(val);
		});

		return sensorsByTable;
	};

	/**
	 * Format data for HighChart accepted format
	 * @data	{Object}
	 * @type	{Object}
	 * @return 	{Object}
	 */
	this.responseForChart = function (data, type) {
		var formattedSensors = [];
		$.each(data, function(tableName, sensors) {
			$.each(sensors, function(id, series) {
			    var temp = {};
			    temp.data = [];
			    temp.name = tableName + '.' + id;
			    $.each(series, function(k, serie) {
			        temp.data.push([parseFloat(serie.timestamp) / 100, parseFloat(serie.value)]);
			    });
			    
			    formattedSensors.push(temp);
			});
		});
		return formattedSensors;
	};
}