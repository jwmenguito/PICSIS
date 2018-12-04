var homeModule = angular.module('homeModule',['ui.router','ui.bootstrap','ngCookies']);
    
	homeModule.factory('dataHolder',['$cookies',function dataFactory($cookies){
		var user = $cookies.get('user');
		//var user_object = JSON.parse(user.slice(2));
		return function(){
			return user;

		}
	}]);
	
	homeModule.factory('getUserType',["$cookies",function userTypeFactory($cookies){
		var token_json = $cookies.get('token');
		var token =  JSON.parse(user.slice(2));
		
		this.value("user_type",token.type);
		console.log(token.type);
		
	}])

	homeModule.config(["$locationProvider",function($locationProvider){
		$locationProvider.html5Mode(true);
	}]);

	homeModule.controller("StudentCtrl",["$scope","$state",
	function($scope,$state){
		
		$scope.states = [{
			name:'Home',
			state_name:'student.home',
			state_url:'/student/home'
		},{
			name:'Grades',
			state_name:'student.grades',
			state_url:'/student/grades'
			
		},{
			name:'Fees',
			state_name:'student.fees',
			state_url:'/student/fees',
			
		},{
			name:'Requests',
			state_name:'student.requests',
			state_url:'/student/requests'
		},{
			name:'Account Settings',
			state_name:'student.settings',
			state_url:'/student/settings'
		},{
			name:'Log out',
			state_name:'log_out',
			state_url:'/'
		}];	
	}]);
	
	
		homeModule.controller("FacultyCtrl",["$scope","$http",
	function($scope,$http){
	
		$scope.states = [{
			name:'Home',
			state_name:'faculty.home2',
			state_url:'/faculty/home',
			
		},{
			name:'Classes',
			state_name:'faculty.classes',
			state_url:'/faculty/classes'
		},{
			name:'Account Settings',
			state_name:'faculty.settings2',
			state_url:'/faculty/settings'
		},{
			name:'Log out',
			state_name:'log_out',
			state_url:'/'
		}];	
	}]);
	
	homeModule.controller("AdminController",["$scope","$http",
	function($scope,$http){
		console.log("ADMIN");
		$scope.states = [{
			name:'Home',
			state_name:'admin.home3',
			state_url:'/admin/home'
		},{
			name:'Records',
			state_name:'admin.records',
			state_url:'/admin/records',
			
		},{
			name:'Listing',
			state_name:'admin.listing',
			state_url:'/admin/listing',
			
		},{
			name:'Term Controls',
			state_name:'admin.term',
			state_url:'/admin/term',
			
		},{
			name:'Log out',
			state_name:'log_out',
			state_url:'/'
		}];	
		
	}]);
	
	
	
	
	homeModule.controller('LogOutCtrl',["$scope","$cookies","$http",
	function($scope,$cookies,$http){
		//when logging out, destroy cookies
		//return home
		$cookies.remove("token");
		$cookies.remove("user");
		$cookies.remove("classes");
		
		window.location.assign('https://picsis.herokuapp.com/');
		
	}]);
	homeModule.controller("StudentHomeCtrl",["$scope","$http","dataHolder",
	function($scope,$http,dataHolder){
		var data1 = {
				student_no:dataHolder()
		};
		$http
		.post('https://picsis.herokuapp.com/student/home',data1)
		.then(
			function(response){	
				$scope.user_object = response.data;
				console.log($scope.user_object);
		}).catch(angular.noop);
		
		
		
	}]);
	
	homeModule.controller("StudentRequestCtrl",["$scope","$http","dataHolder",
	function($scope,$http,dataHolder){
	
		$scope.send_email = function(){
			var data= {
				student_no:dataHolder().student_no
			}
			$http
			.post("https://picsis.herokuapp.com/student/requests/send/",data)
			.then(
				function(response){
					alert(response.data.message);
				}
				
			);
		}
		
		
	}]);
	
	homeModule.controller("StudentSettingsCtrl",["$scope","$http","dataHolder",
	function($scope,$http,dataHolder){
		
		$scope.change_password = function(){
			if($scope.newPassword == $scope.newPasswordVerification){
				var data = {
					oldPassword : $scope.oldPassword,
					newPassword : $scope.newPassword,
					student_no :dataHolder().student_no
				}
				
				$http
				.post("https://picsis.herokuapp.com/student/settings/",data)
				.then(
					function(response){
						alert(response.data.message);
					}
				);
			}else if($scope.newPassword == null || $scope.oldPassword == null || $scope.newPasswordVerification == null){
				alert("Fill out empty fields");
				console.log("Null fields");
			
			}
			else{
				alert("Passwords do not match!");
				console.log("Passwords do not match");
			}
		}
		
		
		
	}]);
	
	

	
	
	
	homeModule.controller("FacultyHomeCtrl",["$scope","dataHolder","$http",
	function($scope,dataHolder,$http){
		var data1 = {
			prof_id:dataHolder()
		};
		$http
		.post('https://picsis.herokuapp.com/faculty/home',data1)
		.then(
			function(response){	
				$scope.user_object = response.data;
				console.log($scope.user_object);
		}).catch(angular.noop);
		
		
		
	}]);


	homeModule.controller("FacultyClassesCtrl",["$scope","dataHolder","$http",
	function($scope,dataHolder,$http){
		
		$scope.retrieveClasses = function(){
			$http
            .get('https://picsis.herokuapp.com/faculty/classes/get/'+dataHolder())				//gets classes by profId
			.then(
			function(response){
				console.log(response.data);
				$scope.classes = response.data;
				for(var i=0;i<$scope.classes.length;i++){
					var currSubjectCode = $scope.classes[i].subject_code;
					
					for(var j=0;j<$scope.classes[i].students.length;j++){
						
						for(var k=0;k<$scope.classes[i].students[j].checklist.length;k++){							//gets the student's grade for the current subjectCode ( for loop i )
							if($scope.classes[i].students[j].checklist[k].subject_code == currSubjectCode){
								$scope.classes[i].students[j].grade = $scope.classes[i].students[j].checklist[k].grade;
							}
						}
						
					}
					
				}
			});
		}
		$scope.retrieveClasses();
		
		//Send Reminders
		$scope.send_reminders = function(index) {
			
			$('#myModal').on('shown.bs.modal', function () {
				$('#myInput').trigger('focus')
}			)
			
			
			var data = {
				subject_code:$scope.classes[index].subject_code,
				msg:$scope.msg
			}
			console.log(data);
			$http
			.post('https://picsis.herokuapp.com/faculty/reminders',data)
			.then(function(response){
				alert(response.data.message);
			});
		
			
		} 
		
		$scope.checkIndex = function (index1,index2){
			alert(index1+":"+index2);
		}
		$scope.gradeArray = [];
		
		//UPDATES THE SELECTED GRADE
		$scope.store_index = function(subjectIndex,studentIndex){
			$scope.student_index = studentIndex;
			$scope.subject_index = subjectIndex;

			
			//gets the selected student
			var data2 = {
				student_no:$scope.classes[$scope.subject_index].students[$scope.student_index].student_no,
				subject_code:$scope.classes[$scope.subject_index].subject_code,
				grade:$scope.gradeArray[$scope.student_index]
			} 				
				console.log(data2);
				$http
				.post('https://picsis.herokuapp.com/faculty/classes/grade',data2)
				.then(function(response){
					$scope.gradeArray[$scope.student_index] = response.data.grade;
					alert(response.data.message);
				});
			$scope.gradeArray[$scope.student_index] = "";
		}
		
		//Grade Function
		$scope.grade = function(){
	
		}
		
		$scope.tableRowExpanded = false;
		$scope.tableRowIndexExpandedCurr = "";
		$scope.tableRowIndexExpandedPrev = "";
		$scope.storeIdExpanded = "";
		
		$scope.dayDataCollapseFn = function () {
			$scope.dayDataCollapse = [];
			for (var i = 0; i < $scope.classes.length; i += 1) {
				$scope.dayDataCollapse.push(false);
			}
		};
		
		   
		$scope.selectTableRow = function (index, storeId) {
			if (typeof $scope.dayDataCollapse === 'undefined') {
				$scope.dayDataCollapseFn();
			}
			
			if ($scope.tableRowExpanded === false && $scope.tableRowIndexExpandedCurr === "" && $scope.storeIdExpanded === "") {
				$scope.tableRowIndexExpandedPrev = "";
				$scope.tableRowExpanded = true;
				$scope.tableRowIndexExpandedCurr = index;
				$scope.storeIdExpanded = storeId;
				$scope.dayDataCollapse[index] = true;
			} else if ($scope.tableRowExpanded === true) {	
				//IF THE SELECTED ROW IS THE CURRENT ROW, CLOSE IT
				if ($scope.tableRowIndexExpandedCurr === index && $scope.storeIdExpanded === storeId) {
					$scope.tableRowExpanded = false;
					$scope.tableRowIndexExpandedCurr = "";
					$scope.storeIdExpanded = "";
					$scope.dayDataCollapse[index] = false;
					
				} else {	//ELSE, OPEN THE NEW ROW AND CLOSE THE PREVIOUS
					$scope.tableRowIndexExpandedPrev = $scope.tableRowIndexExpandedCurr;
					$scope.tableRowIndexExpandedCurr = index;
					$scope.storeIdExpanded = storeId;
					$scope.dayDataCollapse[$scope.tableRowIndexExpandedPrev] = false;
					$scope.dayDataCollapse[$scope.tableRowIndexExpandedCurr] = true;
				}
			}

		};

	}]);
	
	

	
	homeModule.controller("FacultySettingsCtrl",["$scope","$http","dataHolder",
	function($scope,$http,dataHolder){
		
		$scope.change_password = function(){
			if($scope.newPassword == $scope.newPasswordVerification){
				var data = {
					oldPassword : $scope.oldPassword,
					newPassword : $scope.newPassword,
					prof_id : dataHolder().prof_id
				}
				
				$http
				.post("https://picsis.herokuapp.com/faculty/settings/",data)
				.then(
					function(response){
						alert(response.data.message);
					}
				);
			}else if($scope.newPassword == null || $scope.oldPassword == null || $scope.newPasswordVerification == null){
				alert("Fill out empty fields");
				console.log("Null fields");
			
			}else{
				alert("Passwords do not match!");
				console.log("Passwords do not match");
			}
		}
		
		
		
	}]);
	
	homeModule.controller("AdminHomeCtrl",["$scope","dataHolder","$http",
	function($scope,dataHolder,$http){
		var user = {};

		$scope.get_deets = function(){
			//Extract user object from the cookie
			$scope.user_object = dataHolder();
		}
		$scope.get_deets();
		
	}]);
	homeModule.controller("AddStudentCtrl",["$scope","$http",
	function($scope,$http){
		
		//when adding a student, intialize his first term
		$scope.add = function(){
			var data = {
				student_no:$scope.student_no,
				lname:$scope.lname,
				fname:$scope.fname,
				mname:$scope.mname,
				course:$scope.course,
				major_degree:$scope.major_degree,
				email:$scope.email,
				mobile:$scope.mobile,
				status:"ENROLLED",
				term:1
			}
			$http
			.post("/admin/records/add/student",data)
			.then(function(response){
				$scope.student_no = null;
				$scope.lname=null;
				$scope.fname=null;
				$scope.mname=null;
				$scope.course=null;
				$scope.major_degree=null;
				$scope.email=null;
				$scope.mobile=null;
				
			})
			.catch(angular.noop);
		}
	}]);
	
	homeModule.controller("AddSubjectCtrl",["$scope","$http",
	function($scope,$http){
		$scope.add = function(){
			var data = {
				subject_code:$scope.subject_code,
				subj_desc:$scope.subj_desc,
				units:$scope.units,
				prof_id:$scope.prof_id,
				major_degree:$scope.major_degree
			}

			$http
			.post("/admin/records/add/subject",data)
			.then(function(response){
				$scope.subject_code = null;
				$scope.subj_desc = null;
				$scope.units = null;
				$scope.prof_id = null;
				$scope.major_degree = null;
			})
			.catch(angular.noop);
		}
	}]);
	
	homeModule.controller("AddFacultyCtrl",["$scope","$http",
	function($scope,$http){
		
	
		$scope.add = function(){
			var data = {
				prof_id:$scope.prof_id,
				lname:$scope.lname,
				fname:$scope.fname,
				mname:$scope.mname,
				degree:$scope.degree,
				major:$scope.major,
				email:$scope.email,
				mobile:$scope.mobile
			}
			
			console.log(data);
			$http
			.post("/admin/records/add/faculty",data)
			.then(function(response){
				$scope.prof_id = null;
				$scope.lname=null;
				$scope.fname=null;
				$scope.mname=null;
				$scope.degree=null;
				$scope.major=null;
				$scope.email=null;
				$scope.mobile=null;
			})
			.catch(angular.noop);
		}
	}]);
	
	
	homeModule.controller("EditStudentCtrl",["$scope","$http","$stateParams",
	function($scope,$http,$stateParams){
		var data = {
			student_no:$stateParams.obj.student_no,
			selected_field:$scope.fieldEdit,
			value: $scope.entered_data
		}
		console.log(data);
		
		$scope.editTheField = function(){
			
			
			$http
			.post('admin/records/edit/student',data)
			.then(function(response){
				$scope.entered_data = null;
				alert(response.data.message);
			});
			
		}
		
	
	}]);
	
	homeModule.controller("EditSubjectCtrl",["$scope","$http","$stateParams",
	function($scope,$http,$stateParams){
		var data = {
			subject_code:$stateParams.obj.subject_code,
			selected_field:$scope.fieldEdit,
			value: $scope.entered_data
		}
		console.log(data);
		
		$scope.editTheField = function(){
			
			
			$http
			.post('admin/records/edit/subject',data)
			.then(function(response){
				$scope.entered_data = null;
				alert(response.data.message);
			});
			
		}
	
	
	}]);
	
	homeModule.controller("AdminListing",["$scope","$http","$stateParams",
	    function($scope,$http,$stateParams){
            $scope.load = function(){
                var data = {
	                term:$scope.term,
	                student_no:$scope.student_no,
	                course:$scope.course,
	                major_degree:$scope.major_degree,
	                subject_code:$scope.subject_code
	            }
	            console.log(data);
                return data; 
                
            }	    
	        
	       
	       $scope.add = function(){
	            var data = $scope.load();
	            $http
	            .post('admin/listing/add',data)
	            .then(function(response){
	                $scope.empty(response.data.message);
	            
	            });
	       
	       }
	       
	       $scope.remove = function(){
	            var data = $scope.load();
	            $http
	            .post('admin/listing/remove',data)
	            .then(function(response){
	                 $scope.empty(response.data.message);
	            });
	           
	       }
	       
	       //ADD LISTING FOR ALL SUBJECTS OF A STUDENT
	       $scope.addAll = function(){
	            var data = $scope.load();
	            $http
	            .post('admin/listing/add/all',data)
	            .then(function(response){
	                 $scope.empty(response.data.message);
	            });
	            
	       
	       }
	       
	       //remove a student from ALL subjects
	       $scope.removeAll = function(){
	            var data = $scope.load();
	            $http
	            .post('admin/listing/remove/all',data)
	            .then(function(response){
	                 $scope.empty(response.data.message);
	            });
	       
	       } 

	       $scope.empty = function(msg){
	             $scope.term = "";
	             $scope.course = "";
	             $scope.major_degree ="";
	             alert(msg);
	       
	       } 
	
	}]);
	
	
	homeModule.controller("EditFacultyCtrl",["$scope","$http","$stateParams",
	function($scope,$http,$stateParams){
		var data = {
			prof_id:$stateParams.obj.prof_id,
			selected_field:$scope.fieldEdit,
			value: $scope.entered_data
		}
		$scope.editTheField = function(){
			
			$http
			.post('admin/records/edit/faculty',data)
			.then(function(response){
				$scope.inputField = null;
				alert(response.data.message);
			});
			
		}
	
	
	}]);
	
	//TERM CONTROLS
    homeModule.controller("AdminTerm",["$scope","$http","$stateParams",
	function($scope,$http,$stateParams){
           

            
            $scope.empty = function(msg){
                $scope.password="";
                alert(msg);
            
            }				       
	       //remove listing for all students
	       //should be used end of sem
	       $scope.clear = function(){
	       
	       
	       var warning = confirm("Are you sure you want to CLEAR the LISTING database?");
				if(warning == true){
					var data = {}
                    $http
                    .post('admin/listing/clear',data)
                    .then(function(response){
                        $scope.empty(response.data.message);
                    
                    });
			
					
				}else if(warning == false){
					
				}
	            
	       
	       }
	       
	       //add listing for all enrolled student
	       $scope.enroll = function(){
	            var warning = confirm("Are you sure you want to ADD LISTING to ALL ENROLLED students?");
				
				if(warning == true){
					var data = {}
                     
	                $http
	                .post('admin/listing/enroll',data)
	                .then(function(response){
	                    $scope.empty(response.data.message);
	                });
			
					
				}else if(warning == false){
					
				}
	       }
	
	
	}]);
	
	
	homeModule.controller("AdminRecordsCtrl",["$scope","$http","dataHolder","$state",
	function($scope,$http,dataHolder,$state){
	
			
				$scope.students=[];
				$scope.faculties=[];
				$scope.subjects=[];
			
			$scope.edit = function(index){
				
				if($scope.display_table==='subject'){
					var myData = {
						subject_code:$scope.subjects[index].subject_code
					}
					$state.go('admin.records.editSubject',{obj:myData});
				}else if($scope.display_table==='faculty'){
					var myData = {
						prof_id:$scope.faculties[index].prof_id
					}
					$state.go('admin.records.editFaculty',{obj:myData});
				}else if($scope.display_table==='student'){
					var myData = {
						student_no:$scope.students[index].student_no
					}
					$state.go('admin.records.editStudent',{obj:myData});
				}else{
					$state.go('admin.records');
				}
			}
			
			$scope.archive = function(){
				var warning = confirm("Are you sure you want to create a copy of this database?");
				if(warning == true){
					var data ={
						collection:$scope.display_table
					}
					$http
					.post('https://picsis.herokuapp.com/admin/records/archive/',data)
					.then(function(response){
						alert(response.data.message);
					}).catch(angular.noop);
			
					
				}else if(warning == false){
					
				}
			}
			
			$scope.getTable = function(){
				var data ={
					table : $scope.display_table
				}
				$http
				.post('https://picsis.herokuapp.com/admin/records',data)
				.then(function(response){
						console.log(response.data);
						if($scope.display_table==='subject'){
							$scope.subjects = response.data;
						}else if($scope.display_table==='faculty'){
							$scope.faculties = response.data;
						}else if($scope.display_table==='student'){
							$scope.students = response.data;
							console.log($scope.students);
						}
				}).catch(angular.noop);
		
			}
			$scope.addEntry = function(){
				if($scope.display_table==='subject'){
					console.log("pressed");
					$state.go('admin.records.addSubject',{});
				}else if($scope.display_table==='faculty'){
					console.log("pressed");
					$state.go('admin.records.addFaculty',{});
				}else if($scope.display_table==='student'){
					console.log("pressed");
					$state.go('admin.records.addStudent',{});
				}else{
					console.log("pressed");
					$state.go('admin.records');
				}
				
			}
			/**TABLE CONTROLS**/
			$scope.tableRowExpanded = false;
			$scope.tableRowIndexExpandedCurr = "";
			$scope.tableRowIndexExpandedPrev = "";
			$scope.studentIdExpanded = "";
			
			$scope.studentCollapseFn = function (index1) {
				$scope.studentCollapse = [];
				for (var i = 0; i < $scope.students[index1].checklist.length; i += 1) {
					$scope.studentCollapse.push(false);
				}
			};
				/**MAIN TABLE LOGIC **/
			$scope.selectTableRow = function(index,student_no){
				if (typeof $scope.studentCollapse === 'undefined') {
					$scope.studentCollapseFn(index);
				}
				
				if ($scope.tableRowExpanded === false && $scope.tableRowIndexExpandedCurr === "" && $scope.studentIdExpanded === "") {
					$scope.tableRowIndexExpandedPrev = "";
					$scope.tableRowExpanded = true;
					$scope.tableRowIndexExpandedCurr = index;
					$scope.studentIdExpanded = student_no;
					$scope.studentCollapse[index] = true;
				} else if ($scope.tableRowExpanded === true) {	
					//IF THE SELECTED ROW IS THE CURRENT ROW, CLOSE IT
					if ($scope.tableRowIndexExpandedCurr === index && $scope.studentIdExpanded === student_no) {
						$scope.tableRowExpanded = false;
						$scope.tableRowIndexExpandedCurr = "";
						$scope.studentIdExpanded = "";
						$scope.studentCollapse[index] = false;
						
					} else {	//ELSE, OPEN THE NEW ROW AND CLOSE THE PREVIOUS
						$scope.tableRowIndexExpandedPrev = $scope.tableRowIndexExpandedCurr;
						$scope.tableRowIndexExpandedCurr = index;
						$scope.studentIdExpanded = student_no;
						$scope.studentCollapse[$scope.tableRowIndexExpandedPrev] = false;
						$scope.studentCollapse[$scope.tableRowIndexExpandedCurr] = true;
					}
				}

			}
			/**END OF TABLE CONTROLS**/
		}
	]);
	
	homeModule.config(function($stateProvider,$urlRouterProvider,$urlMatcherFactoryProvider){
	
		$urlRouterProvider.when('/student', '/student/home');
		$urlRouterProvider.when('/faculty', '/faculty/home');
		$urlRouterProvider.when('/admin', '/admin/home');
		$urlMatcherFactoryProvider.strictMode(false);
			
		$stateProvider
		.state('log_out',{
			url:'/',
			controller:'LogOutCtrl'
			
		})
		.state('student',{
			url:'/student',
			abstract:true,
			templateUrl:'../views/menu-view.html',
			controller:'StudentCtrl'
		})
		.state('student.home',{
			url:'/home',
			templateUrl:'../views/student_home_view.html',
			controller:'StudentHomeCtrl'
			
		})
		.state('student.grades',{
			url:'/grades',
			templateUrl:'../views/student-subjects-view.html',
			controller:'StudentHomeCtrl'
		})
		.state('student.fees',{
			url:'/fees',
			templateUrl:'../views/student-fees-view.html',
			controller:'StudentHomeCtrl'
		})
		.state('student.requests',{
			url:'/requests',
			templateUrl:'../views/student-email-view.html',
			controller:'StudentRequestCtrl'
		})
		.state('student.settings',{
			url:'/settings',
			templateUrl:'../views/settings-view.html',
			controller:'StudentSettingsCtrl'
		})
			
		.state('faculty',{
			url:'/faculty',
			abstract:true,
			templateUrl:'../views/menu-view.html',
			controller:'FacultyCtrl'
		})
		.state('faculty.home2',{
			url:'/home',
			templateUrl:'../views/faculty-home-view.html',
			controller:'FacultyHomeCtrl'
		})
		.state('faculty.classes',{
			url:'/classes',
			templateUrl:'../views/faculty-classes-view-2.html',
			controller:'FacultyClassesCtrl'
		})
		.state('faculty.reminders',{
			url:'/reminders',
			template:'<p>Faculty Reminders</p>'
		})
		.state('faculty.settings2',{
			url:'/settings',
			templateUrl:'../views/settings-view.html',
			controller:'FacultySettingsCtrl'
		})
		
		.state('admin',{
			url:'/admin',
			abstract:'true',
			templateUrl:'../views/menu-view.html',
			controller:'AdminController'
		})
		.state('admin.home3',{
			url:'/home',
			template:'<h2>Home</h2>',
			controller:'AdminHomeCtrl'
		})
        .state('admin.listing',{
			url:'/listing',
			templateUrl:'../views/admin_listing.html',
			controller:'AdminListing'
		})
		.state('admin.term',{
			url:'/term',
			templateUrl:'../views/admin-term.html',
			controller:'AdminTerm'
		})
		.state('admin.records',{
			url:'/records',
			templateUrl:'../views/admin-records-view.html',
			controller:'AdminRecordsCtrl',
			controllerAs:'adminModal'
		})
		.state('admin.records.addSubject',{
			url:'/add/subject',
			templateUrl:'../views/add-subject-modal-view.html',
			controller:'AddSubjectCtrl'
		})
		.state('admin.records.addStudent',{
			url:'/add/student',
			templateUrl:'../views/add-student-modal-view.html',
			controller:'AddStudentCtrl'
		})
		.state('admin.records.addFaculty',{
			url:'/add/faculty',
			templateUrl:'../views/add-faculty-modal-view.html',
			controller:'AddFacultyCtrl'
		})
		.state('admin.records.editStudent',{
			url:'/edit/student',
			templateUrl:'../views/edit-student-view.html',
			controller:'EditStudentCtrl',
			params:{
				obj:null
			}
		})
		.state('admin.records.editSubject',{
			url:'/edit/faculty',
			templateUrl:'../views/edit-subject-view.html',
			controller:'EditSubjectCtrl',
			params:{
				obj:null
			}
		})
		.state('admin.records.editFaculty',{
			url:'/edit/faculty',
			templateUrl:'../views/edit-faculty-view.html',
			controller:'EditFacultyCtrl',
			params:{
				obj:null
			}
		});
		
	});

	
