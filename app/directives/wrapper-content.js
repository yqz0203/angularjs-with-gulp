(function() {
    'use strict';

    angular
        .module('ct.directive.wrapperContent', [])
        .directive('wrapperContent', WrapperContent);

    WrapperContent.$inject = ['$window'];

    function WrapperContent($window) {
        // Usage: 页面容器
        //
        // Creates:杨骐彰 2016/9/8
        //

        var directive = {
            link: link,
            restrict: 'EA',
            template: '<div class="wrapper-content">' +
                '<div class="wrapper-padding"></div>' +
                '</div>',
            replace: true,
            transclude: true
        };
        return directive;

        function link(scope, element, attrs, ctrl, transcludeFn) {
            function calcu() {
                element.css('minHeight', ($window.innerHeight || document.documentElement.clientHeight) - 54);
            }

            calcu();
            angular.element($window).on('resize', calcu);

            element.on('$destory', function() {
                angular.element($window).off('resize', calcu);
            });

            transcludeFn(scope, function(clonedTranscludedContent) {
                element.find('div').append(clonedTranscludedContent);
            });
        }
    }

    document.createElement('wrapper-content');
})();