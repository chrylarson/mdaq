'use strict';

angular.module('yoApp')
  .controller('MainCtrl', function ($rootScope, $scope, $http, $localStorage, $sessionStorage, Cordova) {

  	$scope.$storage = $localStorage;

    console.log("Start main");
    Cordova.ready.then(function() {
    	console.log("Cordova Ready")
	    //cordova ready
	    navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);
	});

    // onSuccess: Get a snapshot of the current acceleration
    //
    function onSuccess(acceleration) {
        alert('Acceleration X: ' + acceleration.x + '\n' +
              'Acceleration Y: ' + acceleration.y + '\n' +
              'Acceleration Z: ' + acceleration.z + '\n' +
              'Timestamp: '      + acceleration.timestamp + '\n');
    }

    // onError: Failed to get the acceleration
    //
    function onError() {
        alert('onError!');
    }

    //force external website links to open in browser
    $scope.openWebsite = function(url) {
    	window.open(url, "_system");
    }

  });