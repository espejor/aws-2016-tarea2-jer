var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var DataStore = require('nedb');


var governify = require('governify');


var port = (process.env.PORT || 9000);

var app = express();

governify.control(app,{namespace:'jer',apiKeyVariable:"multiPlan_C2_jer_ag"});

var dbFileName  = path.join(__dirname,'flights.json');
var db = new DataStore({
		filename : dbFileName,
		autoload: true
	});

console.log('DB initialized');

db.find({},function (err,flights){

	if(flights.length == 0){
		console.log('Empty DB, loading initial data');

		flight1 = {
			number : 'AE456',
			origin : 'Madrid',
			destination: 'París'
		};

		flight2 = {
			number : 'IB345',
			origin : 'Sevilla',
			destination: 'Londres'
		};

		db.insert([flight1, flight2]);

	}else{
		console.log('DB has '+flights.length+' flights ');
	}

});

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());

app.get('/flights',function(req,res){
	console.log('New GET request');

	db.find({},function (err,flights){
		res.json(flights);
	});
});

app.post('/flights',function(req,res){
	console.log('New POST request');
	console.log(req.body);
	db.insert(req.body);
	res.sendStatus(200);
});

app.put('/flights/:number',function(req,res){
	num = req.params.number;
	db.update({number : num},req.body,{},function(err,result){
		console.log('New UPDATE request for flight with number '+ num);
			if(result == 1){
				res.sendStatus(200);
			}else{
				res.sendStatus(404);
			}
	});
});

app.get('/flights/:number',function(req,res){
	var n = req.params.number;
	console.log('New GET request for flight with number '+n);

	db.find({ number : n},function (err,flights){
		console.log("Flights obtained: "+flights.length);
		if(flights.length  > 0){
			res.send(flights[0]);
		}else{
			res.sendStatus(404);
		}
	});
});



app.delete('/flights/:number',function(req,res){
	var n = req.params.number;
	console.log('New DELETE request for flight with number '+n);

	db.remove({ number: n},{}, function(err,numRemoved){
		console.log("Flights removed: "+numRemoved);
		if(numRemoved  == 1)
			res.sendStatus(200);
		else
			res.sendStatus(404);
	});
});


app.listen(port);
console.log('Magic is happening on port '+port);
