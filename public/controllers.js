var myApp = angular.module("FlightListApp",[]);

myApp.factory('Data', function () {
	var data = {
		key : ''
	};
	return{
		getKey: function(){
			return data.key;
		},
		setKey: function(key){
			data.key = key;
		}
	};
});

myApp.controller('URLCtrl', ['$scope','Data','$rootScope', function($scope,Data,$rootScope){
	$scope.changeURL=function(){
		Data.setKey($scope.key);
		$rootScope.$broadcast('changeData');
	}
}]);




myApp.controller('AppCtrl',['$scope','$http', 'Data',function($scope,$http,Data){
	console.log("Controller initialized");
  $scope.editing = false;
	var apikey="";

	$scope.$on('changeData'), function(event){
		apikey = "?apikey=" + Data.getKey();
		refresh();
	};

	var refresh = function (){
		$http.get('/flights' + apikey).success(function (flights){
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
			$http.post('/flights' + apikey,$scope.flight);
			refresh();
		}else{
			console.log("Campos vacíos");
		}
	}

	$scope.deleteFlight = function(number){
		console.log("Deleting flight with "+number);
		$http.delete('/flights/'+number + apikey);
		refresh();
	}

	$scope.editFlight = function(number){
		$scope.editing = true;
		console.log("Editing flight with "+number);
		var f = '/flights/'+ number + apikey;
		$http.get(f).success(function (flight){
			console.log('Data received successfully');
			$scope.flight = flight;
		});
		refresh();
	}

	$scope.updateFlight = function(number){
		if (validate()) {
			$scope.editing = false;
			var f = '/flights/'+ number + apikey;
			$http.put(f,$scope.flight);
			refresh();
		}else{
			console.log("Campos vacíos");
		}
	}

}]);
