(function() {
    'use strict';

    angular
        .module('ct.directive.select2', [])
        .directive('select2', Select2);

    Select2.$inject = ['$document'];

    function Select2($document) {
        // Usage: 自定义select控件
        //
        // Creates:杨骐彰 2016/9/7
        //

        var directive = {
            link: link,
            restrict: 'EA',
            templateUrl: 'directive/select2.html',
            scope: {
                //如果是@直接接受模板的字符串，如果是=模板不能用双括号，直接引号
                options: '=select2Options',
                value: '=select2Value',
                placeholder: '@select2Placeholder'
            },
            replace: true
        };
        return directive;

        function link(scope, element, attrs) {
            //空白字符串
            var placeholder = scope.placeholder || '请选择';
            //打开或关闭状态
            scope.isOpen = false;
            //显示字符串
            scope.displayText = '';
            //打开或关闭
            scope.toggle = function() {
                if (!scope.isOpen) {
                    open();
                } else {
                    close();
                }
            };

            //选中
            scope.select = function(value) {
                scope.value = value;
                scope.isOpen = false;
            }

            scope.$watch('value', function(n, o) {
                var found = false;
                angular.forEach(scope.options, function(v, i) {
                    if (v.value === n) {
                        found = true;
                        scope.displayText = v.text;
                    }
                });
                if (!found) {
                    scope.displayText = placeholder;
                }
            });

            $document.on('click', globalBind);
            //元素销毁(也可用作用域scope.$on('destory'))销毁时移除全局的事件
            element.on('$destroy', globalUnBind);

            //打开
            function open() {
                scope.isOpen = true;
            }

            //关闭
            function close() {
                scope.isOpen = false;
            }

            function isHasChild(child, parent) {
                if (child === parent) {
                    return true;
                }
                while (child) {
                    if (child === parent) {
                        return true;
                    } else {
                        child = child.parentNode;
                    }
                }
                return false;
            }

            function globalBind(e) {
                var target = angular.element(e.target);
                if (!isHasChild(target[0], element[0])) {
                    scope.isOpen = false;
                }
                scope.$apply();
            }

            function globalUnBind() {
                $document.off('click', globalBind);
            }
        }
    }


    document.createElement('select2');
})();