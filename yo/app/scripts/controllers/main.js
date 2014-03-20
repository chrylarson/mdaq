'use strict';

angular.module('yoApp')
  .controller('MainCtrl', function ($rootScope, $scope, $http, $localStorage, $sessionStorage, $interval, CordovaService) {

  	$scope.$storage = $localStorage;
    $scope.$storage.channels = [];

    $scope.accX = 0;
    $scope.accY = 0;
    $scope.accZ = 0;
    $scope.accTimestamp = 0;

    console.log("Start main");
    CordovaService.ready.then(function() {
    	console.log("Cordova Ready")
	    //cordova ready
      //console.log(navigator);
      //navigator.accelerometer.getCurrentAcceleration(accelerometerSuccess, accelerometerError);
      var intervalId = $interval(function () {
        navigator.accelerometer.getCurrentAcceleration(accelerometerSuccess, accelerometerError);
      }, 2000);
    });


var intervalId = $interval(function () {
  var channelData = [];
  var deviceId = '';
  var currenTime = new Date().getTime();
        $scope.$storage.channels.forEach(function (d, index) {
          console.log(d.channelId);
          if (d.channelId !== 0) {
              channelData.push({"t0":currenTime,"channelId":d.channelId,"dt":[0],"values":[2]});
              deviceId =d.deviceId;
          } 
          if(channelData.length>1){
            writeChannel(deviceId, channelData);
          }
          
        });

      }, 2000);

    // onSuccess: Get a snapshot of the current acceleration
    //
    function accelerometerSuccess(acceleration) {
      var channelData = [];
      console.log(acceleration);
      $scope.accX = acceleration.x;
      $scope.accY = acceleration.y;
      $scope.accZ = acceleration.z;
      $scope.accTimestamp = acceleration.timestamp;
      $scope.$apply();

      $scope.$storage.channels.forEach(function (d, index) {
          if (d.channelName === "Accelerometer X") {
              channelData.push({"t0":acceleration.timestamp,"channelId":d.channelId,"dt":[0],"values":[acceleration.x]});
          } else if (d.channelName === "Accelerometer Y") {
              channelData.push({"t0":acceleration.timestamp,"channelId":d.channelId,"dt":[0],"values":[acceleration.y]});
          } else if (d.channelName === "Accelerometer Z") {
              channelData.push({"t0":acceleration.timestamp,"channelId":d.channelId,"dt":[0],"values":[acceleration.z]});
          }
          writeChannel($scope.$storage.device.deviceId, channelData);
      });

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

    $scope.createDevice = function (deviceName) {
      var createUrl = $rootScope.url + '/devices/register';
        $http({
            url: createUrl,
            method: "POST",
            timeout: 10000,
            data: {  
              "deviceType": "MobilePhone",  
              "deviceName": deviceName,  
              "serialNumber": deviceName     
            },
            headers: {'Content-Type': 'application/json', 'x-ni-apikey':'MGCTApKKBaInxrBIsSGYeHAWALYcnnLM'}
        }).success(function (result) {
          $scope.$storage.device = result;
          createChannel(deviceName, "Accelerometer X");
        }).error(function (response, status) {
          if(response === "Device already registered.") {
            $scope.$storage.device = response;
            createChannel(deviceName, "Accelerometer X", 0);
            createChannel(deviceName, "Accelerometer Y", 1);
            createChannel(deviceName, "Accelerometer Z", 2);
          }
          console.log("error registering phone");
        });   
    };

    function createChannel (deviceId, channelName, channelId) {

      var exists = false;
      $scope.$storage.channels.forEach(function (d, index) {
          if (d.channelName === channelName) {
              exists = true;
          }
      });

      if(exists === false) {
      var createUrl = $rootScope.url + '/devices/' + deviceId + '/channels/';
      var currenTime = new Date().getTime();
        $http({
            url: createUrl,
            method: "POST",
            timeout: 10000,
            data: {
              "deviceId": deviceId,
              "userDefinedChannelId": channelId, 
              "t0": currenTime,  
              "channelType": "AI",  
              "channelName": channelName  
            },
            headers: {'Content-Type': 'application/json', 'x-ni-apikey':'MGCTApKKBaInxrBIsSGYeHAWALYcnnLM'}
        }).success(function (result) {
          console.log(result);
          $scope.$storage.channels.push(result);
        }).error(function (response, status) {
          console.log("error creating channel " + channelName);
        });
      }   
    };

    function writeChannel (deviceId, channelData) {

      var createUrl = $rootScope.url + '/devices/' + deviceId + '/channels/';
        $http({
            url: createUrl,
            method: "PUT",
            timeout: 10000,
            data: channelData,
            headers: {'Content-Type': 'application/json', 'x-ni-apikey':'MGCTApKKBaInxrBIsSGYeHAWALYcnnLM'}
        }).success(function (result) {
          console.log(result);
        }).error(function (response, status) {
          console.log("error posting channel data");
        });
  
    };

  });