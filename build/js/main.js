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
/**
 * 路由主模块
 * 包含所有路由模块
 */

;
(function() {
    'use strict'

    angular.module('myApp.controllers', ['myApp.controller.login', 'myApp.controller.regist']);
})();
(function() {
    'use strict';

    angular
        .module('myApp.filters', [])
        .filter('become1', become1);

    function become1() {
        return become1Filter;

        ////////////////

        function become1Filter(Params) {
            return 1;
        }
    }
})();
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