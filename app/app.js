/**
 * app入口文件
 */
(function() {
    'use strict'

    var app = angular.module('ct', ['ngAnimate', 'ui.router', 'ct.templates', 'ct.controllers', 'ct.filters', 'ct.directives']);
    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider
            .when("", "/")
            .otherwise('/notfound');

        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'layout.html'
            })
            .state('main.evaluate', {
                url: 'evaluate',
                templateUrl: 'evaluate/index.html'
            })

        .state('main.evaluate:personal', {
                url: 'evaluate/personal',
                templateUrl: 'evaluate/personal.html'
            })
            .state('main.evaluate:settings', {
                url: 'evaluate/settings',
                templateUrl: 'evaluate/settings.html'
            })
            .state('main.evaluate:make', {
                url: 'evaluate/make',
                controller: 'EvaluateMakeCtrl',
                templateUrl: 'evaluate/make.html'
            })
            .state('main.evaluate:result', {
                url: 'evaluate/result',
                controller: 'EvaluateResultCtrl',
                templateUrl: 'evaluate/result.html'
            })
            .state('404', {
                url: '/notfound',
                templateUrl: '404.html'
            })

        // $routeProvider
        // .when('/', {
        //         templateUrl: 'layout.html'
        //     })
        //     .when('/login', {
        //         templateUrl: 'login.html',
        //         controller: 'LoginCtrl'
        //     })
        //     .when('/regist', {
        //         templateUrl: 'regist.html',
        //         controller: 'RegistCtrl'
        //     })
        //     .otherwise({
        //         redirectTo: '/'
        //     });
    }]);
})();