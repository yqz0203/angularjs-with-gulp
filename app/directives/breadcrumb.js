(function() {
    'use strict';

    angular
        .module('ct.directive.breadcrumb', [])
        .directive('breadcrumb', Breadcrumb);

    function Breadcrumb() {
        // Usage: 面包屑导航
        //
        // Creates:杨骐彰 2016/9/8
        //

        var directive = {
            restrict: 'EA',
            templateUrl: 'directive/breadcrumb.html',
            scope: {
                items: '=breadcrumbData'
            },
            replace: true,
            transclude: true
        };
        return directive;
    }

    document.createElement('breadcrumb');
})();