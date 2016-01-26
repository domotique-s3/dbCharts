function Parser () {
	
	/**
	 * Return the chart's title
	 * @url 	{String}
	 * @return 	{String}
	 */
	this.getTitle = function (url){	
		var re = /chartTitle=([a-z]*)/i;
		var title = url.match(re);

		if(title !== null)
			return title[1];
		else
			return "";
	};

	/** 
	 * Return the sensors' type
	 * @url 	{String}
	 * @return 	{Object}
	 */
	this.getType = function (url) {

	};

	/**
	 * Format data for HighChart accepted format
	 * @data	{Object}
	 * @return 	{Object}
	 */
	this.responseForChart = function (data) {
		var formatedSensors = [];
		$.each(data, function(tableName, sensors) {
			$.each(sensors, function(id, series) {
			    var temp = {};
			    temp.data = [];
			    temp.name = tableName + '.' + id;
			    $.each(series, function(k, serie) {
			        temp.data.push([parseFloat(serie.timestamp) / 100, parseFloat(serie.value)]);
			    });
			    
			    formatedSensors.push(temp);
			});
		});
		return formatedSensors;
	};
}