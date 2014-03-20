'use strict';

angular.module('yoApp')
  .controller('MainCtrl', function ($rootScope, $scope, $http, $localStorage, $sessionStorage, CordovaService) {

  	$scope.$storage = $localStorage;

    console.log("Start main");
    CordovaService.ready.then(function() {
    	console.log("Cordova Ready")
	    //cordova ready
      console.log(navigator);
      navigator.accelerometer.getCurrentAcceleration(accelerometerSuccess, accelerometerError);
	});

    // onSuccess: Get a snapshot of the current acceleration
    //
    function accelerometerSuccess(acceleration) {
        alert('Acceleration X: ' + acceleration.x + '\n' +
              'Acceleration Y: ' + acceleration.y + '\n' +
              'Acceleration Z: ' + acceleration.z + '\n' +
              'Timestamp: '      + acceleration.timestamp + '\n');
    }

    // onError: Failed to get the acceleration
    //
    function accelerometerError() {
        alert('onError!');
    }

    //force external website links to open in browser
    $scope.openWebsite = function(url) {
    	window.open(url, "_system");
    }

  });