'use strict'

var fs = require('fs');

getData(objectifyAll, ['comma', 'pipe', 'space']);

// Appends data from a file to 'data'. If we're done reading files, parse 'data'. 'func' should be 'objectifyAll'
function getData(func, filesOfInterest) {
	var data;
	var counter = 0;
	// For each file, read aq	 nd append to 'data'
	if (filesOfInterest && filesOfInterest.length) {
		filesOfInterest.forEach(function(path) {
			fs.readFile('./' + path + '.txt', 'utf8', function(err, results) {
				if (err) throw err;
				else {	
					data += results;
					counter++;
					// When files are all read, lose any "undefined's", split into an arry, and parse that data!
					if (counter === filesOfInterest.length) func(buildOutputs, data.replace('undefined', '').split('\n'));
					else data+= '\n'
				}//
			})
		})
	// If no file paths are specified, no need for an error
	} else func(buildOutputs, []); 
}

// Calls 'objectifyOne' correctly for each person. 'func' should be 'buildOutputs'
function objectifyAll(func, dataArr) {

	// Order of attributes for each format (used for parsing data)
	var commaArr = ['last', 'first', 'sex', 'color', 'DOB'];
	var pipeArr = ['last', 'first', 'midIn', 'sex', 'color', 'DOB'];
	var spaceArr = ['last', 'first', 'midIn', 'sex', 'DOB', 'color'];

	if (dataArr && dataArr.length) {
		var peopleObjArr = dataArr.map(function(person) {

			// Comma case
			if ( person.match(/, /g) ) {
				return objectifyOne(person.split(', '), commaArr);
			} 

			// Pipe case
			else if ( person.match(/ \| /g) ) {
				return objectifyOne(person.split(' \| '), pipeArr);
			} 

			// Space case
			return objectifyOne(person.split(' '), spaceArr);
		});

		func(layOut, peopleObjArr);
	} else func(layOut, []);
}

// Converts person data from array to object
function objectifyOne(personArr, typeArr) {
	var personObj = {};
	for (var i = 0; i < personArr.length; i++) {
		personObj[typeArr[i]] = personArr[i];
	}

	// Normalize format of DOB and sex
	if (personObj.DOB.match('-')) personObj.DOB = personObj.DOB.replace(/-/g, '/');
	if (personObj.sex.match('M')) personObj.sex = 'Male';
	else personObj.sex = 'Female';

	// trueDOB is for ease of sorting by birthdate in 'prettyPrint'
	// I decided to sacrifice space for time by adding this as a property now
	var temp = personObj.DOB.split('/');
	personObj.trueDOB = new Date(temp[2], temp[0], temp[1]);

	return personObj;
}

// Puts together each of the 3 outputs. 'func' should be 'layOut'
function buildOutputs(func, peopleObjArr) {

	// BUILD OUTPUT1
	if (peopleObjArr && peopleObjArr.length) {
		// BUILD OUTPUT 1
		// Split by sex
		var ladies = [];
		var gents = [];
		peopleObjArr.forEach(function(personObj) {
			if (personObj.sex === 'Female') ladies.push(personObj);
			else gents.push(personObj);
		})

		// Sort by last name alphabetically 
		ladies.sort(outputOneSort);
		gents.sort(outputOneSort);
		var output1 = ladies.concat(gents);

		// BUILD OUTPUT 2
		// Sort by DOB, then by last name ascending
		var output2 = peopleObjArr.slice();
		output2.sort(function(a, b) {
			if (a.trueDOB > b.trueDOB) return 1;
			if (a.trueDOB < b.trueDOB) return -1;
			if (a.last < b.last) return -1;
			if (a.last > b.last) return 1;
			return 0;
		})

		// BUILD OUTPUT 3
		// Sort by last name descending
		var output3 = peopleObjArr.slice();
		output3.sort(function(a, b) {
			if (a.last > b.last) return -1;
			if (a.last < b.last) return 1;
			return 0;
		})

		func(writeOutputFile, [output1, output2, output3]);
	} else func( writeOutputFile, [] );
}

// Sorts by last name alphabetically
function outputOneSort(a, b) {
	if (a.last > b.last) return 1;
	if (a.last < b.last) return -1;
	return 0;
}

// Lays out the 3 sorted versions of the data in one nice string. 'func' should be 'writeOutputFile'
function layOut(func, outputArr) {
	var finalOutput = "";

	if (outputArr) {
		for (var i = 0; i < outputArr.length; i++) {
			finalOutput += 'Output ' + Number(i+1) + ':\n'
			for (var j = 0; j < outputArr[i].length; j++) {
				finalOutput += outputArr[i][j].last + ' '
				+ outputArr[i][j].first + ' '
				+ outputArr[i][j].sex + ' '
				+ outputArr[i][j].DOB + ' '
				+ outputArr[i][j].color + '\n';
			}
			finalOutput += '\n';
		}
	} 

	func('output.txt', finalOutput);
}

// Writes the output of 'layout' to a file
function writeOutputFile(fileName, finalOutput) {
	fs.writeFile(fileName, finalOutput, function(err) {
		if (err) throw err;
	})
}


module.exports = {
	getData: getData,
	objectifyAll: objectifyAll,
	buildOutputs: buildOutputs,
	layOut: layOut,
	writeOutputFile: writeOutputFile
}





