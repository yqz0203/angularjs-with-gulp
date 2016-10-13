/**
 * index路由模块
 */

;
(function() {
    'use strict'

    angular.module('ct.controller.regist', [])
        .controller('RegistCtrl', ['$scope', function($scope) {
            $scope.name = '';
            $scope.password = '';
        }]);

})();