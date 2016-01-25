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

	};
}