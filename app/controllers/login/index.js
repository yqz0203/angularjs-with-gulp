/**
 * index路由模块
 */

(function() {
    'use strict'

    angular.module('ct.controller.login', [])
        .controller('LoginCtrl', ['$scope', '$state', function($scope, $state) {
            $scope.name = '';
            $scope.password = '';
            $scope.login = function() {
                alert($scope.name + '登陆了' + $scope.value);
            };

            $scope.options = [
                { text: '未评测', value: 1 },
                { text: '已评测', value: 2 },
                { text: '已放弃', value: 3 },
                { text: '已通过', value: 4 }
            ];
            $scope.value = 1;
        }]);
})();