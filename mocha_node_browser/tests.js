if (typeof require !== 'undefined') {
	var chai = require('chai');
	
	var fs = require('fs');
	var vm = require('vm');
	var path = './js/Parser.js';
	var code = fs.readFileSync(path);
	vm.runInThisContext(code);
} else {
}
var expect = chai.expect;
var parser = new Parser();

describe('Parser', function() {

	describe('get_title', function () {
		it('should return \'test\'', function () {
			expect(parser.getTitle('index.html?sensors=[1,2,3]&chartTitle=test&sensorsColumn=value')).to.equal("test");
		});
		it('should return \'\'', function () {
			expect(parser.getTitle('index.html?sensors=[1,2,3]&sensorsColumn=value')).to.equal("");
		});
	});
	describe('get_type', function () {
		it('TODO', function () {
			expect('TODO').to.equal('');
		});
	});
	describe('response_for_chart', function () {
		var response = {
			'table1' : {
				'10' : [{
					value : 10.3,
					timestamp : 1414141414.254
				}],
				'20' : [{
					value : 20.5,
					timestamp : 1414141414.254
				},{
					value : 20.6,
					timestamp : 1414141414.254
				}]
			},
			'table2' : {
				'30' : [{
					value : 30.2,
					timestamp : 1414141414.254
				},{
					value : 30.3,
					timestamp : 1414141414.254
				}],
				'40' : [{
					value : 40.6,
					timestamp : 1414141414.254
				}]
			}
		};

		var format = parser.responseForChart(response);
		it('response should be an array', function(){
			expect(format).to.be.a('array');
		});
		it('return[x] have property data and name', function(){
			expect(format[0],format[1],format[2],format[3]).to.have.property('data');
			expect(format[0],format[1],format[2],format[3]).to.have.property('name');
		});
		it('name should be table1.10 (table name + sensor id)', function(){
			expect(format[0].name).to.equal('table1.10');
			expect(format[1].name).to.equal('table1.20');
			expect(format[2].name).to.equal('table2.30');
			expect(format[3].name).to.equal('table2.40');
		});
		it('format[x].data == array', function(){
			expect(format[0].data).to.be.a('array');
		});
		it('return.data[x].length == 2', function(){
			expect(format[0].data[0]).to.have.length(2);
		});
		it('timestamp for chart should be timestamp / 100', function(){
			expect(format[0].data[0][0]).to.equal(response.table1['10'][0].timestamp / 100);
		});
	});
});

describe('Chart', function() {

	describe('TODO', function () {
		it('TODO', function () {
			expect('TODO').to.equal('');
		});
	});
});

describe('Request', function() {

	describe('TODO', function () {
		it('TODO', function () {
			expect('TODO').to.equal('');
		});
	});
});

describe('Error Manager', function() {

	describe('TODO', function () {
		it('TODO', function () {
			expect('TODO').to.equal('');
		});
	});
});