function Application() {

	var url = '';
	var queryString = '';
	var type = {};
	var parser = new Parser();


	this.launch = function () {
		//url = window.location.href;
		url = 'web/index.html?sensorIdColumn=sensor_id&valuesColumn=value&timestampColumn=timestamp&sensors[measurments]=[70_l,72_c]&startTime=1417962686.2894&endTime=141818181881.2399';
		queryString = parser.getQueryString(url);
		console.log('PARAMETERS : ', queryString);
		
		type = parser.getType(url);
		console.log("RESUME : ", type);
		

        request.send('dbCharts.php', queryString).then(
            function (result) {
            	//SUCCESS
            	var data = JSON.parse(result.responseText);
            	data = parser.responseForChart(data, type);
            	var chart = new Chart().construct(parser.getTitle(queryString), data, 'chart');
            	addEventOnChart(chart);
            },
            function (err) {
            	//FAIL - 4xx - 5xx
            	var errors = JSON.parse(err);
            	new ErrorManager.display(errors);
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