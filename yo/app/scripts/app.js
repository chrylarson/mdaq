'use strict';

angular.module('yoApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'fsCordova',
  'ngStorage'
])
  .config(function ($routeProvider, $sceDelegateProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      // $sceDelegateProvider.resourceUrlWhitelist([
      //  'self',
      //  "https://embed.spotify.com/**"
      // ]);
  })
  .run(['$rootScope', '$location', '$localStorage', '$sessionStorage',  function ($rootScope, $location, $localStorage, $sessionStorage) {
        $rootScope.$storage = $localStorage;
        
        $rootScope.url = 'http://jarvis-dev.niwsc.com/deviceapi-2.0/rest';
    }]);
