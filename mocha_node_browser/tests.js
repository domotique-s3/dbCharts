/*global
 $, Parser, Request, Chart, ErrorManager, describe, it, be
 */
/*jslint node: true */
/*jshint -W030*/

"use strict";
if (typeof require !== 'undefined') {
    var chai = require('chai');

    var fs = require('fs');
    var vm = require('vm');
    var path = './js/Parser.js';
    var code = fs.readFileSync(path);
    vm.runInThisContext(code);
}

var expect = chai.expect;
var should = chai.should();

var parser = new Parser();
var request = new Request();
var chart = new Chart();
var errm = new ErrorManager();

var response = {
    'table1': {
        '7': [{
            value: 10,
            timestamp: 14489540040.4
        },
            {
                value: 6,
                timestamp: 14494540640.6
            },
            {
                value: 16,
                timestamp: 14499043040.4
            },
            {
                value: 14,
                timestamp: 14501044640.6
            }]
    },
    'table2': {
        '2': [{
            value: 0,
            timestamp: 14490040040.4
        },
            {
                value: 1,
                timestamp: 14495040640.6
            },
            {
                value: 0,
                timestamp: 14499043040.4
            },
            {
                value: 1,
                timestamp: 14501044640.6
            },
            {
                value: 0,
                timestamp: 14501054640.6
            }],
        '15': [{
            value: 5,
            timestamp: 14488040070.6
        },
            {
                value: 10,
                timestamp: 14490040000.4
            },
            {
                value: 12,
                timestamp: 14491040070.6
            },
            {
                value: 4,
                timestamp: 14492040640.4
            },
            {
                value: 8,
                timestamp: 14495040640.6
            },
            {
                value: 6,
                timestamp: 14496040640.4
            },
            {
                value: 13,
                timestamp: 14496540640.6
            },
            {
                value: 2,
                timestamp: 14498406400.4
            },
            {
                value: 1,
                timestamp: 14500040640.6
            }]
    }
};


var type = {
    'table1': {
        '7': 'line'
    },
    'table2': {
        '2': 'binary',
        '15': 'column'
    }
};

describe('Parser', function () {

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
        describe('In case url = sensors[table]=[9_b, 11_c]', function () {
            var result = parser.removeSensorsType(url);

            it('result should be a string', function () {
                expect(result).to.be.a("string");
            });
            it('In this case, result should be \'sensors[table1]=[9,11]\'', function () {
                expect(result).to.equal("index.html?sensors[table1]=[1,2,3,4]&sensors[table2]=[5,6,7,8]&chartTitle=test&sensorsColumn=value");
            });
        });

        url = 'index.html?sensors[table1][]=1_b&sensors[table1][]=3_b&sensors[table1][]=45_c&sensors[table2][]=7_b&sensors[table2][]=9_b&chartTitle=test&sensorsColumn=value';
        describe('In case url = sensors[table][ ]=9_b', function () {
            var result = parser.removeSensorsType(url);

            it('result should be a string', function () {
                expect(result).to.be.a("string");
            });
            it('In this case, result should be \'sensors[table][ ]=9\'', function () {
                expect(result).to.equal("index.html?sensors[table1][]=1&sensors[table1][]=3&sensors[table1][]=45&sensors[table2][]=7&sensors[table2][]=9&chartTitle=test&sensorsColumn=value");
            });
        });
    });

    describe('get_type', function () {
        describe('In case url = sensors[table]=[9_b, 11_c]', function () {
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
                expect(result.table1, result.table2).to.be.a('object');
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

        describe('In case url = sensors[table][ ]=9_b', function () {
            var url = 'index.html?sensors[table1][]=1_b&sensors[table1][]=3_c&sensors[table1][]=45_l&sensors[table2][]=7_r&sensors[table2][]=9_l&chartTitle=test&sensorsColumn=value';
            var result = parser.getType(url);

            it('result shoud be an object', function () {
                expect(result).to.be.a('object');
            });
            it('result shoud have property table1 and table2', function () {
                expect(result).to.have.property('table1');
                expect(result).to.have.property('table2');
            });
            it('result.table1 and result.table2 should be object', function () {
                expect(result.table1, result.table2).to.be.a('object');
            });
            it('result.table1[x] and result.table2[x] should exist', function () {
                expect(result.table1[1]).to.exist;
                expect(result.table1[3]).to.exist;
                expect(result.table1[45]).to.exist;
                expect(result.table2[7]).to.exist;
                expect(result.table2[9]).to.exist;
            });
            it('In this case, result.table1[0].id and result.table1[0].type should be 1 and l', function () {
                expect(result.table1[1]).to.equal('binary');
                expect(result.table1[3]).to.equal('column');
                expect(result.table1[45]).to.equal('line');
                expect(result.table2[7]).to.equal('line');
                expect(result.table2[9]).to.equal('line');
            });
        });
    });

    describe('response_for_chart', function () {
        var format = parser.responseForChart(response, type);

        it('response should be an array', function () {
            expect(format).to.be.a('array');
        });
        it('return[x] have property data and name', function () {
            expect(format[0], format[1], format[2], format[3]).to.have.property('data');
            expect(format[0], format[1], format[2], format[3]).to.have.property('name');
        });
        it('name should be table1.10 (table name + sensor id)', function () {
            expect(format[0].name).to.equal('table1.7');
            expect(format[1].name).to.equal('table2.2');
            expect(format[2].name).to.equal('table2.15');
        });
        it('format[x].data == array', function () {
            expect(format[0].data).to.be.a('array');
        });
        it('return.data[x].length == 2', function () {
            expect(format[0].data[0]).to.have.length(2);
        });
        it('timestamp for chart should be timestamp * 100', function () {
            console.log(format[0].data[0]);
            expect(format[0].data[0][0]).to.equal(response.table1['7'][0].timestamp * 100);
        });
        it('type for sensor table1.7 should have property step and type', function () {
            expect(format[1]).to.have.property('step');
            expect(format[1]).to.have.property('type');
        });
        it('sensors table2.2 step and type should be left and line', function () {
            expect(format[1].step).to.equal('left');
            expect(format[1].type).to.equal('line');
        });
        it('sensors table2.15 step and type should be undefined and column', function () {
            expect(format[2].type).to.equal('column');
            expect(format[2].step).to.equal(undefined);
        });
    });
});

describe('Chart', function () {
    describe('construct', function () {

        var data = parser.responseForChart(response, type);
        chart.construct('Test', data, 'chart');
        $('#chart').hide();

        it('Chart should be an object', function () {
            expect(typeof chart).to.equal('object');
        });
        it('Chart should exist', function () {
            expect(document.getElementsByClassName('highcharts-container')[0]).to.exist;
        });
        it('Chart Title should be \'test\'', function () {
            expect($('.highcharts-title').text()).to.equal('Test');
        });

    });
});

describe('Request', function () {

    describe('send', function () {
        it('should be SUCESS', function (done) {
            request.send('ajax_test_success.php').then(
                function (result) {
                    expect(result).to.be.equal("SUCCESS");
                    done();
                },
                function (err) {
                    expect(err).to.be.equal("ERROR");
                    done();
                }
            );
        });
        it('should be ERROR', function (done) {
            request.send('ajax_test_error.php').then(
                function (result) {
                    expect(result).to.be.equal("SUCCESS");
                    done();
                },
                function (err) {
                    console.log(err);
                    expect(err.status).to.be.equal(500);
                    expect(err.responseText).to.be.equal("ERROR");
                    done();
                }
            );
        });
        it('should be BAD', function (done) {
            request.send('ajax_test_bad.php').then(
                function (result) {
                    expect(result).to.be.equal("SUCCESS");
                    done();
                },
                function (err) {
                    console.log(err);
                    expect(err.status).to.be.equal(400);
                    expect(err.responseText).to.be.equal("BAD");
                    done();
                }
            );
        });
        it('should be object', function () {
            expect(typeof request.send('ajax_test_success.php')).to.equal('object');
        });
    });
});

describe('Error Manager', function () {
    errm.display({
        "error": [
            {
                "error_code": "notValid",
                "message": "table is not a valid table name",
                "where": "table"
            }, {
                "error_code": "notATable",
                "message": "table is not one",
                "where": "table"
            }
        ]
    });
    $('#error-modal').modal('hide');
    describe('display', function () {
        it('Modal should exist', function () {
            expect(document.getElementById('error-modal')).to.exist;
        });
        it('Table should have two rows', function () {
            expect($('#error-table').find('tbody')[0].rows.length).to.be.equal(2);
        });
    });
});


