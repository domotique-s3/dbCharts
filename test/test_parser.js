var assert = require('assert');
var expect = require('chai').expect;

var fs = require('fs');
var vm = require('vm');


var path = './js/Parser.js';


var code = fs.readFileSync(path);
vm.runInThisContext(code);

var parser = new Parser();

describe('Parser', function() {
  describe('getTitle(url)', function () {
    it('should return \'test\'', function () {
      assert.equal('test', parser.getTitle('index.html?sensors=[1,2,3]&chartTitle=test&sensorsColumn=value'));
    });
    it('should return \'\'', function () {
      assert.equal('', parser.getTitle('index.html?sensors=[1,2,3]&sensorsColumn=value'));
    });
  });
});