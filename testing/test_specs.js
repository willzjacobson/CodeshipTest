'use strict'

var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies');
chai.use(spies);

// Get functions to test on scope
var codeBase = require('../code');

describe('function getData', function() {

	it('takes a function as a first parameter and calls it on a function and an array', function(done) {
		
		var theArgs;
		var spyFunc = function() {
			theArgs = arguments;
		}
		var spy = chai.spy(spyFunc);

		codeBase.getData(spy)
		setTimeout(function() {
			expect(spy).to.have.been.called();
			expect(typeof theArgs[0]).to.equal('function');
			expect(Array.isArray(theArgs[1])).to.be.true;
			done();
		}, 1000);
	})

	it('also takes an array containing 1 file path. The array that the function argument is ultimately called on holds the contents of that file, with each line of text as an index', function(done) {

		var theArgs;
		var spyFunc = function() {
			theArgs = arguments;
		}
		var spy = chai.spy(spyFunc);

		codeBase.getData(spy, ['testing/comma_test'])
		setTimeout(function() {
			expect(theArgs[1].indexOf('Abercrombie, Neil, Male, Tan, 2/13/1943')).to.be.above(-1);
			expect(theArgs[1].indexOf('Bishop, Timothy, Male, Yellow, 4/23/1967')).to.be.above(-1);
			done();
		}, 1000);
	})

	it('works for multiple text files', function(done) {

		var theArgs;
		var spyFunc = function() {
			theArgs = arguments;
		}
		var spy = chai.spy(spyFunc);

		codeBase.getData(spy, ['testing/comma_test', 'testing/pipe_test', 'testing/space_test'])
		setTimeout(function() {
			expect(theArgs[1].indexOf('Abercrombie, Neil, Male, Tan, 2/13/1943')).to.be.above(-1);
			expect(theArgs[1].indexOf('Seles Monica H F 12-2-1973 Black')).to.be.above(-1);
			expect(theArgs[1].indexOf('Bonk | Radek | S | M | Green | 6-3-1975')).to.be.above(-1);
			done();
		}, 1000);
	})
})

describe('function objectifyAll', function() {

	it('takes a function as an argument and calls it on a function and an array', function() {
		
		var theArgs;
		var spyFunc = function() {
			theArgs = arguments;
		}
		var spy = chai.spy(spyFunc);

		codeBase.objectifyAll(spy);
		expect(Array.isArray(theArgs[1])).to.be.true;
	})

	it('also takes an array of strings, each containing a person\'s comma delimited info. Each string is converted to an object, and the function argument is called on an array of those objects', function() {

		var theArgs;
		var spyFunc = function() {
			theArgs = arguments;
		}
		var spy = chai.spy(spyFunc);
		var arr = ['Abercrombie, Neil, Male, Tan, 2/13/1943',
		'Bishop, Timothy, Male, Yellow, 4/23/1967'];

		codeBase.objectifyAll(spy, arr);
		expect(theArgs[1].length).to.equal(2);
		expect(theArgs[1][0].last).to.equal('Abercrombie');
		expect(theArgs[1][0].first).to.equal('Neil');
		expect(theArgs[1][0].sex).to.equal('Male');
		expect(theArgs[1][0].color).to.equal('Tan');
		expect(theArgs[1][0].DOB).to.equal('2/13/1943');

		expect(theArgs[1][1].last).to.equal('Bishop');
		expect(theArgs[1][1].first).to.equal('Timothy');
		expect(theArgs[1][1].sex).to.equal('Male');
		expect(theArgs[1][1].color).to.equal('Yellow');
		expect(theArgs[1][1].DOB).to.equal('4/23/1967');
	})

	it('does the same with pipe delimited information', function() {

		var theArgs;
		var spyFunc = function() {
			theArgs = arguments;
		}
		var spy = chai.spy(spyFunc);
		var inputArr = ['Bouillon | Francis | G | M | Blue | 6-3-1975',
		'Bonk | Radek | S | M | Green | 6-3-1975'];

		codeBase.objectifyAll(spy, inputArr);
		expect(theArgs[1].length).to.equal(2);
		expect(theArgs[1][0].last).to.equal('Bouillon');
		expect(theArgs[1][0].first).to.equal('Francis');
		expect(theArgs[1][0].sex).to.equal('Male');
		expect(theArgs[1][0].color).to.equal('Blue');
		expect(theArgs[1][0].DOB).to.equal('6/3/1975');

		expect(theArgs[1][1].last).to.equal('Bonk');
		expect(theArgs[1][1].first).to.equal('Radek');
		expect(theArgs[1][1].sex).to.equal('Male');
		expect(theArgs[1][1].color).to.equal('Green');
		expect(theArgs[1][1].DOB).to.equal('6/3/1975');
	})

	it('does the same with space delimited information', function() {

		var theArgs;
		var spyFunc = function() {
			theArgs = arguments;
		}
		var spy = chai.spy(spyFunc);
		var inputArr = ['Hingis Martina M F 4-2-1979 Green',
		'Seles Monica H F 12-2-1973 Black'];

		codeBase.objectifyAll(spy, inputArr);
		expect(theArgs[1].length).to.equal(2);
		expect(theArgs[1][0].last).to.equal('Hingis');
		expect(theArgs[1][0].first).to.equal('Martina');
		expect(theArgs[1][0].sex).to.equal('Female');
		expect(theArgs[1][0].color).to.equal('Green');
		expect(theArgs[1][0].DOB).to.equal('4/2/1979');

		expect(theArgs[1][1].last).to.equal('Seles');
		expect(theArgs[1][1].first).to.equal('Monica');
		expect(theArgs[1][1].sex).to.equal('Female');
		expect(theArgs[1][1].color).to.equal('Black');
		expect(theArgs[1][1].DOB).to.equal('12/2/1973');
	})

	it('works with all 3 formats at once', function() {

		var theArgs;
		var spyFunc = function() {
			theArgs = arguments;
		}
		var spy = chai.spy(spyFunc);
		var inputArr = ['Abercrombie, Neil, Male, Tan, 2/13/1943',
		'Seles Monica H F 12-2-1973 Black',
		'Bonk | Radek | S | M | Green | 6-3-1975'];

		codeBase.objectifyAll(spy, inputArr);
		expect(theArgs[1].length).to.equal(3);
		expect(theArgs[1][0].last).to.equal('Abercrombie');
		expect(theArgs[1][0].first).to.equal('Neil');
		expect(theArgs[1][0].sex).to.equal('Male');
		expect(theArgs[1][0].color).to.equal('Tan');
		expect(theArgs[1][0].DOB).to.equal('2/13/1943');

		expect(theArgs[1][1].last).to.equal('Seles');
		expect(theArgs[1][1].first).to.equal('Monica');
		expect(theArgs[1][1].sex).to.equal('Female');
		expect(theArgs[1][1].color).to.equal('Black');
		expect(theArgs[1][1].DOB).to.equal('12/2/1973');

		expect(theArgs[1][2].last).to.equal('Bonk');
		expect(theArgs[1][2].first).to.equal('Radek');
		expect(theArgs[1][2].sex).to.equal('Male');
		expect(theArgs[1][2].color).to.equal('Green');
		expect(theArgs[1][2].DOB).to.equal('6/3/1975');
	})

})

describe('function buildOutputs', function() {

	var inputArr = [ 
  { last: 'Bonk',
    first: 'Radek',
    midIn: 'S',
    sex: 'Male',
    color: 'Green',
    DOB: '6/3/1975' },
  { last: 'Bouillon',
    first: 'Francis',
    midIn: 'G',
    sex: 'Male',
    color: 'Blue',
    DOB: '6/3/1975' },
  { last: 'Abercrombie',
    first: 'Neil',
    sex: 'Male',
    color: 'Tan',
    DOB: '2/13/1943' },
  { last: 'Bishop',
    first: 'Timothy',
    sex: 'Male',
    color: 'Yellow',
    DOB: '4/23/1967' },
  { last: 'Hingis',
    first: 'Martina',
    midIn: 'M',
    sex: 'Female',
    DOB: '4/2/1979',
    color: 'Green' },
  { last: 'Seles',
    first: 'Monica',
    midIn: 'H',
    sex: 'Female',
    DOB: '12/2/1973',
    color: 'Black'} ];

    var theArgs;
	var spyFunc = function() {
		theArgs = arguments;
	}
	var spy = chai.spy(spyFunc);
	codeBase.buildOutputs(spy, inputArr);

	it('takes a function as an argument and calls it on an array', function() {
		expect(typeof theArgs[0]).to.equal('function');
		expect(Array.isArray(theArgs[1])).to.be.true;
	})

	it('builds output array 1: sorted by gender (females before males) then by last name ascending', function() {

		expect(theArgs[1][0][0].last).to.equal('Hingis');
		expect(theArgs[1][0][0].first).to.equal('Martina');
		expect(theArgs[1][0][0].sex).to.equal('Female');
		expect(theArgs[1][0][0].DOB).to.equal('4/2/1979');
		expect(theArgs[1][0][0].color).to.equal('Green');

		expect(theArgs[1][0][1].last).to.equal('Seles');
		expect(theArgs[1][0][2].last).to.equal('Abercrombie');
		expect(theArgs[1][0][3].last).to.equal('Bishop');
		expect(theArgs[1][0][4].last).to.equal('Bonk');
		expect(theArgs[1][0][5].last).to.equal('Bouillon');
	})

	it('builds output array 3: sorted by last name, descending', function() {

		expect(theArgs[1][2][0].last).to.equal('Seles');
		expect(theArgs[1][2][0].first).to.equal('Monica');
		expect(theArgs[1][2][0].sex).to.equal('Female');
		expect(theArgs[1][2][0].DOB).to.equal('12/2/1973');
		expect(theArgs[1][2][0].color).to.equal('Black');

		expect(theArgs[1][2][1].last).to.equal('Hingis');
		expect(theArgs[1][2][2].last).to.equal('Bouillon');
		expect(theArgs[1][2][3].last).to.equal('Bonk');
		expect(theArgs[1][2][4].last).to.equal('Bishop');
		expect(theArgs[1][2][5].last).to.equal('Abercrombie');
	})
})

describe('functions layOut and writeOutputFile', function() {

	var inputArr = [ [ { last: 'Hingis',
      first: 'Martina',
      midIn: 'M',
      sex: 'Female',
      DOB: '4/2/1979',
      color: 'Green'},
    { last: 'Seles',
      first: 'Monica',
      midIn: 'H',
      sex: 'Female',
      DOB: '12/2/1973',
      color: 'Black'},
    { last: 'Abercrombie',
      first: 'Neil',
      sex: 'Male',
      color: 'Tan',
      DOB: '2/13/1943'},
    { last: 'Bishop',
      first: 'Timothy',
      sex: 'Male',
      color: 'Yellow',
      DOB: '4/23/1967'},
    { last: 'Bonk',
      first: 'Radek',
      midIn: 'S',
      sex: 'Male',
      color: 'Green',
      DOB: '6/3/1975'},
    { last: 'Bouillon',
      first: 'Francis',
      midIn: 'G',
      sex: 'Male',
      color: 'Blue',
      DOB: '6/3/1975'} ],
  [ { last: 'Abercrombie',
      first: 'Neil',
      sex: 'Male',
      color: 'Tan',
      DOB: '2/13/1943'},
    { last: 'Bishop',
      first: 'Timothy',
      sex: 'Male',
      color: 'Yellow',
      DOB: '4/23/1967'},
    { last: 'Seles',
      first: 'Monica',
      midIn: 'H',
      sex: 'Female',
      DOB: '12/2/1973',
      color: 'Black'},
    { last: 'Bouillon',
      first: 'Francis',
      midIn: 'G',
      sex: 'Male',
      color: 'Blue',
      DOB: '6/3/1975'},
    { last: 'Bonk',
      first: 'Radek',
      midIn: 'S',
      sex: 'Male',
      color: 'Green',
      DOB: '6/3/1975'},
    { last: 'Hingis',
      first: 'Martina',
      midIn: 'M',
      sex: 'Female',
      DOB: '4/2/1979',
      color: 'Green'} ],
  [ { last: 'Seles',
      first: 'Monica',
      midIn: 'H',
      sex: 'Female',
      DOB: '12/2/1973',
      color: 'Black'},
    { last: 'Hingis',
      first: 'Martina',
      midIn: 'M',
      sex: 'Female',
      DOB: '4/2/1979',
      color: 'Green'},
    { last: 'Bouillon',
      first: 'Francis',
      midIn: 'G',
      sex: 'Male',
      color: 'Blue',
      DOB: '6/3/1975'},
    { last: 'Bonk',
      first: 'Radek',
      midIn: 'S',
      sex: 'Male',
      color: 'Green',
      DOB: '6/3/1975'},
    { last: 'Bishop',
      first: 'Timothy',
      sex: 'Male',
      color: 'Yellow',
      DOB: '4/23/1967'},
    { last: 'Abercrombie',
      first: 'Neil',
      sex: 'Male',
      color: 'Tan',
      DOB: '2/13/1943'} ] ]

	var output1 = "Output 1:\nHingis Martina Female 4/2/1979 Green\nSeles Monica Female 12/2/1973 Black\nAbercrombie Neil Male 2/13/1943 Tan\nBishop Timothy Male 4/23/1967 Yellow\nBonk Radek Male 6/3/1975 Green\nBouillon Francis Male 6/3/1975 Blue";
	var output2 = "Output 2:\nAbercrombie Neil Male 2/13/1943 Tan\nBishop Timothy Male 4/23/1967 Yellow\nSeles Monica Female 12/2/1973 Black\nBouillon Francis Male 6/3/1975 Blue\nBonk Radek Male 6/3/1975 Green\nHingis Martina Female 4/2/1979 Green";
	var output3 = "Output 3:\nSeles Monica Female 12/2/1973 Black\nHingis Martina Female 4/2/1979 Green\nBouillon Francis Male 6/3/1975 Blue\nBonk Radek Male 6/3/1975 Green\nBishop Timothy Male 4/23/1967 Yellow\nAbercrombie Neil Male 2/13/1943 Tan\n";
	
	describe('function layOut', function() {

		var theArgs;
		var spyFunc = function() {
			theArgs = arguments;
		}
		var spy = chai.spy(spyFunc);

		codeBase.layOut(spy, inputArr);

		it('takes a function, which it calls on two strings', function() {
			expect(typeof theArgs[0]).to.equal('string');
			expect(typeof theArgs[1]).to.equal('string');
		})

		it('lays out outputs 1, 2, and 3 nicely', function() {
			expect(theArgs[1].indexOf(output1)).to.be.above(-1);
			expect(theArgs[1].indexOf(output2)).to.be.above(-1);
			expect(theArgs[1].indexOf(output3)).to.be.above(-1);
		})

		it('lays out outputs 1, 2, and 3 in a nice format', function() {
			expect(theArgs[1]).to.equal(output1 + '\n\n' + output2 + '\n\n' + output3 + '\n');
		})
		
	})

	describe('function writeOutputFile', function() {

		it('correctly writes a text file', function(done) {

			codeBase.writeOutputFile('testing/output_test.txt', output1 + '\n\n' + output2 + '\n\n' + output3 + '\n'); 
			
			setTimeout(function() {
				fs.readFile('./testing/output_test.txt', 'utf8', function(err, text) {
					if (err) throw err;
					expect(text).to.equal(output1 + '\n\n' + output2 + '\n\n' + output3 + '\n');
					done();
				})
			}, 1000);

		})

	})


})





