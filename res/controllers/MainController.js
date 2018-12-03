var myApp = angular.module('myApp', ['ngRoute','ngCookies']);
		/*
		myApp.config(['$locationProvider','$routeProvider',
		function($locationProvider,$routeProvider){
		$locationProvider.html5mode(true);
		]});
		*/
	myApp.factory('dataHolder',['$cookies',function dataFactory($cookies){
		var token = $cookies.get('token');
		//var user_object = JSON.parse(user.slice(2));
		return function(){
			return user;
		}
	}]);
	
	myApp.controller("AnnouncementsCtrl",['$scope','$http',
    function($scope,$http){
      //get Announcements
		$scope.announcement = {
			title:"",
			body:""
		};
        $scope.get_announcements = function(){
          //alert("Start");
		  $http
          .get('https://picsis.herokuapp.com/announcements')
          .then(
			function(response){
				$scope.announcement = response.data;
            });
        }
		
		$scope.get_announcements();
    }]);

	
	myApp.controller("LogInCtrl",['$scope','$http','$location','dataHolder',
		function($scope,$http,dataHolder){
		//initialize a user
			$scope.user={
				email:"",
				password:""
			}
		//authorization function
		$scope.authorize=function(){
		//flag codes
//alert("Email: "+ $scope.user.email + " Password " + $scope.user.password);
			
			var data = JSON.stringify($scope.user);
			
			//http post to /api/authenticate send email + password combination
			$http
			.post("/api/authenticate",data)
			.then(function(response){
				if(response.data.message=="/"){
					alert("Incorrect Email or Password.");
					
				}
					console.log(response.data.message);
					window.location.assign('https://picsis.herokuapp.com'+response.data.message)
				
			})
			.catch(angular.noop);
		
		}
		
		}]);
		