/**
 * index路由模块
 */

;
(function() {
    'use strict'

    angular.module('myApp.controller.regist', [])
        .controller('RegistCtrl', function($scope) {
            $scope.name = '';
            $scope.password = '';
        });

})();