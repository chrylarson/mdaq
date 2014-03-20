'use strict';

angular.module('yoApp')
  .factory('accelerometer', function ($rootScope, CordovaService) {
    return {
    getCurrentAcceleration: CordovaService.ready.then(function (onSuccess, onError) {
      navigator.accelerometer.getCurrentAcceleration(function () {
        var that = this,
          args = arguments;

        if (onSuccess) {
          $rootScope.$apply(function () {
            onSuccess.apply(that, args);
          });
        }
      }, function () {
        var that = this,
          args = arguments;

        if (onError) {
          $rootScope.$apply(function () {
            onError.apply(that, args);
          });
        }
      });
    })
  };
});