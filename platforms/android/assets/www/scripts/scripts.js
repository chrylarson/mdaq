"use strict";angular.module("yoApp",["ngCookies","ngResource","ngSanitize","ngRoute","ngStorage"]).config(["$routeProvider","$sceDelegateProvider",function(a,b){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"}),b.resourceUrlWhitelist(["self","https://embed.spotify.com/**"])}]).run(["$rootScope","$location","$localStorage","$sessionStorage",function(a,b,c){a.$storage=c,a.url="http://sxsw.joehack3r.com:3000/",console.log(a.$storage.email),b.path("undefined"!=typeof a.$storage.email?"":"/start")}]),angular.module("yoApp").controller("MainCtrl",["$rootScope","$scope","$http","$localStorage","$sessionStorage","Cordova",function(a,b,c,d,e,f){b.$storage=d,console.log("Start main"),f.ready.then(function(){console.log("Cordova Ready")}),b.openWebsite=function(a){window.open(a,"_system")}}]);