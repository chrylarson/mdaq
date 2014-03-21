'use strict';

angular.module('yoApp')
  .controller('MainCtrl', function ($rootScope, $scope, $http, $localStorage, $sessionStorage, $interval, CordovaService) {

    var demoMode = true;
  	$scope.$storage = $localStorage;
    $scope.$storage.channels = [];

    $scope.accX = 0;
    $scope.accY = 0;
    $scope.accZ = 0;
    $scope.accTimestamp = 0;

    console.log("Start main");
    CordovaService.ready.then(function() {
      //cordova ready
    	console.log("Cordova Ready");
      demoMode = false;
      //navigator.accelerometer.getCurrentAcceleration(accelerometerSuccess, accelerometerError);
      var intervalId = $interval(function () {
        navigator.accelerometer.getCurrentAcceleration(accelerometerSuccess, accelerometerError);
      }, 2000);
    });

if(demoMode = true){
var intervalId = $interval(function () {
  var channelData = [];
  var deviceId = '';
  var currenTime = new Date().getTime();
        $scope.$storage.channels.forEach(function (d, index) {
          console.log(d.id);
          if (d.channelId !== 0) {
              channelData.push({"t0":currenTime,"channelId":d.id,"dt":[0],"values":[2]});
              deviceId =d.deviceId;
          } 
          
          
        });

        if(channelData.length>1){
          console.log("Write Channel Data");
            writeChannel(deviceId, channelData);
          }

      }, 2000);
} else {
  if (angular.isDefined(intervalId)) {
        $interval.cancel(intervalId);
        intervalId = undefined;
      }
}
    // onSuccess: Get a snapshot of the current acceleration
    //
    function accelerometerSuccess(acceleration) {
      var channelData = [];
      var deviceId = '';
      var currenTime = new Date().getTime();
      console.log(acceleration);
      $scope.accX = acceleration.x;
      $scope.accY = acceleration.y;
      $scope.accZ = acceleration.z;
      $scope.accTimestamp = acceleration.timestamp;
      $scope.$apply();

      $scope.$storage.channels.forEach(function (d, index) {
        console.log(d);
        deviceId =d.deviceId;
          if (d.channelName === "Accelerometer X") {
            console.log("channel ID: " + d.id);
              channelData.push({"t0":currenTime,"channelId":d.id,"dt":[0],"values":[acceleration.x]});
          } else if (d.channelName === "Accelerometer Y") {
            console.log("channel ID: " + d.id);
              channelData.push({"t0":currenTime,"channelId":d.id,"dt":[0],"values":[acceleration.y]});
          } else if (d.channelName === "Accelerometer Z") {
            console.log("channel ID: " + d.id);
              channelData.push({"t0":currenTime,"channelId":d.id,"dt":[0],"values":[acceleration.z]});
          }
      });

      if(channelData.length>1){
        console.log("Write Channel Data");
        writeChannel(deviceId, channelData);
      }

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
          console.log("add channel");
          $scope.$storage.channels.push(result);
          console.log($scope.$storage);
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