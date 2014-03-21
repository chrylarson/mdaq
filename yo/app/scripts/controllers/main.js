'use strict';

angular.module('yoApp')
  .controller('MainCtrl', function ($rootScope, $scope, $http, $localStorage, $sessionStorage, $interval, CordovaService) {

    var demoMode = true;
    var intervalId;
    var loops = 0;
    var loopsCnt = 40;
    var dt = 50;

    var accXdata = [];
    var accYdata = [];
    var accZdata = [];
    var accDt = [];

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
    });

    $scope.start = function() {
      if ( angular.isDefined(intervalId) ) return;

      if(demoMode === true){

        intervalId = $interval(function () {
          demoSuccess();
        }, dt);

      } else {

        intervalId = $interval(function () {
          navigator.accelerometer.getCurrentAcceleration(accelerometerSuccess, accelerometerError);
        }, dt);

      }
    };

    $scope.pause = function() {
      if (angular.isDefined(intervalId)) {
        $interval.cancel(intervalId);
        intervalId = undefined;
      }
    };

    function demoSuccess() {

      var channelData = [];
      var deviceId = '';
      var currenTime = new Date().getTime();

      //update display
      $scope.accX = Math.random();
      $scope.accY = Math.random();
      $scope.accZ = Math.random();
      $scope.accTimestamp = currenTime;
      //$scope.$apply();

      //build data array for current loop
      accXdata.push($scope.accX);
      accYdata.push($scope.accX);
      accZdata.push($scope.accX);
      accDt.push(loops * dt);
      loops = loops + 1;

      if(loops>loopsCnt){

        $scope.$storage.channels.forEach(function (d, index) {
          deviceId = d.deviceId;
          if (d.channelName === "Accelerometer X") {
              console.log("channel ID: " + d.id);
                channelData.push({"t0":currenTime,"channelId":d.id,"dt":accDt,"values":accXdata});
            } else if (d.channelName === "Accelerometer Y") {
              console.log("channel ID: " + d.id);
                channelData.push({"t0":currenTime,"channelId":d.id,"dt":accDt,"values":accYdata});
            } else if (d.channelName === "Accelerometer Z") {
              console.log("channel ID: " + d.id);
                channelData.push({"t0":currenTime,"channelId":d.id,"dt":accDt,"values":accZdata});
            }
        });

        console.log("Write Channel Data");
        writeChannel(deviceId, channelData);

        //reset loop
        accXdata = [];
        accYdata = [];
        accZdata = [];
        accDt = [];
        loops = 0;

      }

    }

    // onSuccess: Get a snapshot of the current acceleration
    //
    function accelerometerSuccess(acceleration) {

      var channelData = [];
      var deviceId = '';
      var currenTime = new Date().getTime();

      //update display
      $scope.accX = acceleration.x;
      $scope.accY = acceleration.y;
      $scope.accZ = acceleration.z;
      $scope.accTimestamp = acceleration.timestamp;
      $scope.$apply();

      //build data array for current loop
      accXdata.push(acceleration.x);
      accYdata.push(acceleration.y);
      accZdata.push(acceleration.z);
      accDt.push(loops * dt);
      loops = loops + 1;

      if(loops>loopsCnt){

        $scope.$storage.channels.forEach(function (d, index) {
          deviceId = d.deviceId;
          if (d.channelName === "Accelerometer X") {
              console.log("channel ID: " + d.id);
                channelData.push({"t0":currenTime,"channelId":d.id,"dt":accDt,"values":accXdata});
            } else if (d.channelName === "Accelerometer Y") {
              console.log("channel ID: " + d.id);
                channelData.push({"t0":currenTime,"channelId":d.id,"dt":accDt,"values":accYdata});
            } else if (d.channelName === "Accelerometer Z") {
              console.log("channel ID: " + d.id);
                channelData.push({"t0":currenTime,"channelId":d.id,"dt":accDt,"values":accZdata});
            }
        });

        console.log("Write Channel Data");
        writeChannel(deviceId, channelData);

        //reset loop
        accXdata = [];
        accYdata = [];
        accZdata = [];
        accDt = [];
        loops = 0;

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
        }).success(function (response) {
          console.log(response);
          $scope.device = response;
            createChannel(deviceName, "Accelerometer X", 0);
            createChannel(deviceName, "Accelerometer Y", 1);
            createChannel(deviceName, "Accelerometer Z", 2);
        }).error(function (response, status) {
          getDevice(deviceName);
          
          console.log("error registering phone");
        });   
    };

    function getDevice (deviceName) {
      var createUrl = $rootScope.url + '/devices/' + deviceName;
        $http({
            url: createUrl,
            method: "GET",
            timeout: 10000,
            headers: {'Content-Type': 'application/json', 'x-ni-apikey':'MGCTApKKBaInxrBIsSGYeHAWALYcnnLM'}
        }).success(function (response) {
          console.log(response);
          $scope.device = response;
          getChannels(deviceName);
        }).error(function (response, status) {
          console.log("error updating phone");
        });
    };

    function getChannels (deviceName) {
      console.log("getting channels");
      var createUrl = $rootScope.url + '/devices/' + deviceName + '/channels/';
        $http({
            url: createUrl,
            method: "GET",
            timeout: 10000,
            headers: {'Content-Type': 'application/json', 'x-ni-apikey':'MGCTApKKBaInxrBIsSGYeHAWALYcnnLM'}
        }).success(function (response) {
          console.log(response);
          $scope.$storage.channels = response;
        }).error(function (response, status) {
          console.log("error updating phone");
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