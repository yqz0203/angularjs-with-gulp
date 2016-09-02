/**
 * index路由模块
 */

;
(function() {
    'use strict'

    angular.module('myApp.controller.login', [])
        .controller('LoginCtrl', function($scope) {
            $scope.name = '';
            $scope.password = '';
            $scope.login = function() {
                alert($scope.name + '登陆了');
            };
        });

})();