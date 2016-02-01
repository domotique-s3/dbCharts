/*global
    Parser, console, ErrorManager, Request, $, Chart
 */
function Application() {
    'use strict';
	var url = '';
	var queryString = '';
	var type = {};
	var parser = new Parser();


	this.launch = function () {
		url = window.location.href;
		queryString = parser.getQueryString(url);
		console.info('PARAMETERS : ', queryString);

		if(queryString === ''){
			new ErrorManager().createModal('You have to provide some parameters in URL </br> Example : sensorIdColumn=sensor_id&valuesColumn=value&timestampColumn=timestamp&sensors[measurments]=[70_l,72_c]&startTime=1417962686.2894&endTime=141818181881.2399');
			throw new Error("No parameters given");
		}
		
		type = parser.getType(url);
		console.info("RESUME : ", type);
		

        new Request().send('dbCharts.php', queryString).then(
            function (/*result*/) {
            	//SUCCESS
            	data = parser.responseForChart(data, type);
            	var chart = new Chart().construct(parser.getTitle(queryString), data, 'chart');
            	addEventOnChart(chart);
            },
            function (err) {
            	//FAIL - 4xx - 5xx
            	if(err.status === 404){
            		new ErrorManager().createModal('The expected file was not found');
					throw new Error("Can't find the expected file");
            	}
            	if(err.status === 400){
            		new ErrorManager().display(err);
            	}
				throw new Error("An error occurred");
            }
        );
	};

	var addEventOnChart = function(chart){
		$(window).resize(function(event) {	
			chart.setSize(
				$(window).width(), 
				$(window).height(),
				false
			);
		});
	};

}