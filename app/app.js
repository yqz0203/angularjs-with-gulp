/**
 * app入口文件
 */

;
(function() {
    'use strict'

    var app = angular.module('myApp', ['ngRoute', 'myApp.controllers', 'myApp.filters']);
    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'login.html',
                controller: 'LoginCtrl'
            })
            .when('/regist', {
                templateUrl: 'regist.html',
                controller: 'RegistCtrl'
            })
            .otherwise({
                redirectTo: '/login'
            });
    }]);
})();