/*global
Highcharts
 */
function Chart () {
	'use strict';
	/**
	 * Construct a chart in the container provides in parameters
	 * with the data and title provide
	 * @title 		{String}
	 * @data 		{array}
	 * @container 	{String}
	 * @return 		{Highcharts.Chart}
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
		return new Highcharts.Chart(options);};

}
