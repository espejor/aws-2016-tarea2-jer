var myApp = angular.module("FlightListApp",[]);



myApp.controller('AppCtrl',['$scope','$http',function($scope,$http){
	console.log("Controller initialized");
  $scope.editing = false;
	$scope.apikey="multiPlan_C2_jer_ag";

	var refresh = function (){
		$http.get('/flights/?apikey=' + $scope.apikey).success(function (flights){
			console.log('Data received successfully');
			$scope.flightlist = flights;
		});
	}


	refresh();

	var validate = function(){
		var n = document.getElementById("n").validity.valid;
		var o = document.getElementById("o").validity.valid;
		var d = document.getElementById("d").validity.valid;
		return (n && o && d);
	}

	$scope.addFlight = function(){
		if (validate()) {
			console.log("Inserting flight ...");
			$http.post('/flights/?apikey=' + $scope.apikey,$scope.flight);
			refresh();
		}else{
			console.log("Campos vacíos");
		}
	}

	$scope.deleteFlight = function(number){
		console.log("Deleting flight with "+number);
		$http.delete('/flights/'+number + '/?apikey=' + $scope.apikey);
		refresh();
	}

	$scope.editFlight = function(number){
		$scope.editing = true;
		console.log("Editing flight with "+number);
		var f = '/flights/'+ number + '/?apikey=' + $scope.apikey;
		$http.get(f).success(function (flight){
			console.log('Data received successfully');
			$scope.flight = flight;
		});
		refresh();
	}

	$scope.updateFlight = function(number){
		if (validate()) {
			$scope.editing = false;
			var f = '/flights/'+ number + '/?apikey=' + $scope.apikey;
			$http.put(f,$scope.flight);
			refresh();
		}else{
			console.log("Campos vacíos");
		}
	}

}]);
