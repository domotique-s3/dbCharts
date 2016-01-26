if (typeof require !== 'undefined') {
	var chai = require('chai');
	
	var fs = require('fs');
	var vm = require('vm');
	var path = './js/Parser.js';
	var code = fs.readFileSync(path);
	vm.runInThisContext(code);
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

	describe('remove_sensors_type', function () {

		var url = 'index.html?sensors[table1]=[1_l,2_b,3_f,4_c]&sensors[table2]=[5_l,6_g,7_r,8_b]&chartTitle=test&sensorsColumn=value';
		var result = parser.removeSensorsType(url);
		
		it('result should be a string', function () {
			expect(result).to.be.a("string");
		});
		it('In this case, result should be \'sensors[table1]=[1,2,3,4]&sensors[table2]=[5,6,7,8]&\'', function () {
			expect(result).to.equal("index.html?sensors[table1]=[1,2,3,4]&sensors[table2]=[5,6,7,8]&chartTitle=test&sensorsColumn=value");
		});
	});

	describe('get_type', function () {

		var url = 'sensors[table1]=[1_l,2_b,3_f,4_c]&sensors[table2]=[5_l,6_g,7_r,8_b]&';
		var result = parser.getType(url);

		it('result shoud be an object', function () {
			expect(result).to.be.a('object');
		});
		it('result shoud have property table1 and table2', function () {
			expect(result).to.have.property('table1');
			expect(result).to.have.property('table2');
		});
		it('result.table1 and result.table2 should be object', function () {
			expect(result.table1,result.table2).to.be.a('object');
		});
		it('result.table1[x] and result.table2[x] should exist', function () {
			expect(result.table1[1]).to.exist;
			expect(result.table1[2]).to.exist;
			expect(result.table1[3]).to.exist;
			expect(result.table1[4]).to.exist;
			expect(result.table2[5]).to.exist;
			expect(result.table2[6]).to.exist;
			expect(result.table2[7]).to.exist;
			expect(result.table2[8]).to.exist;
		});
		it('In this case, result.table1[0].id and result.table1[0].type should be 1 and l', function () {
			expect(result.table1[1]).to.equal('line');
			expect(result.table1[2]).to.equal('binary');
			expect(result.table1[3]).to.equal('line');
			expect(result.table1[4]).to.equal('column');
			expect(result.table2[5]).to.equal('line');
			expect(result.table2[6]).to.equal('line');
			expect(result.table2[7]).to.equal('line');
			expect(result.table2[8]).to.equal('binary');
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

		var type = {
			'table1' : {
				'10' : 'binary',
				'20' : 'line'
			},
			'table2' : {
				'30' : 'column',
				'40' : 'line',
			}
		}

		var format = parser.responseForChart(response, type);

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
		it('type for sensor table1.10 should have property step and type', function(){
			expect(format[0]).to.have.property('step');
			expect(format[0]).to.have.property('type');
		});
		it('sensors table1.10 step and type should be left and line', function () {
			expect(format[0].step).to.equal('left');
			expect(format[0].type).to.equal('line');
		});
		console.log(format[2]);
		it('sensors table2.30 step and type should be undefined and column', function () {
			expect(format[2].type).to.equal('column');
			expect(format[2].step).to.equal(undefined);
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