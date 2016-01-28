function Chart () {

	/**
	 * Construct a chart in the container provides in parameters
	 * with the data and title provide
	 * @title 		{String}
	 * @data 		{array}
	 * @container 	{String}
	 * @return 		{HighChart Object}
	 */
	this.construct = function(title, data, container){
		var options = {
			title: {
				text: title
			},
		    chart: {
		    	renderTo: container,
		    	zoomType : 'x'
		    },
		    plotOptions: {
		        line: {
		            marker: {
		                enabled: false
		            }
		        }
		    },
		    xAxis: { type: 'datetime' },
		    series: data
		};
		var chart = new Highcharts.Chart(options);
		return chart;
	};

}
