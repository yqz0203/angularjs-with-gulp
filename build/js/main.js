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
(function() {
    'use strict';

    angular
        .module('ct.directive.datepicker', [])
        .directive('datepicker', Datepicker)

    Datepicker.$inject = ['$document'];

    function Datepicker($document) {
        // Usage:日期选择控件
        //
        // Creates:杨骐彰 2016/9/12
        //
        var directive = {
            restrict: 'EA',
            controller: DatepickerController,
            link: link,
            templateUrl: 'directive/datepicker.html',
            scope: {
                value: "=value",
                spliter: '@',
                placeHolder: '@',
                autoClose: '@',
                minView: '@',
                maxView: '@',
                startRange: '@',
                endRange: '@'
            },
            replace: true
        };
        return directive;

        function link(scope, element, attrs) {
            //分隔符
            var spliter = scope.spliter || '-';
            //空白字符
            var placeHolder = scope.placeHolder === undefined ? '请选择日期' : scope.placeHolder;
            //选择后自动关闭
            var autoClose = scope.autoClose || false;
            //最小视图
            var minView = scope.minView !== undefined ? Number(scope.minView) : 0;
            //最大视图
            var maxView = scope.minView !== undefined ? Number(scope.maxView) : 2;
            //区间
            var startRange = convertDate(scope.startRange),
                endRange = convertDate(scope.endRange);

            //打开状态
            scope.isOpen = false;
            //标题显示数值
            scope.titleShowValue = '';
            //视图显示的数值，用于页面展现，并非真是数值
            scope.showValue = new Date();
            //当前显示视图：0 日 1 月 2年
            scope.currentView = minView;
            //年视图列项
            scope.yearViewItems = []
                //月视图列项
            scope.monthViewItems = [];
            //日视图列项
            scope.dateViewItems = [];

            //打开或关闭
            scope.toggle = function() {
                scope.isOpen ? close() : open();
            };

            //点击了年份视图
            scope.setYear = function(e, year) {
                if (scope.currentView > minView) {
                    //切换到月视图
                    scope.currentView = 1;
                    scope.showValue.setYear(year);
                    setViewsItems();
                } else {
                    scope.showValue.setYear(year);
                    scope.value = copyDate(scope.showValue);
                    setViewsItems();
                    if (autoClose) {
                        scope.isOpen = false;
                    }
                }
                e.stopPropagation();
            }

            //点击了月份视图
            scope.setMonth = function(e, month) {
                if (scope.currentView > minView) {
                    //切换到日视图
                    scope.currentView = 0;
                    scope.showValue.setMonth(month);
                    setViewsItems();
                } else {
                    scope.showValue.setMonth(month);
                    scope.value = copyDate(scope.showValue);
                    setViewsItems();
                    if (autoClose) {
                        scope.isOpen = false;
                    }
                }
                e.stopPropagation();
            }

            //点击了日视图
            scope.setDate = function(month, date) {
                scope.showValue = new Date(scope.showValue.getFullYear(), month, date);
                scope.value = copyDate(scope.showValue);
                setViewsItems();
                if (autoClose) {
                    scope.isOpen = false;
                }
            };

            //选择今天
            scope.today = function() {
                scope.value = new Date();
                scope.currentView = minView;
                scope.showValue = copyDate(scope.value);
                setViewsItems();
                if (autoClose) {
                    scope.isOpen = false;
                }
            };

            //清除所选
            scope.clear = function() {
                scope.value = null;
                scope.showValue = new Date();
                scope.currentView = minView;
                setViewsItems();
            };

            //上一页
            scope.pre = function() {

                switch (scope.currentView) {
                    case 2:
                        scope.showValue.setYear(scope.showValue.getFullYear() - 12);
                        setViewsItems();
                        break;
                    case 1:
                        scope.showValue.setYear(scope.showValue.getFullYear() - 1);
                        setViewsItems();
                        break;
                    case 0:
                        scope.showValue.setMonth(scope.showValue.getMonth() - 1);
                        setViewsItems();
                        break;
                }
            };

            //下一页
            scope.next = function() {
                switch (scope.currentView) {
                    case 2:
                        scope.showValue.setYear(scope.showValue.getFullYear() + 12);
                        setViewsItems();
                        break;
                    case 1:
                        scope.showValue.setYear(scope.showValue.getFullYear() + 1);
                        setViewsItems();
                        break;
                    case 0:
                        scope.showValue.setMonth(scope.showValue.getMonth() + 1);
                        setViewsItems();
                }
            };

            //进入下一级视图
            scope.innerView = function() {
                if (scope.currentView < 2 && scope.currentView < maxView) {
                    scope.currentView++;
                }
                setViewsItems();
            }

            scope.$watch('value', function(val) {
                if (Object.prototype.toString.call(val) === "[object Date]" && !isNaN(val.getTime())) {
                    var year = val.getFullYear(),
                        month = val.getMonth() + 1,
                        date = val.getDate();
                    var full = [year, month > 9 ? month : ('0' + month), date > 9 ? date : ('0' + date)];
                    scope.displayText = full.reverse().slice(minView).reverse().join(spliter);

                } else {
                    scope.displayText = placeHolder;
                }
            });

            $document.on('click', globalBind);
            //元素销毁(也可用作用域scope.$on('destory'))销毁时移除全局的事件
            element.on('$destroy', globalUnBind);

            //转化时间对象
            function convertDate(date) {
                if (date) {
                    if (!angular.isDate(date)) {
                        var tr = date.split(/-|\//gi);
                        date = new Date(tr[0], tr[1] - 1, tr[2]);
                        return date;
                    }
                    return date;
                }
                return null;
            };

            //打开
            function open() {
                scope.showValue = copyDate(scope.value) || new Date();
                scope.isOpen = true;
                scope.currentView = minView;
                setViewsItems();
            };

            //关闭
            function close() {
                scope.isOpen = false;
            }

            function setViewsItems() {
                var val = copyDate(scope.showValue);
                var trueVal = copyDate(scope.value);
                var year = val.getFullYear(),
                    month = val.getMonth(),
                    date = val.getDate(),
                    time = val.getTime();

                switch (scope.currentView) {
                    case 2:
                        scope.titleShowValue = (year - 6) + '~' + (year + 5);
                        break;
                    case 1:
                        scope.titleShowValue = year + '年';
                        break;
                    case 0:
                        scope.titleShowValue = year + '年' + (month + 1) + '月';
                        break;
                }

                var startRangeYear = startRange ? startRange.getFullYear() : null,
                    startRangeMonth = startRange ? startRange.getMonth() : null,
                    startRangeDate = startRange ? startRange.getDate() : null,
                    endRangeYear = endRange ? endRange.getFullYear() : null,
                    endRangeMonth = endRange ? endRange.getMonth() : null,
                    endRangeDate = endRange ? endRange.getDate() : null;

                var yearDisabled = (startRangeYear && year < startRangeYear) || (endRangeYear && year > endRangeYear);
                var monthDisabled = (startRangeMonth && month < startRangeMonth) || (endRangeMonth && month > endRangeMonth);
                var lastMonthDisabled = (startRangeMonth && month - 1 < startRangeMonth) || (endRangeMonth && month - 1 > endRangeMonth);
                var nextMonthDisabled = (startRangeMonth && month + 1 < startRangeMonth) || (endRangeMonth && month + 1 > endRangeMonth);
                var dateDisabled = (startRangeMonth && date < startRangeMonth) || (endRangeMonth && date > endRangeMonth);

                debugger;
                //设置年份
                scope.yearViewItems = [];
                for (var i = year - 6; i < year + 6; i++) {
                    scope.yearViewItems.push({
                        t: i,
                        active: trueVal && i === trueVal.getFullYear(),
                        disabled: (startRangeYear && i < startRangeYear) || (endRangeYear && i > endRangeYear)
                    });
                }

                //设置月份
                scope.monthViewItems = [];
                for (var j = 1; j <= 12; j++) {
                    scope.monthViewItems.push({
                        t: j,
                        active: trueVal && j === trueVal.getMonth() + 1 && val.getFullYear() === trueVal.getFullYear(),
                        disabled: yearDisabled || (startRangeMonth && j < startRangeMonth) || (endRangeMonth && j > endRangeMonth)
                    });
                }

                //设置日
                scope.dateViewItems = [];
                var lastMonthDateCount = new Date(new Date(time).setDate(0)).getDate();
                var monthDateCount = new Date(new Date(new Date(new Date(time).setDate(1)).setMonth(month + 1)).setDate(0)).getDate();
                var day = new Date(new Date(time).setDate(1)).getDay();

                for (var li = day - 1; li >= 0; li--) {
                    scope.dateViewItems.push({
                        t: lastMonthDateCount - li,
                        thisMonth: false,
                        month: val.getMonth() - 1,
                        disabled: yearDisabled || lastMonthDisabled || (startRangeDate && li < startRangeDate) || (endRangeDate && li > endRangeDate),
                        active: trueVal && lastMonthDateCount - li === trueVal.getDate() && val.getMonth() === trueVal.getMonth() - 1 && val.getFullYear() === trueVal.getFullYear()
                    });
                }
                for (var k = 1; k <= monthDateCount; k++) {
                    scope.dateViewItems.push({
                        t: k,
                        thisMonth: true,
                        month: val.getMonth(),
                        disabled: yearDisabled || monthDisabled || (startRangeDate && k < startRangeDate) || (endRangeDate && k > endRangeDate),
                        active: trueVal && k === trueVal.getDate() && val.getMonth() === trueVal.getMonth() && val.getFullYear() === trueVal.getFullYear()

                    });
                }
                for (var lk = 1, lkl = scope.dateViewItems.length; lk <= 42 - lkl; lk++) {
                    scope.dateViewItems.push({
                        t: lk,
                        thisMonth: false,
                        month: val.getMonth() + 1,
                        disabled: yearDisabled || nextMonthDisabled || (startRangeDate && lk < startRangeDate) || (endRangeDate && lk > endRangeDate),
                        active: trueVal && lk === trueVal.getDate() && val.getMonth() === trueVal.getMonth() + 1 && val.getFullYear() === trueVal.getFullYear()
                    });
                }
            }
            setViewsItems();

            function copyDate(val) {
                if (Object.prototype.toString.call(val) === "[object Date]" && !isNaN(val.getTime())) {
                    return new Date(val.getTime());
                }
                return null;
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
                    close();
                }
                scope.$apply();
            }

            function globalUnBind() {
                $document.off('click', globalBind);
            }
        }
    }
    /* @ngInject */
    function DatepickerController() {

    }

    document.createElement('datepicker');
})();
(function() {
    'use strict';

    angular.module('ct.directives', [
        'ct.directive.select2',
        'ct.directive.wrapperContent',
        'ct.directive.breadcrumb',
        'ct.directive.datepicker'
    ]);
})();
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
/**
 * 路由主模块
 * 包含所有路由模块
 */

(function() {
    'use strict'

    angular.module('ct.controllers', ['ct.controllers.evaluate', 'ct.controller.login', 'ct.controller.regist']);
})();
(function() {
    'use strict';

    angular
        .module('ct.filters', [])
        .filter('become1', become1);

    function become1() {
        return become1Filter;

        ////////////////

        function become1Filter(Params) {
            return 1;
        }
    }
})();
angular.module('ct.templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('404.html','<h1>\r\n    \u60A8\u6240\u8BBF\u95EE\u7684\u9875\u9762\u4E0D\u5B58\u5728\uFF01\r\n</h1>');
$templateCache.put('layout.html','<div class="side-panel">\r\n    <div class="nav-menu-box">\r\n        <ul class="nav-menu">\r\n            <li class="nav-sub-menu">\r\n                <a class="nav-title" href="javascript:;">\r\n                    <span class="nav-title-icon icon-evaluate"></span>\u7D20\u8D28\u6D4B\u8BC4\r\n                </a>\r\n                <ul class="nav-menu">\r\n                    <li class="nav-item">\r\n                        <a ui-sref="main.evaluate:make" ui-sref-active="active">\u5236\u4F5C\u9898\u76EE</a>\r\n                    </li>\r\n                    <li class="nav-item">\r\n                        <a ui-sref="main.evaluate:settings" ui-sref-active="active">\u7BA1\u7406\u5458\u8BBE\u7F6E</a>\r\n                    </li>\r\n                    <li class="nav-item">\r\n                        <a ui-sref="main.evaluate:personal" ui-sref-active="active">\u4E2A\u4EBA\u8BC4\u6D4B</a>\r\n                    </li>\r\n                    <li class="nav-item">\r\n                        <a ui-sref="main.evaluate:result" ui-sref-active="active">\u6D4B\u8BC4\u7ED3\u679C\u67E5\u8BE2</a>\r\n                    </li>\r\n                </ul>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n</div>\r\n\r\n<div class="wrapper-body" ui-view>\r\n</div>');
$templateCache.put('login.html','<div ng-controller="LoginCtrl">\r\n    <input placeholder="name" ng-model="name" />\r\n    <input placeholder="password" type="password" ng-model="password" />\r\n    <select2 select2-options="options" select2-value="value"></select2>\r\n    <button ng-click="login()">\u767B\u9646</button>\r\n    <a ng-href="#/regist">\u6CA1\u6709\u8D26\u53F7\uFF1F\u6CE8\u518C</a>\r\n</div>');
$templateCache.put('regist.html','<breadcrumb breadcrumb-data="[\'\u4E2A\u4EBA\u8BC4\u6D4B\',\'\u4E2A\u4EBA\u7D20\u8D28\u6D4B\u8BC4\']"></breadcrumb>\r\n<wrapper-content>\r\n    <h4>\u8BF7\u6CE8\u518C <small> <a href="#/login ">\u8FD4\u56DE\u767B\u9646</a></small></h4>\r\n    <input placeholder="name " ng-model="name " />\r\n    <input placeholder="password " type="password " ng-model="password " />\r\n    <button>\u6CE8\u518C</button>\r\n</wrapper-content>');
$templateCache.put('directive/breadcrumb.html','<div class="breadcrumb-box">\r\n    <span ng-repeat="item in items">\r\n        {{item}}\r\n        <span ng-if="items.length !== $index + 1">&gt;</span>\r\n    </span>\r\n</div>');
$templateCache.put('directive/datepicker.html','<div class="datepicker-wrapper" ng-class="{open:isOpen}">\r\n    <div class="datepicker-wrapper-display" ng-click="toggle()">\r\n        <!--<input type="text" placeholder="\u8BF7\u9009\u62E9..." value="{{displayText}}" />-->\r\n        <div>{{displayText}}</div>\r\n    </div>\r\n    <div class="datepicker-wrapper-dropdown" ng-show="isOpen">\r\n        <div class="datepicker-header">\r\n            <span class="datepicker-pre" ng-click="pre()">&lt;</span>\r\n            <span class="datepicker-title" ng-click="innerView()">{{titleShowValue}}</span>\r\n            <span class="datepicker-next" ng-click="next()">&gt;</span>\r\n        </div>\r\n        <div class="datepicker-year-view" ng-show="currentView === 2">\r\n            <span class="item" ng-class="{active:item.active,disabled:item.disabled}" ng-click="!item.disabled&&setYear($event, item.t)" ng-repeat="item in yearViewItems">{{item.t}}</span>\r\n        </div>\r\n        <div class="datepicker-month-view" ng-show="currentView === 1">\r\n            <span class="item" ng-class="{active:item.active,disabled:item.disabled}" ng-click="!item.disabled&&setMonth($event,item.t-1)" ng-repeat="item in monthViewItems">{{item.t}}\u6708</span>\r\n        </div>\r\n        <div class="datepicker-date-view" ng-show="currentView === 0">\r\n            <span class="title">\u65E5</span>\r\n            <span class="title">\u4E00</span>\r\n            <span class="title">\u4E8C</span>\r\n            <span class="title">\u4E09</span>\r\n            <span class="title">\u56DB</span>\r\n            <span class="title">\u4E94</span>\r\n            <span class="title">\u516D</span>\r\n            <span class="item" ng-click="!item.disabled&&setDate(item.month,item.t)" ng-class="{lighter:!item.thisMonth,active:item.active,disabled:item.disabled}" ng-repeat="item in dateViewItems track by $index">{{item.t}}</span>\r\n        </div>\r\n        <div class="date-picker-footer">\r\n            <a href="javascript:;" class="" ng-click="today()">\r\n                    \u4ECA\u5929\r\n                </a>\r\n            <a href="javascript:;" class="text-red" ng-click="clear()">\r\n                    \u6E05\u9664\r\n                </a>\r\n        </div>\r\n    </div>\r\n</div>');
$templateCache.put('directive/select2.html','<div class="select-wrapper" ng-class="{open:isOpen}">\r\n    <div class="select-wrapper-display" ng-click="toggle()">\r\n        <!--<input type="text" placeholder="\u8BF7\u9009\u62E9..." value="{{displayText}}" />-->\r\n        <div>{{displayText}}</div>\r\n    </div>\r\n    <div class="select-wrapper-dropdown" ng-show="isOpen">\r\n        <div class="select-wrapper-dropdown-item" ng-class="{selected:o.value === value}" ng-click="select(o.value)" ng-repeat="o in options">{{o.text}}</div>\r\n    </div>\r\n</div>');
$templateCache.put('evaluate/index.html','<breadcrumb breadcrumb-data="[\'\u7D20\u8D28\u6D4B\u8BC4\']"></breadcrumb>\r\n<wrapper-content>\r\n    <h4>\r\n        \u8FD9\u662F\u7D20\u8D28\u6D4B\u8BC4\u5F15\u5BFC\u8BF4\u660E\u9875\u9762\r\n    </h4>\r\n</wrapper-content>');
$templateCache.put('evaluate/make.html','<breadcrumb breadcrumb-data="[\'\u9898\u5E93\']"></breadcrumb>\r\n<wrapper-content>\r\n    <div class="search-toolbox">\r\n        <div class="form-g">\r\n            <button class="btn btn-pink" ng-click="showUploadModal(true)">\r\n                <span class="btn-icon icon-upload"></span>\r\n                \u4E0A\u4F20\u9898\u5E93\r\n            </button>\r\n            <button class="btn">\r\n                 <span class="btn-icon icon-upload"></span>\r\n                \u4E0A\u4F20\u8BA1\u7B97\u89C4\u5219\r\n            </button>\r\n        </div>\r\n    </div>\r\n\r\n    <!--\u4E0A\u4F20\u9898\u5E93modal-->\r\n    <div class="modal" ng-class="{show:isShowUploadModal}">\r\n        <div class="modal-body" style="height:426px;width:640px;margin-left:-320px;margin-top:-213px;">\r\n            <div class="modal-header">\r\n                <div class="close" ng-click="showUploadModal(false)">\r\n\r\n                    <span class="close-icon"></span> \u5173\u95ED\r\n                </div>\r\n                <div class="modal-title">\r\n                    \u4E0A\u4F20\u9898\u76EE\r\n                </div>\r\n            </div>\r\n            <div class="modal-content">\r\n                <div class="off-t off-b off-l-s off-r">\r\n                    <table class="table table-form fs-16">\r\n                        <tbody>\r\n                            <tr>\r\n                                <td style="width:6em">\r\n                                    <span class="text-orange">\r\n                                    *\r\n                                </span>\u9898\u76EE\u540D\u79F0\uFF1A\r\n                                </td>\r\n                                <td>\u6027\u683C\u6027\u5411\u6D4B\u8BD5</td>\r\n                            </tr>\r\n                            <tr>\r\n                                <td class="align-top"><span class="text-orange">\r\n                                    *\r\n                                </span>\u9898\u76EE\u63CF\u8FF0\uFF1A</td>\r\n                                <td>\r\n                                    <textarea class="form-c" style="height:160px;resize:none;"></textarea>\r\n                                </td>\r\n                            </tr>\r\n                            <tr>\r\n                                <td><span class="text-orange">\r\n                                    *\r\n                                </span>\u6587\u4EF6\u9009\u62E9\uFF1A</td>\r\n                                <td>\r\n                                    <input class="form-c" style="width:392px; display:inline-block;" />\r\n                                    <button class="btn btn-pink btn-fix-size">\u6D4F&nbsp;&nbsp;\u89C8</button>\r\n                                </td>\r\n                            </tr>\r\n                        </tbody>\r\n                    </table>\r\n                    <div class="text-center">\r\n                        <button class="btn btn-fix-size">\u4E0A&nbsp;&nbsp;\u4F20</button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <!--\u6CA1\u6709\u6570\u636E\u65F6\u63D0\u793A-->\r\n    <div class="off-t fs-16 off-l-s">\r\n        \u8FD8\u6CA1\u6709\u8868\u683C\u6570\u636E\u54E6\uFF0C\u8BF7\u5148\u4E0A\u4F20\u9898\u5E93~\r\n    </div>\r\n</wrapper-content>');
$templateCache.put('evaluate/personal.html','<breadcrumb breadcrumb-data="[\'\u4E2A\u4EBA\u8BC4\u6D4B\']"></breadcrumb>\r\n<wrapper-content>\r\n    <div class="search-toolbox">\r\n        <label class="search-toolbox-label">\u67E5\u8BE2\u6761\u4EF6</label>\r\n\r\n        <div class="search-toolbox-form">\r\n            <div class="form-g">\r\n                <label class="label">\u7D20\u8D28\u8BC4\u6D4B\u540D\u79F0\uFF1A</label>\r\n                <input class="form-c" />\r\n            </div>\r\n\r\n            <div class="form-g">\r\n                <label class="label">\u7D20\u8D28\u8BC4\u6D4B\u72B6\u6001\uFF1A</label>\r\n                <select2 select2-value="1" select2-options="[{text:\'\u672A\u8BC4\u6D4B\',value:1},{text:\'\u5DF2\u8BC4\u6D4B\',value:2}]"></select2>\r\n            </div>\r\n            <div class="form-g">\r\n                <button class="btn btn-fix-size">\r\n                \u67E5&nbsp;&nbsp;\u8BE2\r\n            </button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div>\r\n        <div class="panel off-t">\r\n            <div class="panel-header">\r\n                <div class="panel-title">\u7D20\u8D28\u8BC4\u6D4B\u5217\u8868</div>\r\n            </div>\r\n            <div class="panel-body">\r\n                <table class="table">\r\n                    <thead>\r\n                        <tr class="first">\r\n                            <th class="first">\u5E8F\u53F7</th>\r\n                            <th>\u7D20\u8D28\u8BC4\u6D4B\u540D\u79F0</th>\r\n                            <th>\u5F00\u59CB\u65F6\u95F4</th>\r\n                            <th>\u8BC4\u6D4B\u65F6\u95F4</th>\r\n                            <th>\u8BC4\u6D4B\u8FDB\u5EA6</th>\r\n                            <th>\u72B6\u6001</th>\r\n                            <th class="last">\u64CD\u4F5C</th>\r\n                        </tr>\r\n                    </thead>\r\n                    <tbody>\r\n                        <tr>\r\n                            <td>1</td>\r\n                            <td>\u6027\u683C\u503E\u5411\u6D4B\u8BD5</td>\r\n                            <td>2016-04-07</td>\r\n                            <td>2016-04-22 10:22:22</td>\r\n                            <td>1/45</td>\r\n                            <td>\u672A\u5B8C\u6210</td>\r\n                            <td class="last">\u5F00\u59CB\u8BC4\u6D4B</td>\r\n                        </tr>\r\n                        <tr>\r\n                            <td>1</td>\r\n                            <td>\u6027\u683C\u503E\u5411\u6D4B\u8BD5</td>\r\n                            <td>2016-04-07</td>\r\n                            <td>2016-04-22 10:22:22</td>\r\n                            <td>1/45</td>\r\n                            <td>\u672A\u5B8C\u6210</td>\r\n                            <td class="last">\u5F00\u59CB\u8BC4\u6D4B</td>\r\n                        </tr>\r\n                        <tr>\r\n                            <td>1</td>\r\n                            <td>\u6027\u683C\u503E\u5411\u6D4B\u8BD5</td>\r\n                            <td>2016-04-07</td>\r\n                            <td>2016-04-22 10:22:22</td>\r\n                            <td>1/45</td>\r\n                            <td>\u672A\u5B8C\u6210</td>\r\n                            <td class="last">\u5F00\u59CB\u8BC4\u6D4B</td>\r\n                        </tr>\r\n                        <tr class="last">\r\n                            <td>1</td>\r\n                            <td>\u6027\u683C\u503E\u5411\u6D4B\u8BD5</td>\r\n                            <td>2016-04-07</td>\r\n                            <td>2016-04-22 10:22:22</td>\r\n                            <td>1/45</td>\r\n                            <td>\u672A\u5B8C\u6210</td>\r\n                            <td class="last">\u5F00\u59CB\u8BC4\u6D4B</td>\r\n                        </tr>\r\n                    </tbody>\r\n                </table>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</wrapper-content>');
$templateCache.put('evaluate/result.html','<breadcrumb breadcrumb-data="[\'\u67E5\u8BE2\u7ED3\u679C\']"></breadcrumb>\r\n<div wrapper-content>\r\n    <div class="search-toolbox">\r\n        <label class="search-toolbox-label">\u67E5\u8BE2\u6761\u4EF6</label>\r\n        <div class="search-toolbox-form">\r\n            <div class="form-g">\r\n                <label class="label">\u59D3\u540D\uFF1A</label>\r\n                <input class="form-c" ng-model="searchParams.name" />\r\n            </div>\r\n            <div class="form-g">\r\n                <label class="label">\u4EBA\u5458\u9009\u62E9\uFF1A</label>\r\n                <select2 select2-value="searchParams.people" select2-options="[{text:\'\u8463\u4E8B\u957F\',value:1},{text:\'\u79D8\u4E66\',value:2}]"></select2>\r\n            </div>\r\n            <div class="form-g">\r\n                <label class="label">\u7D20\u8D28\u8BC4\u6D4B\u72B6\u6001\uFF1A</label>\r\n                <select2 select2-value="searchParams.state" select2-options="[{text:\'\u672A\u8BC4\u6D4B\',value:1},{text:\'\u5DF2\u8BC4\u6D4B\',value:2}]"></select2>\r\n            </div>\r\n            <div class="form-g">\r\n                <label class="label">\u8BC4\u6D4B\u65E5\u671F\uFF1A</label>\r\n                <datepicker start-range="2016-9-1" value="searchParams.testTimeBegin"></datepicker>\r\n                -\r\n                <datepicker value="searchParams.testTimeEnd"></datepicker>\r\n            </div>\r\n            <div class="form-g">\r\n                <button class="btn btn-fix-size" ng-click="search()">\r\n                \u67E5&nbsp;&nbsp;\u8BE2\r\n            </button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <div class="off-t">\r\n        <button class="btn btn-pink">\r\n                <span class="btn-icon icon-export"></span>\r\n                \u5BFC\u51FA\u8868\u683C\r\n            </button>\r\n    </div>\r\n    <div class="panel off-t">\r\n        <div class="panel-header">\r\n            <div class="panel-toolbox">\r\n                <a class="text-blue" href="javascript:void();">\u65B0\u589E\u7BA1\u7406\u5458</a>\r\n            </div>\r\n        </div>\r\n        <div class="panel-body">\r\n            <table class="table">\r\n                <thead>\r\n                    <tr class="first">\r\n                        <th class="first">\u5458\u5DE5\u7F16\u53F7</th>\r\n                        <th>\u5458\u5DE5\u59D3\u540D</th>\r\n                        <th>\u4E2D\u5FC3/\u4E8B\u4E1A\u90E8/\u5927\u533A/\u5206\u90E8</th>\r\n                        <th>\u804C\u4F4D</th>\r\n                        <th class="last">\u64CD\u4F5C</th>\r\n                    </tr>\r\n                </thead>\r\n                <tbody>\r\n                    <tr>\r\n                        <td>10234677</td>\r\n                        <td>\u7F57\u831C\u831C</td>\r\n                        <td>\u56FD\u7F8E\u96C6\u56E2/\u96C6\u56E2\u603B\u90E8/\u4FE1\u606F\u6280\u672F\u526F\u603B\u88C1/\u5F02\u5730\u4FE1\u606F\u4E2D\u5FC3/\u4EA7\u54C1\u9879\u76EE\u90E8</td>\r\n                        <td>\u4EA7\u54C1\u7ECF\u7406</td>\r\n                        <td class="last">\r\n                            <a class="text-pink table-operate" href="javascript:void(0);">\u67E5\u770B</a>\r\n                            <a class="text-red table-operate" href="javascript:void(0);">\u914D\u7F6E\u6743\u9650</a>\r\n                            <a class="text-blue table-operate" href="javascript:void(0);">\u5220\u9664</a>\r\n                        </td>\r\n                    </tr>\r\n                    <tr class="last">\r\n                        <td>10234677</td>\r\n                        <td>\u6797\u65B9\u4E66</td>\r\n                        <td>\u56FD\u7F8E\u96C6\u56E2/\u96C6\u56E2\u603B\u90E8/\u4FE1\u606F\u6280\u672F\u526F\u603B\u88C1/\u5F02\u5730\u4FE1\u606F\u4E2D\u5FC3/\u4EA7\u54C1\u9879\u76EE\u90E8</td>\r\n                        <td>\u4EA7\u54C1\u7ECF\u7406</td>\r\n                        <td class="last">\r\n                            <a class="text-pink table-operate" href="javascript:void(0);">\u67E5\u770B</a>\r\n                            <a class="text-red table-operate" href="javascript:void(0);">\u914D\u7F6E\u6743\u9650</a>\r\n                            <a class="text-blue table-operate" href="javascript:void(0);">\u5220\u9664</a>\r\n                        </td>\r\n                    </tr>\r\n\r\n                </tbody>\r\n            </table>\r\n        </div>\r\n    </div>\r\n</div>');
$templateCache.put('evaluate/settings.html','<breadcrumb breadcrumb-data="[\'\u7BA1\u7406\u5458\u8BBE\u7F6E\']"></breadcrumb>\r\n<wrapper-content>\r\n    <div class="search-toolbox">\r\n        <label class="search-toolbox-label">\u67E5\u8BE2\u6761\u4EF6</label>\r\n        <div class="search-toolbox-form">\r\n            <div class="form-g">\r\n                <label class="label">\u5458\u5DE5\u59D3\u540D\uFF1A</label>\r\n                <input class="form-c" />\r\n            </div>\r\n\r\n            <div class="form-g">\r\n                <label class="label">\u5458\u5DE5\u7F16\u53F7\uFF1A</label>\r\n                <input class="form-c" />\r\n            </div>\r\n            <div class="form-g">\r\n                <button class="btn btn-fix-size">\r\n                \u67E5&nbsp;&nbsp;\u8BE2\r\n            </button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div>\r\n        <div class="panel off-t">\r\n            <div class="panel-header">\r\n                <div class="panel-toolbox">\r\n                    <a class="text-blue" href="javascript:void();">\u65B0\u589E\u7BA1\u7406\u5458</a>\r\n                </div>\r\n            </div>\r\n            <div class="panel-body">\r\n                <table class="table">\r\n                    <thead>\r\n                        <tr class="first">\r\n                            <th class="first">\u5458\u5DE5\u7F16\u53F7</th>\r\n                            <th>\u5458\u5DE5\u59D3\u540D</th>\r\n                            <th>\u4E2D\u5FC3/\u4E8B\u4E1A\u90E8/\u5927\u533A/\u5206\u90E8</th>\r\n                            <th>\u804C\u4F4D</th>\r\n                            <th class="last">\u64CD\u4F5C</th>\r\n                        </tr>\r\n                    </thead>\r\n                    <tbody>\r\n                        <tr>\r\n                            <td>10234677</td>\r\n                            <td>\u7F57\u831C\u831C</td>\r\n                            <td>\u56FD\u7F8E\u96C6\u56E2/\u96C6\u56E2\u603B\u90E8/\u4FE1\u606F\u6280\u672F\u526F\u603B\u88C1/\u5F02\u5730\u4FE1\u606F\u4E2D\u5FC3/\u4EA7\u54C1\u9879\u76EE\u90E8</td>\r\n                            <td>\u4EA7\u54C1\u7ECF\u7406</td>\r\n                            <td class="last">\r\n                                <a class="text-pink table-operate" href="javascript:void();">\u67E5\u770B</a>\r\n                                <a class="text-red table-operate" href="javascript:void();">\u914D\u7F6E\u6743\u9650</a>\r\n                                <a class="text-blue table-operate" href="javascript:void();">\u5220\u9664</a>\r\n                            </td>\r\n                        </tr>\r\n                        <tr class="last">\r\n                            <td>10234677</td>\r\n                            <td>\u6797\u65B9\u4E66</td>\r\n                            <td>\u56FD\u7F8E\u96C6\u56E2/\u96C6\u56E2\u603B\u90E8/\u4FE1\u606F\u6280\u672F\u526F\u603B\u88C1/\u5F02\u5730\u4FE1\u606F\u4E2D\u5FC3/\u4EA7\u54C1\u9879\u76EE\u90E8</td>\r\n                            <td>\u4EA7\u54C1\u7ECF\u7406</td>\r\n                            <td class="last">\r\n                                <a class="text-pink table-operate" href="javascript:void();">\u67E5\u770B</a>\r\n                                <a class="text-red table-operate" href="javascript:void();">\u914D\u7F6E\u6743\u9650</a>\r\n                                <a class="text-blue table-operate" href="javascript:void();">\u5220\u9664</a>\r\n                            </td>\r\n                        </tr>\r\n\r\n                    </tbody>\r\n                </table>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</wrapper-content>');}]);
(function() {
    'use strict';

    angular.module('ct.controllers.evaluate', [
        'ct.controller.evaluate.make',
        'ct.controller.evaluate.result'
    ]);
})();
(function() {
    'use strict';

    angular
        .module('ct.controller.evaluate.make', [])
        .controller('EvaluateMakeCtrl', EvaluateMakeCtrl);

    EvaluateMakeCtrl.$inject = ['$scope'];

    function EvaluateMakeCtrl($scope) {

        $scope.isShowUploadModal = false;
        $scope.showUploadModal = function(state) {
            $scope.isShowUploadModal = state;
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('ct.controller.evaluate.result', [])
        .controller('EvaluateResultCtrl', EvaluateResultCtrl);


    EvaluateResultCtrl.$inject = ['$scope', '$timeout'];

    function EvaluateResultCtrl($scope, $timeout) {
        $scope.searchParams = {
            testTimeBegin: null,
            testTimeEnd: null,
            people: null,
            state: null,
            name: ''
        }
        $scope.search = function() {
            alert('search:\n' + JSON.stringify($scope.searchParams));
        }
    }
})();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImRpcmVjdGl2ZXMvYnJlYWRjcnVtYi5qcyIsImRpcmVjdGl2ZXMvZGF0ZXBpY2tlci5qcyIsImRpcmVjdGl2ZXMvaW5kZXguanMiLCJkaXJlY3RpdmVzL3NlbGVjdDIuanMiLCJkaXJlY3RpdmVzL3dyYXBwZXItY29udGVudC5qcyIsImNvbnRyb2xsZXJzL2luZGV4LmpzIiwiZmlsdGVycy9pbmRleC5qcyIsInRlbXBsYXRlcy90ZW1wbGF0ZXMuanMiLCJjb250cm9sbGVycy9ldmFsdWF0ZS9pbmRleC5qcyIsImNvbnRyb2xsZXJzL2V2YWx1YXRlL21ha2UuanMiLCJjb250cm9sbGVycy9ldmFsdWF0ZS9yZXN1bHQuanMiLCJjb250cm9sbGVycy9sb2dpbi9pbmRleC5qcyIsImNvbnRyb2xsZXJzL3JlZ2lzdC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIGFwcOWFpeWPo+aWh+S7tlxyXG4gKi9cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnXHJcblxyXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdjdCcsIFsnbmdBbmltYXRlJywgJ3VpLnJvdXRlcicsICdjdC50ZW1wbGF0ZXMnLCAnY3QuY29udHJvbGxlcnMnLCAnY3QuZmlsdGVycycsICdjdC5kaXJlY3RpdmVzJ10pO1xyXG4gICAgYXBwLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcclxuXHJcbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyXHJcbiAgICAgICAgICAgIC53aGVuKFwiXCIsIFwiL1wiKVxyXG4gICAgICAgICAgICAub3RoZXJ3aXNlKCcvbm90Zm91bmQnKTtcclxuXHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtYWluJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnLycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xheW91dC5odG1sJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ21haW4uZXZhbHVhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICdldmFsdWF0ZScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2V2YWx1YXRlL2luZGV4Lmh0bWwnXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIC5zdGF0ZSgnbWFpbi5ldmFsdWF0ZTpwZXJzb25hbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJ2V2YWx1YXRlL3BlcnNvbmFsJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZXZhbHVhdGUvcGVyc29uYWwuaHRtbCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdtYWluLmV2YWx1YXRlOnNldHRpbmdzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnZXZhbHVhdGUvc2V0dGluZ3MnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdldmFsdWF0ZS9zZXR0aW5ncy5odG1sJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ21haW4uZXZhbHVhdGU6bWFrZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJ2V2YWx1YXRlL21ha2UnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0V2YWx1YXRlTWFrZUN0cmwnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdldmFsdWF0ZS9tYWtlLmh0bWwnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWFpbi5ldmFsdWF0ZTpyZXN1bHQnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICdldmFsdWF0ZS9yZXN1bHQnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0V2YWx1YXRlUmVzdWx0Q3RybCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2V2YWx1YXRlL3Jlc3VsdC5odG1sJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJzQwNCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9ub3Rmb3VuZCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJzQwNC5odG1sJ1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyAkcm91dGVQcm92aWRlclxyXG4gICAgICAgIC8vIC53aGVuKCcvJywge1xyXG4gICAgICAgIC8vICAgICAgICAgdGVtcGxhdGVVcmw6ICdsYXlvdXQuaHRtbCdcclxuICAgICAgICAvLyAgICAgfSlcclxuICAgICAgICAvLyAgICAgLndoZW4oJy9sb2dpbicsIHtcclxuICAgICAgICAvLyAgICAgICAgIHRlbXBsYXRlVXJsOiAnbG9naW4uaHRtbCcsXHJcbiAgICAgICAgLy8gICAgICAgICBjb250cm9sbGVyOiAnTG9naW5DdHJsJ1xyXG4gICAgICAgIC8vICAgICB9KVxyXG4gICAgICAgIC8vICAgICAud2hlbignL3JlZ2lzdCcsIHtcclxuICAgICAgICAvLyAgICAgICAgIHRlbXBsYXRlVXJsOiAncmVnaXN0Lmh0bWwnLFxyXG4gICAgICAgIC8vICAgICAgICAgY29udHJvbGxlcjogJ1JlZ2lzdEN0cmwnXHJcbiAgICAgICAgLy8gICAgIH0pXHJcbiAgICAgICAgLy8gICAgIC5vdGhlcndpc2Uoe1xyXG4gICAgICAgIC8vICAgICAgICAgcmVkaXJlY3RUbzogJy8nXHJcbiAgICAgICAgLy8gICAgIH0pO1xyXG4gICAgfV0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnY3QuZGlyZWN0aXZlLmJyZWFkY3J1bWInLCBbXSlcclxuICAgICAgICAuZGlyZWN0aXZlKCdicmVhZGNydW1iJywgQnJlYWRjcnVtYik7XHJcblxyXG4gICAgZnVuY3Rpb24gQnJlYWRjcnVtYigpIHtcclxuICAgICAgICAvLyBVc2FnZTog6Z2i5YyF5bGR5a+86IiqXHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBDcmVhdGVzOuadqOmqkOW9sCAyMDE2LzkvOFxyXG4gICAgICAgIC8vXHJcblxyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2RpcmVjdGl2ZS9icmVhZGNydW1iLmh0bWwnLFxyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgaXRlbXM6ICc9YnJlYWRjcnVtYkRhdGEnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbiAgICB9XHJcblxyXG4gICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnJlYWRjcnVtYicpO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnY3QuZGlyZWN0aXZlLmRhdGVwaWNrZXInLCBbXSlcclxuICAgICAgICAuZGlyZWN0aXZlKCdkYXRlcGlja2VyJywgRGF0ZXBpY2tlcilcclxuXHJcbiAgICBEYXRlcGlja2VyLiRpbmplY3QgPSBbJyRkb2N1bWVudCddO1xyXG5cclxuICAgIGZ1bmN0aW9uIERhdGVwaWNrZXIoJGRvY3VtZW50KSB7XHJcbiAgICAgICAgLy8gVXNhZ2U65pel5pyf6YCJ5oup5o6n5Lu2XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBDcmVhdGVzOuadqOmqkOW9sCAyMDE2LzkvMTJcclxuICAgICAgICAvL1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBEYXRlcGlja2VyQ29udHJvbGxlcixcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdkaXJlY3RpdmUvZGF0ZXBpY2tlci5odG1sJyxcclxuICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBcIj12YWx1ZVwiLFxyXG4gICAgICAgICAgICAgICAgc3BsaXRlcjogJ0AnLFxyXG4gICAgICAgICAgICAgICAgcGxhY2VIb2xkZXI6ICdAJyxcclxuICAgICAgICAgICAgICAgIGF1dG9DbG9zZTogJ0AnLFxyXG4gICAgICAgICAgICAgICAgbWluVmlldzogJ0AnLFxyXG4gICAgICAgICAgICAgICAgbWF4VmlldzogJ0AnLFxyXG4gICAgICAgICAgICAgICAgc3RhcnRSYW5nZTogJ0AnLFxyXG4gICAgICAgICAgICAgICAgZW5kUmFuZ2U6ICdAJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG4gICAgICAgICAgICAvL+WIhumalOesplxyXG4gICAgICAgICAgICB2YXIgc3BsaXRlciA9IHNjb3BlLnNwbGl0ZXIgfHwgJy0nO1xyXG4gICAgICAgICAgICAvL+epuueZveWtl+esplxyXG4gICAgICAgICAgICB2YXIgcGxhY2VIb2xkZXIgPSBzY29wZS5wbGFjZUhvbGRlciA9PT0gdW5kZWZpbmVkID8gJ+ivt+mAieaLqeaXpeacnycgOiBzY29wZS5wbGFjZUhvbGRlcjtcclxuICAgICAgICAgICAgLy/pgInmi6nlkI7oh6rliqjlhbPpl61cclxuICAgICAgICAgICAgdmFyIGF1dG9DbG9zZSA9IHNjb3BlLmF1dG9DbG9zZSB8fCBmYWxzZTtcclxuICAgICAgICAgICAgLy/mnIDlsI/op4blm75cclxuICAgICAgICAgICAgdmFyIG1pblZpZXcgPSBzY29wZS5taW5WaWV3ICE9PSB1bmRlZmluZWQgPyBOdW1iZXIoc2NvcGUubWluVmlldykgOiAwO1xyXG4gICAgICAgICAgICAvL+acgOWkp+inhuWbvlxyXG4gICAgICAgICAgICB2YXIgbWF4VmlldyA9IHNjb3BlLm1pblZpZXcgIT09IHVuZGVmaW5lZCA/IE51bWJlcihzY29wZS5tYXhWaWV3KSA6IDI7XHJcbiAgICAgICAgICAgIC8v5Yy66Ze0XHJcbiAgICAgICAgICAgIHZhciBzdGFydFJhbmdlID0gY29udmVydERhdGUoc2NvcGUuc3RhcnRSYW5nZSksXHJcbiAgICAgICAgICAgICAgICBlbmRSYW5nZSA9IGNvbnZlcnREYXRlKHNjb3BlLmVuZFJhbmdlKTtcclxuXHJcbiAgICAgICAgICAgIC8v5omT5byA54q25oCBXHJcbiAgICAgICAgICAgIHNjb3BlLmlzT3BlbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAvL+agh+mimOaYvuekuuaVsOWAvFxyXG4gICAgICAgICAgICBzY29wZS50aXRsZVNob3dWYWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICAvL+inhuWbvuaYvuekuueahOaVsOWAvO+8jOeUqOS6jumhtemdouWxleeOsO+8jOW5tumdnuecn+aYr+aVsOWAvFxyXG4gICAgICAgICAgICBzY29wZS5zaG93VmFsdWUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICAvL+W9k+WJjeaYvuekuuinhuWbvu+8mjAg5pelIDEg5pyIIDLlubRcclxuICAgICAgICAgICAgc2NvcGUuY3VycmVudFZpZXcgPSBtaW5WaWV3O1xyXG4gICAgICAgICAgICAvL+W5tOinhuWbvuWIl+mhuVxyXG4gICAgICAgICAgICBzY29wZS55ZWFyVmlld0l0ZW1zID0gW11cclxuICAgICAgICAgICAgICAgIC8v5pyI6KeG5Zu+5YiX6aG5XHJcbiAgICAgICAgICAgIHNjb3BlLm1vbnRoVmlld0l0ZW1zID0gW107XHJcbiAgICAgICAgICAgIC8v5pel6KeG5Zu+5YiX6aG5XHJcbiAgICAgICAgICAgIHNjb3BlLmRhdGVWaWV3SXRlbXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIC8v5omT5byA5oiW5YWz6ZetXHJcbiAgICAgICAgICAgIHNjb3BlLnRvZ2dsZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuaXNPcGVuID8gY2xvc2UoKSA6IG9wZW4oKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8v54K55Ye75LqG5bm05Lu96KeG5Zu+XHJcbiAgICAgICAgICAgIHNjb3BlLnNldFllYXIgPSBmdW5jdGlvbihlLCB5ZWFyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUuY3VycmVudFZpZXcgPiBtaW5WaWV3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/liIfmjaLliLDmnIjop4blm75cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXJyZW50VmlldyA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2hvd1ZhbHVlLnNldFllYXIoeWVhcik7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0Vmlld3NJdGVtcygpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5zaG93VmFsdWUuc2V0WWVhcih5ZWFyKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS52YWx1ZSA9IGNvcHlEYXRlKHNjb3BlLnNob3dWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0Vmlld3NJdGVtcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdXRvQ2xvc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuaXNPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy/ngrnlh7vkuobmnIjku73op4blm75cclxuICAgICAgICAgICAgc2NvcGUuc2V0TW9udGggPSBmdW5jdGlvbihlLCBtb250aCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLmN1cnJlbnRWaWV3ID4gbWluVmlldykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8v5YiH5o2i5Yiw5pel6KeG5Zu+XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY3VycmVudFZpZXcgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnNob3dWYWx1ZS5zZXRNb250aChtb250aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0Vmlld3NJdGVtcygpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5zaG93VmFsdWUuc2V0TW9udGgobW9udGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnZhbHVlID0gY29weURhdGUoc2NvcGUuc2hvd1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBzZXRWaWV3c0l0ZW1zKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF1dG9DbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5pc09wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL+eCueWHu+S6huaXpeinhuWbvlxyXG4gICAgICAgICAgICBzY29wZS5zZXREYXRlID0gZnVuY3Rpb24obW9udGgsIGRhdGUpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLnNob3dWYWx1ZSA9IG5ldyBEYXRlKHNjb3BlLnNob3dWYWx1ZS5nZXRGdWxsWWVhcigpLCBtb250aCwgZGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBzY29wZS52YWx1ZSA9IGNvcHlEYXRlKHNjb3BlLnNob3dWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBzZXRWaWV3c0l0ZW1zKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXV0b0Nsb3NlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuaXNPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvL+mAieaLqeS7iuWkqVxyXG4gICAgICAgICAgICBzY29wZS50b2RheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUudmFsdWUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuY3VycmVudFZpZXcgPSBtaW5WaWV3O1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuc2hvd1ZhbHVlID0gY29weURhdGUoc2NvcGUudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgc2V0Vmlld3NJdGVtcygpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGF1dG9DbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmlzT3BlbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy/muIXpmaTmiYDpgIlcclxuICAgICAgICAgICAgc2NvcGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLnZhbHVlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHNjb3BlLnNob3dWYWx1ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5jdXJyZW50VmlldyA9IG1pblZpZXc7XHJcbiAgICAgICAgICAgICAgICBzZXRWaWV3c0l0ZW1zKCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvL+S4iuS4gOmhtVxyXG4gICAgICAgICAgICBzY29wZS5wcmUgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHNjb3BlLmN1cnJlbnRWaWV3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5zaG93VmFsdWUuc2V0WWVhcihzY29wZS5zaG93VmFsdWUuZ2V0RnVsbFllYXIoKSAtIDEyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0Vmlld3NJdGVtcygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnNob3dWYWx1ZS5zZXRZZWFyKHNjb3BlLnNob3dWYWx1ZS5nZXRGdWxsWWVhcigpIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFZpZXdzSXRlbXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5zaG93VmFsdWUuc2V0TW9udGgoc2NvcGUuc2hvd1ZhbHVlLmdldE1vbnRoKCkgLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0Vmlld3NJdGVtcygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8v5LiL5LiA6aG1XHJcbiAgICAgICAgICAgIHNjb3BlLm5leHQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoc2NvcGUuY3VycmVudFZpZXcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnNob3dWYWx1ZS5zZXRZZWFyKHNjb3BlLnNob3dWYWx1ZS5nZXRGdWxsWWVhcigpICsgMTIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRWaWV3c0l0ZW1zKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2hvd1ZhbHVlLnNldFllYXIoc2NvcGUuc2hvd1ZhbHVlLmdldEZ1bGxZZWFyKCkgKyAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0Vmlld3NJdGVtcygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnNob3dWYWx1ZS5zZXRNb250aChzY29wZS5zaG93VmFsdWUuZ2V0TW9udGgoKSArIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRWaWV3c0l0ZW1zKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvL+i/m+WFpeS4i+S4gOe6p+inhuWbvlxyXG4gICAgICAgICAgICBzY29wZS5pbm5lclZpZXcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzY29wZS5jdXJyZW50VmlldyA8IDIgJiYgc2NvcGUuY3VycmVudFZpZXcgPCBtYXhWaWV3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY3VycmVudFZpZXcrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNldFZpZXdzSXRlbXMoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2NvcGUuJHdhdGNoKCd2YWx1ZScsIGZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWwpID09PSBcIltvYmplY3QgRGF0ZV1cIiAmJiAhaXNOYU4odmFsLmdldFRpbWUoKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgeWVhciA9IHZhbC5nZXRGdWxsWWVhcigpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aCA9IHZhbC5nZXRNb250aCgpICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZSA9IHZhbC5nZXREYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZ1bGwgPSBbeWVhciwgbW9udGggPiA5ID8gbW9udGggOiAoJzAnICsgbW9udGgpLCBkYXRlID4gOSA/IGRhdGUgOiAoJzAnICsgZGF0ZSldO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmRpc3BsYXlUZXh0ID0gZnVsbC5yZXZlcnNlKCkuc2xpY2UobWluVmlldykucmV2ZXJzZSgpLmpvaW4oc3BsaXRlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5kaXNwbGF5VGV4dCA9IHBsYWNlSG9sZGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRkb2N1bWVudC5vbignY2xpY2snLCBnbG9iYWxCaW5kKTtcclxuICAgICAgICAgICAgLy/lhYPntKDplIDmr4Eo5Lmf5Y+v55So5L2c55So5Z+fc2NvcGUuJG9uKCdkZXN0b3J5Jykp6ZSA5q+B5pe256e76Zmk5YWo5bGA55qE5LqL5Lu2XHJcbiAgICAgICAgICAgIGVsZW1lbnQub24oJyRkZXN0cm95JywgZ2xvYmFsVW5CaW5kKTtcclxuXHJcbiAgICAgICAgICAgIC8v6L2s5YyW5pe26Ze05a+56LGhXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNvbnZlcnREYXRlKGRhdGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhbmd1bGFyLmlzRGF0ZShkYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHIgPSBkYXRlLnNwbGl0KC8tfFxcLy9naSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZSh0clswXSwgdHJbMV0gLSAxLCB0clsyXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy/miZPlvIBcclxuICAgICAgICAgICAgZnVuY3Rpb24gb3BlbigpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLnNob3dWYWx1ZSA9IGNvcHlEYXRlKHNjb3BlLnZhbHVlKSB8fCBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuaXNPcGVuID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmN1cnJlbnRWaWV3ID0gbWluVmlldztcclxuICAgICAgICAgICAgICAgIHNldFZpZXdzSXRlbXMoKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8v5YWz6ZetXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNsb3NlKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuaXNPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNldFZpZXdzSXRlbXMoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsID0gY29weURhdGUoc2NvcGUuc2hvd1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHZhciB0cnVlVmFsID0gY29weURhdGUoc2NvcGUudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHllYXIgPSB2YWwuZ2V0RnVsbFllYXIoKSxcclxuICAgICAgICAgICAgICAgICAgICBtb250aCA9IHZhbC5nZXRNb250aCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGUgPSB2YWwuZ2V0RGF0ZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWUgPSB2YWwuZ2V0VGltZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoc2NvcGUuY3VycmVudFZpZXcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnRpdGxlU2hvd1ZhbHVlID0gKHllYXIgLSA2KSArICd+JyArICh5ZWFyICsgNSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUudGl0bGVTaG93VmFsdWUgPSB5ZWFyICsgJ+W5tCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUudGl0bGVTaG93VmFsdWUgPSB5ZWFyICsgJ+W5tCcgKyAobW9udGggKyAxKSArICfmnIgnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc3RhcnRSYW5nZVllYXIgPSBzdGFydFJhbmdlID8gc3RhcnRSYW5nZS5nZXRGdWxsWWVhcigpIDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBzdGFydFJhbmdlTW9udGggPSBzdGFydFJhbmdlID8gc3RhcnRSYW5nZS5nZXRNb250aCgpIDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBzdGFydFJhbmdlRGF0ZSA9IHN0YXJ0UmFuZ2UgPyBzdGFydFJhbmdlLmdldERhdGUoKSA6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgZW5kUmFuZ2VZZWFyID0gZW5kUmFuZ2UgPyBlbmRSYW5nZS5nZXRGdWxsWWVhcigpIDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBlbmRSYW5nZU1vbnRoID0gZW5kUmFuZ2UgPyBlbmRSYW5nZS5nZXRNb250aCgpIDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBlbmRSYW5nZURhdGUgPSBlbmRSYW5nZSA/IGVuZFJhbmdlLmdldERhdGUoKSA6IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHllYXJEaXNhYmxlZCA9IChzdGFydFJhbmdlWWVhciAmJiB5ZWFyIDwgc3RhcnRSYW5nZVllYXIpIHx8IChlbmRSYW5nZVllYXIgJiYgeWVhciA+IGVuZFJhbmdlWWVhcik7XHJcbiAgICAgICAgICAgICAgICB2YXIgbW9udGhEaXNhYmxlZCA9IChzdGFydFJhbmdlTW9udGggJiYgbW9udGggPCBzdGFydFJhbmdlTW9udGgpIHx8IChlbmRSYW5nZU1vbnRoICYmIG1vbnRoID4gZW5kUmFuZ2VNb250aCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGFzdE1vbnRoRGlzYWJsZWQgPSAoc3RhcnRSYW5nZU1vbnRoICYmIG1vbnRoIC0gMSA8IHN0YXJ0UmFuZ2VNb250aCkgfHwgKGVuZFJhbmdlTW9udGggJiYgbW9udGggLSAxID4gZW5kUmFuZ2VNb250aCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dE1vbnRoRGlzYWJsZWQgPSAoc3RhcnRSYW5nZU1vbnRoICYmIG1vbnRoICsgMSA8IHN0YXJ0UmFuZ2VNb250aCkgfHwgKGVuZFJhbmdlTW9udGggJiYgbW9udGggKyAxID4gZW5kUmFuZ2VNb250aCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZURpc2FibGVkID0gKHN0YXJ0UmFuZ2VNb250aCAmJiBkYXRlIDwgc3RhcnRSYW5nZU1vbnRoKSB8fCAoZW5kUmFuZ2VNb250aCAmJiBkYXRlID4gZW5kUmFuZ2VNb250aCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICAgICAvL+iuvue9ruW5tOS7vVxyXG4gICAgICAgICAgICAgICAgc2NvcGUueWVhclZpZXdJdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHllYXIgLSA2OyBpIDwgeWVhciArIDY7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnllYXJWaWV3SXRlbXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHQ6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZTogdHJ1ZVZhbCAmJiBpID09PSB0cnVlVmFsLmdldEZ1bGxZZWFyKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiAoc3RhcnRSYW5nZVllYXIgJiYgaSA8IHN0YXJ0UmFuZ2VZZWFyKSB8fCAoZW5kUmFuZ2VZZWFyICYmIGkgPiBlbmRSYW5nZVllYXIpXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy/orr7nva7mnIjku71cclxuICAgICAgICAgICAgICAgIHNjb3BlLm1vbnRoVmlld0l0ZW1zID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMTsgaiA8PSAxMjsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUubW9udGhWaWV3SXRlbXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHQ6IGosXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZTogdHJ1ZVZhbCAmJiBqID09PSB0cnVlVmFsLmdldE1vbnRoKCkgKyAxICYmIHZhbC5nZXRGdWxsWWVhcigpID09PSB0cnVlVmFsLmdldEZ1bGxZZWFyKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiB5ZWFyRGlzYWJsZWQgfHwgKHN0YXJ0UmFuZ2VNb250aCAmJiBqIDwgc3RhcnRSYW5nZU1vbnRoKSB8fCAoZW5kUmFuZ2VNb250aCAmJiBqID4gZW5kUmFuZ2VNb250aClcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvL+iuvue9ruaXpVxyXG4gICAgICAgICAgICAgICAgc2NvcGUuZGF0ZVZpZXdJdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxhc3RNb250aERhdGVDb3VudCA9IG5ldyBEYXRlKG5ldyBEYXRlKHRpbWUpLnNldERhdGUoMCkpLmdldERhdGUoKTtcclxuICAgICAgICAgICAgICAgIHZhciBtb250aERhdGVDb3VudCA9IG5ldyBEYXRlKG5ldyBEYXRlKG5ldyBEYXRlKG5ldyBEYXRlKHRpbWUpLnNldERhdGUoMSkpLnNldE1vbnRoKG1vbnRoICsgMSkpLnNldERhdGUoMCkpLmdldERhdGUoKTtcclxuICAgICAgICAgICAgICAgIHZhciBkYXkgPSBuZXcgRGF0ZShuZXcgRGF0ZSh0aW1lKS5zZXREYXRlKDEpKS5nZXREYXkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBsaSA9IGRheSAtIDE7IGxpID49IDA7IGxpLS0pIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5kYXRlVmlld0l0ZW1zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0OiBsYXN0TW9udGhEYXRlQ291bnQgLSBsaSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc01vbnRoOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6IHZhbC5nZXRNb250aCgpIC0gMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ6IHllYXJEaXNhYmxlZCB8fCBsYXN0TW9udGhEaXNhYmxlZCB8fCAoc3RhcnRSYW5nZURhdGUgJiYgbGkgPCBzdGFydFJhbmdlRGF0ZSkgfHwgKGVuZFJhbmdlRGF0ZSAmJiBsaSA+IGVuZFJhbmdlRGF0ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZTogdHJ1ZVZhbCAmJiBsYXN0TW9udGhEYXRlQ291bnQgLSBsaSA9PT0gdHJ1ZVZhbC5nZXREYXRlKCkgJiYgdmFsLmdldE1vbnRoKCkgPT09IHRydWVWYWwuZ2V0TW9udGgoKSAtIDEgJiYgdmFsLmdldEZ1bGxZZWFyKCkgPT09IHRydWVWYWwuZ2V0RnVsbFllYXIoKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IDE7IGsgPD0gbW9udGhEYXRlQ291bnQ7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmRhdGVWaWV3SXRlbXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHQ6IGssXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNNb250aDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6IHZhbC5nZXRNb250aCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZDogeWVhckRpc2FibGVkIHx8IG1vbnRoRGlzYWJsZWQgfHwgKHN0YXJ0UmFuZ2VEYXRlICYmIGsgPCBzdGFydFJhbmdlRGF0ZSkgfHwgKGVuZFJhbmdlRGF0ZSAmJiBrID4gZW5kUmFuZ2VEYXRlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlOiB0cnVlVmFsICYmIGsgPT09IHRydWVWYWwuZ2V0RGF0ZSgpICYmIHZhbC5nZXRNb250aCgpID09PSB0cnVlVmFsLmdldE1vbnRoKCkgJiYgdmFsLmdldEZ1bGxZZWFyKCkgPT09IHRydWVWYWwuZ2V0RnVsbFllYXIoKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGxrID0gMSwgbGtsID0gc2NvcGUuZGF0ZVZpZXdJdGVtcy5sZW5ndGg7IGxrIDw9IDQyIC0gbGtsOyBsaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuZGF0ZVZpZXdJdGVtcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdDogbGssXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNNb250aDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoOiB2YWwuZ2V0TW9udGgoKSArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiB5ZWFyRGlzYWJsZWQgfHwgbmV4dE1vbnRoRGlzYWJsZWQgfHwgKHN0YXJ0UmFuZ2VEYXRlICYmIGxrIDwgc3RhcnRSYW5nZURhdGUpIHx8IChlbmRSYW5nZURhdGUgJiYgbGsgPiBlbmRSYW5nZURhdGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmU6IHRydWVWYWwgJiYgbGsgPT09IHRydWVWYWwuZ2V0RGF0ZSgpICYmIHZhbC5nZXRNb250aCgpID09PSB0cnVlVmFsLmdldE1vbnRoKCkgKyAxICYmIHZhbC5nZXRGdWxsWWVhcigpID09PSB0cnVlVmFsLmdldEZ1bGxZZWFyKClcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRWaWV3c0l0ZW1zKCk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjb3B5RGF0ZSh2YWwpIHtcclxuICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsKSA9PT0gXCJbb2JqZWN0IERhdGVdXCIgJiYgIWlzTmFOKHZhbC5nZXRUaW1lKCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHZhbC5nZXRUaW1lKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGlzSGFzQ2hpbGQoY2hpbGQsIHBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkID09PSBwYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHdoaWxlIChjaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZCA9PT0gcGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkID0gY2hpbGQucGFyZW50Tm9kZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdsb2JhbEJpbmQoZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IGFuZ3VsYXIuZWxlbWVudChlLnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzSGFzQ2hpbGQodGFyZ2V0WzBdLCBlbGVtZW50WzBdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2xvYmFsVW5CaW5kKCkge1xyXG4gICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9mZignY2xpY2snLCBnbG9iYWxCaW5kKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qIEBuZ0luamVjdCAqL1xyXG4gICAgZnVuY3Rpb24gRGF0ZXBpY2tlckNvbnRyb2xsZXIoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RhdGVwaWNrZXInKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2N0LmRpcmVjdGl2ZXMnLCBbXHJcbiAgICAgICAgJ2N0LmRpcmVjdGl2ZS5zZWxlY3QyJyxcclxuICAgICAgICAnY3QuZGlyZWN0aXZlLndyYXBwZXJDb250ZW50JyxcclxuICAgICAgICAnY3QuZGlyZWN0aXZlLmJyZWFkY3J1bWInLFxyXG4gICAgICAgICdjdC5kaXJlY3RpdmUuZGF0ZXBpY2tlcidcclxuICAgIF0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnY3QuZGlyZWN0aXZlLnNlbGVjdDInLCBbXSlcclxuICAgICAgICAuZGlyZWN0aXZlKCdzZWxlY3QyJywgU2VsZWN0Mik7XHJcblxyXG4gICAgU2VsZWN0Mi4kaW5qZWN0ID0gWyckZG9jdW1lbnQnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBTZWxlY3QyKCRkb2N1bWVudCkge1xyXG4gICAgICAgIC8vIFVzYWdlOiDoh6rlrprkuYlzZWxlY3Tmjqfku7ZcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIENyZWF0ZXM65p2o6aqQ5b2wIDIwMTYvOS83XHJcbiAgICAgICAgLy9cclxuXHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZGlyZWN0aXZlL3NlbGVjdDIuaHRtbCcsXHJcbiAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICAvL+WmguaenOaYr0Dnm7TmjqXmjqXlj5fmqKHmnb/nmoTlrZfnrKbkuLLvvIzlpoLmnpzmmK895qih5p2/5LiN6IO955So5Y+M5ous5Y+377yM55u05o6l5byV5Y+3XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zOiAnPXNlbGVjdDJPcHRpb25zJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiAnPXNlbGVjdDJWYWx1ZScsXHJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogJ0BzZWxlY3QyUGxhY2Vob2xkZXInXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgIC8v56m655m95a2X56ym5LiyXHJcbiAgICAgICAgICAgIHZhciBwbGFjZWhvbGRlciA9IHNjb3BlLnBsYWNlaG9sZGVyIHx8ICfor7fpgInmi6knO1xyXG4gICAgICAgICAgICAvL+aJk+W8gOaIluWFs+mXreeKtuaAgVxyXG4gICAgICAgICAgICBzY29wZS5pc09wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgLy/mmL7npLrlrZfnrKbkuLJcclxuICAgICAgICAgICAgc2NvcGUuZGlzcGxheVRleHQgPSAnJztcclxuICAgICAgICAgICAgLy/miZPlvIDmiJblhbPpl61cclxuICAgICAgICAgICAgc2NvcGUudG9nZ2xlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNjb3BlLmlzT3Blbikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wZW4oKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8v6YCJ5LitXHJcbiAgICAgICAgICAgIHNjb3BlLnNlbGVjdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuaXNPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgndmFsdWUnLCBmdW5jdGlvbihuLCBvKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZm91bmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChzY29wZS5vcHRpb25zLCBmdW5jdGlvbih2LCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHYudmFsdWUgPT09IG4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5kaXNwbGF5VGV4dCA9IHYudGV4dDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmICghZm91bmQpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5kaXNwbGF5VGV4dCA9IHBsYWNlaG9sZGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRkb2N1bWVudC5vbignY2xpY2snLCBnbG9iYWxCaW5kKTtcclxuICAgICAgICAgICAgLy/lhYPntKDplIDmr4Eo5Lmf5Y+v55So5L2c55So5Z+fc2NvcGUuJG9uKCdkZXN0b3J5Jykp6ZSA5q+B5pe256e76Zmk5YWo5bGA55qE5LqL5Lu2XHJcbiAgICAgICAgICAgIGVsZW1lbnQub24oJyRkZXN0cm95JywgZ2xvYmFsVW5CaW5kKTtcclxuXHJcbiAgICAgICAgICAgIC8v5omT5byAXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIG9wZW4oKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5pc09wZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL+WFs+mXrVxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjbG9zZSgpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmlzT3BlbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBpc0hhc0NoaWxkKGNoaWxkLCBwYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZCA9PT0gcGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoY2hpbGQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQgPT09IHBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGNoaWxkLnBhcmVudE5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBnbG9iYWxCaW5kKGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBhbmd1bGFyLmVsZW1lbnQoZS50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpc0hhc0NoaWxkKHRhcmdldFswXSwgZWxlbWVudFswXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5pc09wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBnbG9iYWxVbkJpbmQoKSB7XHJcbiAgICAgICAgICAgICAgICAkZG9jdW1lbnQub2ZmKCdjbGljaycsIGdsb2JhbEJpbmQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QyJyk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdjdC5kaXJlY3RpdmUud3JhcHBlckNvbnRlbnQnLCBbXSlcclxuICAgICAgICAuZGlyZWN0aXZlKCd3cmFwcGVyQ29udGVudCcsIFdyYXBwZXJDb250ZW50KTtcclxuXHJcbiAgICBXcmFwcGVyQ29udGVudC4kaW5qZWN0ID0gWyckd2luZG93J107XHJcblxyXG4gICAgZnVuY3Rpb24gV3JhcHBlckNvbnRlbnQoJHdpbmRvdykge1xyXG4gICAgICAgIC8vIFVzYWdlOiDpobXpnaLlrrnlmahcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIENyZWF0ZXM65p2o6aqQ5b2wIDIwMTYvOS84XHJcbiAgICAgICAgLy9cclxuXHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cIndyYXBwZXItY29udGVudFwiPicgK1xyXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJ3cmFwcGVyLXBhZGRpbmdcIj48L2Rpdj4nICtcclxuICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCwgdHJhbnNjbHVkZUZuKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGN1KCkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5jc3MoJ21pbkhlaWdodCcsICgkd2luZG93LmlubmVySGVpZ2h0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpIC0gNTQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjYWxjdSgpO1xyXG4gICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykub24oJ3Jlc2l6ZScsIGNhbGN1KTtcclxuXHJcbiAgICAgICAgICAgIGVsZW1lbnQub24oJyRkZXN0b3J5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykub2ZmKCdyZXNpemUnLCBjYWxjdSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdHJhbnNjbHVkZUZuKHNjb3BlLCBmdW5jdGlvbihjbG9uZWRUcmFuc2NsdWRlZENvbnRlbnQpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuZmluZCgnZGl2JykuYXBwZW5kKGNsb25lZFRyYW5zY2x1ZGVkQ29udGVudCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd3cmFwcGVyLWNvbnRlbnQnKTtcclxufSkoKTsiLCIvKipcclxuICog6Lev55Sx5Li75qih5Z2XXHJcbiAqIOWMheWQq+aJgOaciei3r+eUseaooeWdl1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0J1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdjdC5jb250cm9sbGVycycsIFsnY3QuY29udHJvbGxlcnMuZXZhbHVhdGUnLCAnY3QuY29udHJvbGxlci5sb2dpbicsICdjdC5jb250cm9sbGVyLnJlZ2lzdCddKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2N0LmZpbHRlcnMnLCBbXSlcclxuICAgICAgICAuZmlsdGVyKCdiZWNvbWUxJywgYmVjb21lMSk7XHJcblxyXG4gICAgZnVuY3Rpb24gYmVjb21lMSgpIHtcclxuICAgICAgICByZXR1cm4gYmVjb21lMUZpbHRlcjtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBiZWNvbWUxRmlsdGVyKFBhcmFtcykge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiYW5ndWxhci5tb2R1bGUoJ2N0LnRlbXBsYXRlcycsIFtdKS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7JHRlbXBsYXRlQ2FjaGUucHV0KCc0MDQuaHRtbCcsJzxoMT5cXHJcXG4gICAgXFx1NjBBOFxcdTYyNDBcXHU4QkJGXFx1OTVFRVxcdTc2ODRcXHU5ODc1XFx1OTc2MlxcdTRFMERcXHU1QjU4XFx1NTcyOFxcdUZGMDFcXHJcXG48L2gxPicpO1xuJHRlbXBsYXRlQ2FjaGUucHV0KCdsYXlvdXQuaHRtbCcsJzxkaXYgY2xhc3M9XCJzaWRlLXBhbmVsXCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XCJuYXYtbWVudS1ib3hcIj5cXHJcXG4gICAgICAgIDx1bCBjbGFzcz1cIm5hdi1tZW51XCI+XFxyXFxuICAgICAgICAgICAgPGxpIGNsYXNzPVwibmF2LXN1Yi1tZW51XCI+XFxyXFxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibmF2LXRpdGxlXCIgaHJlZj1cImphdmFzY3JpcHQ6O1wiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJuYXYtdGl0bGUtaWNvbiBpY29uLWV2YWx1YXRlXCI+PC9zcGFuPlxcdTdEMjBcXHU4RDI4XFx1NkQ0QlxcdThCQzRcXHJcXG4gICAgICAgICAgICAgICAgPC9hPlxcclxcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJuYXYtbWVudVwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibmF2LWl0ZW1cIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSB1aS1zcmVmPVwibWFpbi5ldmFsdWF0ZTptYWtlXCIgdWktc3JlZi1hY3RpdmU9XCJhY3RpdmVcIj5cXHU1MjM2XFx1NEY1Q1xcdTk4OThcXHU3NkVFPC9hPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cIm5hdi1pdGVtXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgdWktc3JlZj1cIm1haW4uZXZhbHVhdGU6c2V0dGluZ3NcIiB1aS1zcmVmLWFjdGl2ZT1cImFjdGl2ZVwiPlxcdTdCQTFcXHU3NDA2XFx1NTQ1OFxcdThCQkVcXHU3RjZFPC9hPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cIm5hdi1pdGVtXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgdWktc3JlZj1cIm1haW4uZXZhbHVhdGU6cGVyc29uYWxcIiB1aS1zcmVmLWFjdGl2ZT1cImFjdGl2ZVwiPlxcdTRFMkFcXHU0RUJBXFx1OEJDNFxcdTZENEI8L2E+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibmF2LWl0ZW1cIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSB1aS1zcmVmPVwibWFpbi5ldmFsdWF0ZTpyZXN1bHRcIiB1aS1zcmVmLWFjdGl2ZT1cImFjdGl2ZVwiPlxcdTZENEJcXHU4QkM0XFx1N0VEM1xcdTY3OUNcXHU2N0U1XFx1OEJFMjwvYT5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XFxyXFxuICAgICAgICAgICAgICAgIDwvdWw+XFxyXFxuICAgICAgICAgICAgPC9saT5cXHJcXG4gICAgICAgIDwvdWw+XFxyXFxuICAgIDwvZGl2PlxcclxcbjwvZGl2PlxcclxcblxcclxcbjxkaXYgY2xhc3M9XCJ3cmFwcGVyLWJvZHlcIiB1aS12aWV3PlxcclxcbjwvZGl2PicpO1xuJHRlbXBsYXRlQ2FjaGUucHV0KCdsb2dpbi5odG1sJywnPGRpdiBuZy1jb250cm9sbGVyPVwiTG9naW5DdHJsXCI+XFxyXFxuICAgIDxpbnB1dCBwbGFjZWhvbGRlcj1cIm5hbWVcIiBuZy1tb2RlbD1cIm5hbWVcIiAvPlxcclxcbiAgICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJwYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiIG5nLW1vZGVsPVwicGFzc3dvcmRcIiAvPlxcclxcbiAgICA8c2VsZWN0MiBzZWxlY3QyLW9wdGlvbnM9XCJvcHRpb25zXCIgc2VsZWN0Mi12YWx1ZT1cInZhbHVlXCI+PC9zZWxlY3QyPlxcclxcbiAgICA8YnV0dG9uIG5nLWNsaWNrPVwibG9naW4oKVwiPlxcdTc2N0JcXHU5NjQ2PC9idXR0b24+XFxyXFxuICAgIDxhIG5nLWhyZWY9XCIjL3JlZ2lzdFwiPlxcdTZDQTFcXHU2NzA5XFx1OEQyNlxcdTUzRjdcXHVGRjFGXFx1NkNFOFxcdTUxOEM8L2E+XFxyXFxuPC9kaXY+Jyk7XG4kdGVtcGxhdGVDYWNoZS5wdXQoJ3JlZ2lzdC5odG1sJywnPGJyZWFkY3J1bWIgYnJlYWRjcnVtYi1kYXRhPVwiW1xcJ1xcdTRFMkFcXHU0RUJBXFx1OEJDNFxcdTZENEJcXCcsXFwnXFx1NEUyQVxcdTRFQkFcXHU3RDIwXFx1OEQyOFxcdTZENEJcXHU4QkM0XFwnXVwiPjwvYnJlYWRjcnVtYj5cXHJcXG48d3JhcHBlci1jb250ZW50PlxcclxcbiAgICA8aDQ+XFx1OEJGN1xcdTZDRThcXHU1MThDIDxzbWFsbD4gPGEgaHJlZj1cIiMvbG9naW4gXCI+XFx1OEZENFxcdTU2REVcXHU3NjdCXFx1OTY0NjwvYT48L3NtYWxsPjwvaDQ+XFxyXFxuICAgIDxpbnB1dCBwbGFjZWhvbGRlcj1cIm5hbWUgXCIgbmctbW9kZWw9XCJuYW1lIFwiIC8+XFxyXFxuICAgIDxpbnB1dCBwbGFjZWhvbGRlcj1cInBhc3N3b3JkIFwiIHR5cGU9XCJwYXNzd29yZCBcIiBuZy1tb2RlbD1cInBhc3N3b3JkIFwiIC8+XFxyXFxuICAgIDxidXR0b24+XFx1NkNFOFxcdTUxOEM8L2J1dHRvbj5cXHJcXG48L3dyYXBwZXItY29udGVudD4nKTtcbiR0ZW1wbGF0ZUNhY2hlLnB1dCgnZGlyZWN0aXZlL2JyZWFkY3J1bWIuaHRtbCcsJzxkaXYgY2xhc3M9XCJicmVhZGNydW1iLWJveFwiPlxcclxcbiAgICA8c3BhbiBuZy1yZXBlYXQ9XCJpdGVtIGluIGl0ZW1zXCI+XFxyXFxuICAgICAgICB7e2l0ZW19fVxcclxcbiAgICAgICAgPHNwYW4gbmctaWY9XCJpdGVtcy5sZW5ndGggIT09ICRpbmRleCArIDFcIj4mZ3Q7PC9zcGFuPlxcclxcbiAgICA8L3NwYW4+XFxyXFxuPC9kaXY+Jyk7XG4kdGVtcGxhdGVDYWNoZS5wdXQoJ2RpcmVjdGl2ZS9kYXRlcGlja2VyLmh0bWwnLCc8ZGl2IGNsYXNzPVwiZGF0ZXBpY2tlci13cmFwcGVyXCIgbmctY2xhc3M9XCJ7b3Blbjppc09wZW59XCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XCJkYXRlcGlja2VyLXdyYXBwZXItZGlzcGxheVwiIG5nLWNsaWNrPVwidG9nZ2xlKClcIj5cXHJcXG4gICAgICAgIDwhLS08aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIlxcdThCRjdcXHU5MDA5XFx1NjJFOS4uLlwiIHZhbHVlPVwie3tkaXNwbGF5VGV4dH19XCIgLz4tLT5cXHJcXG4gICAgICAgIDxkaXY+e3tkaXNwbGF5VGV4dH19PC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVwiZGF0ZXBpY2tlci13cmFwcGVyLWRyb3Bkb3duXCIgbmctc2hvdz1cImlzT3BlblwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cImRhdGVwaWNrZXItaGVhZGVyXCI+XFxyXFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkYXRlcGlja2VyLXByZVwiIG5nLWNsaWNrPVwicHJlKClcIj4mbHQ7PC9zcGFuPlxcclxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZGF0ZXBpY2tlci10aXRsZVwiIG5nLWNsaWNrPVwiaW5uZXJWaWV3KClcIj57e3RpdGxlU2hvd1ZhbHVlfX08L3NwYW4+XFxyXFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkYXRlcGlja2VyLW5leHRcIiBuZy1jbGljaz1cIm5leHQoKVwiPiZndDs8L3NwYW4+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlcGlja2VyLXllYXItdmlld1wiIG5nLXNob3c9XCJjdXJyZW50VmlldyA9PT0gMlwiPlxcclxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaXRlbVwiIG5nLWNsYXNzPVwie2FjdGl2ZTppdGVtLmFjdGl2ZSxkaXNhYmxlZDppdGVtLmRpc2FibGVkfVwiIG5nLWNsaWNrPVwiIWl0ZW0uZGlzYWJsZWQmJnNldFllYXIoJGV2ZW50LCBpdGVtLnQpXCIgbmctcmVwZWF0PVwiaXRlbSBpbiB5ZWFyVmlld0l0ZW1zXCI+e3tpdGVtLnR9fTwvc3Bhbj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cImRhdGVwaWNrZXItbW9udGgtdmlld1wiIG5nLXNob3c9XCJjdXJyZW50VmlldyA9PT0gMVwiPlxcclxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaXRlbVwiIG5nLWNsYXNzPVwie2FjdGl2ZTppdGVtLmFjdGl2ZSxkaXNhYmxlZDppdGVtLmRpc2FibGVkfVwiIG5nLWNsaWNrPVwiIWl0ZW0uZGlzYWJsZWQmJnNldE1vbnRoKCRldmVudCxpdGVtLnQtMSlcIiBuZy1yZXBlYXQ9XCJpdGVtIGluIG1vbnRoVmlld0l0ZW1zXCI+e3tpdGVtLnR9fVxcdTY3MDg8L3NwYW4+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlcGlja2VyLWRhdGUtdmlld1wiIG5nLXNob3c9XCJjdXJyZW50VmlldyA9PT0gMFwiPlxcclxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGVcIj5cXHU2NUU1PC9zcGFuPlxcclxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGVcIj5cXHU0RTAwPC9zcGFuPlxcclxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGVcIj5cXHU0RThDPC9zcGFuPlxcclxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGVcIj5cXHU0RTA5PC9zcGFuPlxcclxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGVcIj5cXHU1NkRCPC9zcGFuPlxcclxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGVcIj5cXHU0RTk0PC9zcGFuPlxcclxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGVcIj5cXHU1MTZEPC9zcGFuPlxcclxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaXRlbVwiIG5nLWNsaWNrPVwiIWl0ZW0uZGlzYWJsZWQmJnNldERhdGUoaXRlbS5tb250aCxpdGVtLnQpXCIgbmctY2xhc3M9XCJ7bGlnaHRlcjohaXRlbS50aGlzTW9udGgsYWN0aXZlOml0ZW0uYWN0aXZlLGRpc2FibGVkOml0ZW0uZGlzYWJsZWR9XCIgbmctcmVwZWF0PVwiaXRlbSBpbiBkYXRlVmlld0l0ZW1zIHRyYWNrIGJ5ICRpbmRleFwiPnt7aXRlbS50fX08L3NwYW4+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlLXBpY2tlci1mb290ZXJcIj5cXHJcXG4gICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJcIiBuZy1jbGljaz1cInRvZGF5KClcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIFxcdTRFQ0FcXHU1OTI5XFxyXFxuICAgICAgICAgICAgICAgIDwvYT5cXHJcXG4gICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJ0ZXh0LXJlZFwiIG5nLWNsaWNrPVwiY2xlYXIoKVwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgXFx1NkUwNVxcdTk2NjRcXHJcXG4gICAgICAgICAgICAgICAgPC9hPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbjwvZGl2PicpO1xuJHRlbXBsYXRlQ2FjaGUucHV0KCdkaXJlY3RpdmUvc2VsZWN0Mi5odG1sJywnPGRpdiBjbGFzcz1cInNlbGVjdC13cmFwcGVyXCIgbmctY2xhc3M9XCJ7b3Blbjppc09wZW59XCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XCJzZWxlY3Qtd3JhcHBlci1kaXNwbGF5XCIgbmctY2xpY2s9XCJ0b2dnbGUoKVwiPlxcclxcbiAgICAgICAgPCEtLTxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiXFx1OEJGN1xcdTkwMDlcXHU2MkU5Li4uXCIgdmFsdWU9XCJ7e2Rpc3BsYXlUZXh0fX1cIiAvPi0tPlxcclxcbiAgICAgICAgPGRpdj57e2Rpc3BsYXlUZXh0fX08L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XCJzZWxlY3Qtd3JhcHBlci1kcm9wZG93blwiIG5nLXNob3c9XCJpc09wZW5cIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzZWxlY3Qtd3JhcHBlci1kcm9wZG93bi1pdGVtXCIgbmctY2xhc3M9XCJ7c2VsZWN0ZWQ6by52YWx1ZSA9PT0gdmFsdWV9XCIgbmctY2xpY2s9XCJzZWxlY3Qoby52YWx1ZSlcIiBuZy1yZXBlYXQ9XCJvIGluIG9wdGlvbnNcIj57e28udGV4dH19PC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbjwvZGl2PicpO1xuJHRlbXBsYXRlQ2FjaGUucHV0KCdldmFsdWF0ZS9pbmRleC5odG1sJywnPGJyZWFkY3J1bWIgYnJlYWRjcnVtYi1kYXRhPVwiW1xcJ1xcdTdEMjBcXHU4RDI4XFx1NkQ0QlxcdThCQzRcXCddXCI+PC9icmVhZGNydW1iPlxcclxcbjx3cmFwcGVyLWNvbnRlbnQ+XFxyXFxuICAgIDxoND5cXHJcXG4gICAgICAgIFxcdThGRDlcXHU2NjJGXFx1N0QyMFxcdThEMjhcXHU2RDRCXFx1OEJDNFxcdTVGMTVcXHU1QkZDXFx1OEJGNFxcdTY2MEVcXHU5ODc1XFx1OTc2MlxcclxcbiAgICA8L2g0Plxcclxcbjwvd3JhcHBlci1jb250ZW50PicpO1xuJHRlbXBsYXRlQ2FjaGUucHV0KCdldmFsdWF0ZS9tYWtlLmh0bWwnLCc8YnJlYWRjcnVtYiBicmVhZGNydW1iLWRhdGE9XCJbXFwnXFx1OTg5OFxcdTVFOTNcXCddXCI+PC9icmVhZGNydW1iPlxcclxcbjx3cmFwcGVyLWNvbnRlbnQ+XFxyXFxuICAgIDxkaXYgY2xhc3M9XCJzZWFyY2gtdG9vbGJveFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ1wiPlxcclxcbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXBpbmtcIiBuZy1jbGljaz1cInNob3dVcGxvYWRNb2RhbCh0cnVlKVwiPlxcclxcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJ0bi1pY29uIGljb24tdXBsb2FkXCI+PC9zcGFuPlxcclxcbiAgICAgICAgICAgICAgICBcXHU0RTBBXFx1NEYyMFxcdTk4OThcXHU1RTkzXFxyXFxuICAgICAgICAgICAgPC9idXR0b24+XFxyXFxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0blwiPlxcclxcbiAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJidG4taWNvbiBpY29uLXVwbG9hZFwiPjwvc3Bhbj5cXHJcXG4gICAgICAgICAgICAgICAgXFx1NEUwQVxcdTRGMjBcXHU4QkExXFx1N0I5N1xcdTg5QzRcXHU1MjE5XFxyXFxuICAgICAgICAgICAgPC9idXR0b24+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgIDwhLS1cXHU0RTBBXFx1NEYyMFxcdTk4OThcXHU1RTkzbW9kYWwtLT5cXHJcXG4gICAgPGRpdiBjbGFzcz1cIm1vZGFsXCIgbmctY2xhc3M9XCJ7c2hvdzppc1Nob3dVcGxvYWRNb2RhbH1cIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCIgc3R5bGU9XCJoZWlnaHQ6NDI2cHg7d2lkdGg6NjQwcHg7bWFyZ2luLWxlZnQ6LTMyMHB4O21hcmdpbi10b3A6LTIxM3B4O1wiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNsb3NlXCIgbmctY2xpY2s9XCJzaG93VXBsb2FkTW9kYWwoZmFsc2UpXCI+XFxyXFxuXFxyXFxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNsb3NlLWljb25cIj48L3NwYW4+IFxcdTUxNzNcXHU5NUVEXFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtdGl0bGVcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIFxcdTRFMEFcXHU0RjIwXFx1OTg5OFxcdTc2RUVcXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm9mZi10IG9mZi1iIG9mZi1sLXMgb2ZmLXJcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLWZvcm0gZnMtMTZcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cIndpZHRoOjZlbVwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC1vcmFuZ2VcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XFx1OTg5OFxcdTc2RUVcXHU1NDBEXFx1NzlGMFxcdUZGMUFcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NjAyN1xcdTY4M0NcXHU2MDI3XFx1NTQxMVxcdTZENEJcXHU4QkQ1PC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiYWxpZ24tdG9wXCI+PHNwYW4gY2xhc3M9XCJ0ZXh0LW9yYW5nZVwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cXHU5ODk4XFx1NzZFRVxcdTYzQ0ZcXHU4RkYwXFx1RkYxQTwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzPVwiZm9ybS1jXCIgc3R5bGU9XCJoZWlnaHQ6MTYwcHg7cmVzaXplOm5vbmU7XCI+PC90ZXh0YXJlYT5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48c3BhbiBjbGFzcz1cInRleHQtb3JhbmdlXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxcdTY1ODdcXHU0RUY2XFx1OTAwOVxcdTYyRTlcXHVGRjFBPC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWNcIiBzdHlsZT1cIndpZHRoOjM5MnB4OyBkaXNwbGF5OmlubGluZS1ibG9jaztcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXBpbmsgYnRuLWZpeC1zaXplXCI+XFx1NkQ0RiZuYnNwOyZuYnNwO1xcdTg5Qzg8L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXJcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1maXgtc2l6ZVwiPlxcdTRFMEEmbmJzcDsmbmJzcDtcXHU0RjIwPC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgIDwhLS1cXHU2Q0ExXFx1NjcwOVxcdTY1NzBcXHU2MzZFXFx1NjVGNlxcdTYzRDBcXHU3OTNBLS0+XFxyXFxuICAgIDxkaXYgY2xhc3M9XCJvZmYtdCBmcy0xNiBvZmYtbC1zXCI+XFxyXFxuICAgICAgICBcXHU4RkQ4XFx1NkNBMVxcdTY3MDlcXHU4ODY4XFx1NjgzQ1xcdTY1NzBcXHU2MzZFXFx1NTRFNlxcdUZGMENcXHU4QkY3XFx1NTE0OFxcdTRFMEFcXHU0RjIwXFx1OTg5OFxcdTVFOTN+XFxyXFxuICAgIDwvZGl2Plxcclxcbjwvd3JhcHBlci1jb250ZW50PicpO1xuJHRlbXBsYXRlQ2FjaGUucHV0KCdldmFsdWF0ZS9wZXJzb25hbC5odG1sJywnPGJyZWFkY3J1bWIgYnJlYWRjcnVtYi1kYXRhPVwiW1xcJ1xcdTRFMkFcXHU0RUJBXFx1OEJDNFxcdTZENEJcXCddXCI+PC9icmVhZGNydW1iPlxcclxcbjx3cmFwcGVyLWNvbnRlbnQ+XFxyXFxuICAgIDxkaXYgY2xhc3M9XCJzZWFyY2gtdG9vbGJveFwiPlxcclxcbiAgICAgICAgPGxhYmVsIGNsYXNzPVwic2VhcmNoLXRvb2xib3gtbGFiZWxcIj5cXHU2N0U1XFx1OEJFMlxcdTY3NjFcXHU0RUY2PC9sYWJlbD5cXHJcXG5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzZWFyY2gtdG9vbGJveC1mb3JtXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ1wiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJsYWJlbFwiPlxcdTdEMjBcXHU4RDI4XFx1OEJDNFxcdTZENEJcXHU1NDBEXFx1NzlGMFxcdUZGMUE8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWNcIiAvPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwibGFiZWxcIj5cXHU3RDIwXFx1OEQyOFxcdThCQzRcXHU2RDRCXFx1NzJCNlxcdTYwMDFcXHVGRjFBPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPHNlbGVjdDIgc2VsZWN0Mi12YWx1ZT1cIjFcIiBzZWxlY3QyLW9wdGlvbnM9XCJbe3RleHQ6XFwnXFx1NjcyQVxcdThCQzRcXHU2RDRCXFwnLHZhbHVlOjF9LHt0ZXh0OlxcJ1xcdTVERjJcXHU4QkM0XFx1NkQ0QlxcJyx2YWx1ZToyfV1cIj48L3NlbGVjdDI+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ1wiPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1maXgtc2l6ZVwiPlxcclxcbiAgICAgICAgICAgICAgICBcXHU2N0U1Jm5ic3A7Jm5ic3A7XFx1OEJFMlxcclxcbiAgICAgICAgICAgIDwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsIG9mZi10XCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRlclwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtdGl0bGVcIj5cXHU3RDIwXFx1OEQyOFxcdThCQzRcXHU2RDRCXFx1NTIxN1xcdTg4Njg8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxcclxcbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZVwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBjbGFzcz1cImZpcnN0XCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cImZpcnN0XCI+XFx1NUU4RlxcdTUzRjc8L3RoPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+XFx1N0QyMFxcdThEMjhcXHU4QkM0XFx1NkQ0QlxcdTU0MERcXHU3OUYwPC90aD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlxcdTVGMDBcXHU1OUNCXFx1NjVGNlxcdTk1RjQ8L3RoPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+XFx1OEJDNFxcdTZENEJcXHU2NUY2XFx1OTVGNDwvdGg+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5cXHU4QkM0XFx1NkQ0QlxcdThGREJcXHU1RUE2PC90aD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlxcdTcyQjZcXHU2MDAxPC90aD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzPVwibGFzdFwiPlxcdTY0Q0RcXHU0RjVDPC90aD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4xPC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTYwMjdcXHU2ODNDXFx1NTAzRVxcdTU0MTFcXHU2RDRCXFx1OEJENTwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4yMDE2LTA0LTA3PC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjIwMTYtMDQtMjIgMTA6MjI6MjI8L3RkPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+MS80NTwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU2NzJBXFx1NUI4Q1xcdTYyMTA8L3RkPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJsYXN0XCI+XFx1NUYwMFxcdTU5Q0JcXHU4QkM0XFx1NkQ0QjwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4xPC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTYwMjdcXHU2ODNDXFx1NTAzRVxcdTU0MTFcXHU2RDRCXFx1OEJENTwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4yMDE2LTA0LTA3PC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjIwMTYtMDQtMjIgMTA6MjI6MjI8L3RkPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+MS80NTwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU2NzJBXFx1NUI4Q1xcdTYyMTA8L3RkPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJsYXN0XCI+XFx1NUYwMFxcdTU5Q0JcXHU4QkM0XFx1NkQ0QjwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4xPC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTYwMjdcXHU2ODNDXFx1NTAzRVxcdTU0MTFcXHU2RDRCXFx1OEJENTwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4yMDE2LTA0LTA3PC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjIwMTYtMDQtMjIgMTA6MjI6MjI8L3RkPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+MS80NTwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU2NzJBXFx1NUI4Q1xcdTYyMTA8L3RkPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJsYXN0XCI+XFx1NUYwMFxcdTU5Q0JcXHU4QkM0XFx1NkQ0QjwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHIgY2xhc3M9XCJsYXN0XCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4xPC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTYwMjdcXHU2ODNDXFx1NTAzRVxcdTU0MTFcXHU2RDRCXFx1OEJENTwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4yMDE2LTA0LTA3PC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjIwMTYtMDQtMjIgMTA6MjI6MjI8L3RkPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+MS80NTwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU2NzJBXFx1NUI4Q1xcdTYyMTA8L3RkPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJsYXN0XCI+XFx1NUYwMFxcdTU5Q0JcXHU4QkM0XFx1NkQ0QjwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XFxyXFxuICAgICAgICAgICAgICAgIDwvdGFibGU+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuPC93cmFwcGVyLWNvbnRlbnQ+Jyk7XG4kdGVtcGxhdGVDYWNoZS5wdXQoJ2V2YWx1YXRlL3Jlc3VsdC5odG1sJywnPGJyZWFkY3J1bWIgYnJlYWRjcnVtYi1kYXRhPVwiW1xcJ1xcdTY3RTVcXHU4QkUyXFx1N0VEM1xcdTY3OUNcXCddXCI+PC9icmVhZGNydW1iPlxcclxcbjxkaXYgd3JhcHBlci1jb250ZW50PlxcclxcbiAgICA8ZGl2IGNsYXNzPVwic2VhcmNoLXRvb2xib3hcIj5cXHJcXG4gICAgICAgIDxsYWJlbCBjbGFzcz1cInNlYXJjaC10b29sYm94LWxhYmVsXCI+XFx1NjdFNVxcdThCRTJcXHU2NzYxXFx1NEVGNjwvbGFiZWw+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVwic2VhcmNoLXRvb2xib3gtZm9ybVwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwibGFiZWxcIj5cXHU1OUQzXFx1NTQwRFxcdUZGMUE8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWNcIiBuZy1tb2RlbD1cInNlYXJjaFBhcmFtcy5uYW1lXCIgLz5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1nXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImxhYmVsXCI+XFx1NEVCQVxcdTU0NThcXHU5MDA5XFx1NjJFOVxcdUZGMUE8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8c2VsZWN0MiBzZWxlY3QyLXZhbHVlPVwic2VhcmNoUGFyYW1zLnBlb3BsZVwiIHNlbGVjdDItb3B0aW9ucz1cIlt7dGV4dDpcXCdcXHU4NDYzXFx1NEU4QlxcdTk1N0ZcXCcsdmFsdWU6MX0se3RleHQ6XFwnXFx1NzlEOFxcdTRFNjZcXCcsdmFsdWU6Mn1dXCI+PC9zZWxlY3QyPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwibGFiZWxcIj5cXHU3RDIwXFx1OEQyOFxcdThCQzRcXHU2RDRCXFx1NzJCNlxcdTYwMDFcXHVGRjFBPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPHNlbGVjdDIgc2VsZWN0Mi12YWx1ZT1cInNlYXJjaFBhcmFtcy5zdGF0ZVwiIHNlbGVjdDItb3B0aW9ucz1cIlt7dGV4dDpcXCdcXHU2NzJBXFx1OEJDNFxcdTZENEJcXCcsdmFsdWU6MX0se3RleHQ6XFwnXFx1NURGMlxcdThCQzRcXHU2RDRCXFwnLHZhbHVlOjJ9XVwiPjwvc2VsZWN0Mj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1nXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImxhYmVsXCI+XFx1OEJDNFxcdTZENEJcXHU2NUU1XFx1NjcxRlxcdUZGMUE8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8ZGF0ZXBpY2tlciBzdGFydC1yYW5nZT1cIjIwMTYtOS0xXCIgdmFsdWU9XCJzZWFyY2hQYXJhbXMudGVzdFRpbWVCZWdpblwiPjwvZGF0ZXBpY2tlcj5cXHJcXG4gICAgICAgICAgICAgICAgLVxcclxcbiAgICAgICAgICAgICAgICA8ZGF0ZXBpY2tlciB2YWx1ZT1cInNlYXJjaFBhcmFtcy50ZXN0VGltZUVuZFwiPjwvZGF0ZXBpY2tlcj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1nXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWZpeC1zaXplXCIgbmctY2xpY2s9XCJzZWFyY2goKVwiPlxcclxcbiAgICAgICAgICAgICAgICBcXHU2N0U1Jm5ic3A7Jm5ic3A7XFx1OEJFMlxcclxcbiAgICAgICAgICAgIDwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcblxcclxcbiAgICA8ZGl2IGNsYXNzPVwib2ZmLXRcIj5cXHJcXG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXBpbmtcIj5cXHJcXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJidG4taWNvbiBpY29uLWV4cG9ydFwiPjwvc3Bhbj5cXHJcXG4gICAgICAgICAgICAgICAgXFx1NUJGQ1xcdTUxRkFcXHU4ODY4XFx1NjgzQ1xcclxcbiAgICAgICAgICAgIDwvYnV0dG9uPlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cInBhbmVsIG9mZi10XCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGVyXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLXRvb2xib3hcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJ0ZXh0LWJsdWVcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKCk7XCI+XFx1NjVCMFxcdTU4OUVcXHU3QkExXFx1NzQwNlxcdTU0NTg8L2E+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XFxyXFxuICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGVcIj5cXHJcXG4gICAgICAgICAgICAgICAgPHRoZWFkPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiZmlyc3RcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJmaXJzdFwiPlxcdTU0NThcXHU1REU1XFx1N0YxNlxcdTUzRjc8L3RoPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5cXHU1NDU4XFx1NURFNVxcdTU5RDNcXHU1NDBEPC90aD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+XFx1NEUyRFxcdTVGQzMvXFx1NEU4QlxcdTRFMUFcXHU5MEU4L1xcdTU5MjdcXHU1MzNBL1xcdTUyMDZcXHU5MEU4PC90aD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+XFx1ODA0Q1xcdTRGNEQ8L3RoPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cImxhc3RcIj5cXHU2NENEXFx1NEY1QzwvdGg+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxcclxcbiAgICAgICAgICAgICAgICA8L3RoZWFkPlxcclxcbiAgICAgICAgICAgICAgICA8dGJvZHk+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8dHI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjEwMjM0Njc3PC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1N0Y1N1xcdTgzMUNcXHU4MzFDPC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NTZGRFxcdTdGOEVcXHU5NkM2XFx1NTZFMi9cXHU5NkM2XFx1NTZFMlxcdTYwM0JcXHU5MEU4L1xcdTRGRTFcXHU2MDZGXFx1NjI4MFxcdTY3MkZcXHU1MjZGXFx1NjAzQlxcdTg4QzEvXFx1NUYwMlxcdTU3MzBcXHU0RkUxXFx1NjA2RlxcdTRFMkRcXHU1RkMzL1xcdTRFQTdcXHU1NEMxXFx1OTg3OVxcdTc2RUVcXHU5MEU4PC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NEVBN1xcdTU0QzFcXHU3RUNGXFx1NzQwNjwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibGFzdFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cInRleHQtcGluayB0YWJsZS1vcGVyYXRlXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKTtcIj5cXHU2N0U1XFx1NzcwQjwvYT5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJ0ZXh0LXJlZCB0YWJsZS1vcGVyYXRlXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKTtcIj5cXHU5MTREXFx1N0Y2RVxcdTY3NDNcXHU5NjUwPC9hPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cInRleHQtYmx1ZSB0YWJsZS1vcGVyYXRlXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKTtcIj5cXHU1MjIwXFx1OTY2NDwvYT5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPC90cj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDx0ciBjbGFzcz1cImxhc3RcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+MTAyMzQ2Nzc8L3RkPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU2Nzk3XFx1NjVCOVxcdTRFNjY8L3RkPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU1NkZEXFx1N0Y4RVxcdTk2QzZcXHU1NkUyL1xcdTk2QzZcXHU1NkUyXFx1NjAzQlxcdTkwRTgvXFx1NEZFMVxcdTYwNkZcXHU2MjgwXFx1NjcyRlxcdTUyNkZcXHU2MDNCXFx1ODhDMS9cXHU1RjAyXFx1NTczMFxcdTRGRTFcXHU2MDZGXFx1NEUyRFxcdTVGQzMvXFx1NEVBN1xcdTU0QzFcXHU5ODc5XFx1NzZFRVxcdTkwRTg8L3RkPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU0RUE3XFx1NTRDMVxcdTdFQ0ZcXHU3NDA2PC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJsYXN0XCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwidGV4dC1waW5rIHRhYmxlLW9wZXJhdGVcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApO1wiPlxcdTY3RTVcXHU3NzBCPC9hPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cInRleHQtcmVkIHRhYmxlLW9wZXJhdGVcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApO1wiPlxcdTkxNERcXHU3RjZFXFx1Njc0M1xcdTk2NTA8L2E+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwidGV4dC1ibHVlIHRhYmxlLW9wZXJhdGVcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApO1wiPlxcdTUyMjBcXHU5NjY0PC9hPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxcclxcblxcclxcbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxcclxcbiAgICAgICAgICAgIDwvdGFibGU+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuPC9kaXY+Jyk7XG4kdGVtcGxhdGVDYWNoZS5wdXQoJ2V2YWx1YXRlL3NldHRpbmdzLmh0bWwnLCc8YnJlYWRjcnVtYiBicmVhZGNydW1iLWRhdGE9XCJbXFwnXFx1N0JBMVxcdTc0MDZcXHU1NDU4XFx1OEJCRVxcdTdGNkVcXCddXCI+PC9icmVhZGNydW1iPlxcclxcbjx3cmFwcGVyLWNvbnRlbnQ+XFxyXFxuICAgIDxkaXYgY2xhc3M9XCJzZWFyY2gtdG9vbGJveFwiPlxcclxcbiAgICAgICAgPGxhYmVsIGNsYXNzPVwic2VhcmNoLXRvb2xib3gtbGFiZWxcIj5cXHU2N0U1XFx1OEJFMlxcdTY3NjFcXHU0RUY2PC9sYWJlbD5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzZWFyY2gtdG9vbGJveC1mb3JtXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ1wiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJsYWJlbFwiPlxcdTU0NThcXHU1REU1XFx1NTlEM1xcdTU0MERcXHVGRjFBPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jXCIgLz5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1nXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImxhYmVsXCI+XFx1NTQ1OFxcdTVERTVcXHU3RjE2XFx1NTNGN1xcdUZGMUE8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWNcIiAvPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZml4LXNpemVcIj5cXHJcXG4gICAgICAgICAgICAgICAgXFx1NjdFNSZuYnNwOyZuYnNwO1xcdThCRTJcXHJcXG4gICAgICAgICAgICA8L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBvZmYtdFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkZXJcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLXRvb2xib3hcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwidGV4dC1ibHVlXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgpO1wiPlxcdTY1QjBcXHU1ODlFXFx1N0JBMVxcdTc0MDZcXHU1NDU4PC9hPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxcclxcbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZVwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBjbGFzcz1cImZpcnN0XCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cImZpcnN0XCI+XFx1NTQ1OFxcdTVERTVcXHU3RjE2XFx1NTNGNzwvdGg+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5cXHU1NDU4XFx1NURFNVxcdTU5RDNcXHU1NDBEPC90aD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlxcdTRFMkRcXHU1RkMzL1xcdTRFOEJcXHU0RTFBXFx1OTBFOC9cXHU1OTI3XFx1NTMzQS9cXHU1MjA2XFx1OTBFODwvdGg+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5cXHU4MDRDXFx1NEY0RDwvdGg+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cImxhc3RcIj5cXHU2NENEXFx1NEY1QzwvdGg+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+MTAyMzQ2Nzc8L3RkPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1N0Y1N1xcdTgzMUNcXHU4MzFDPC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTU2RkRcXHU3RjhFXFx1OTZDNlxcdTU2RTIvXFx1OTZDNlxcdTU2RTJcXHU2MDNCXFx1OTBFOC9cXHU0RkUxXFx1NjA2RlxcdTYyODBcXHU2NzJGXFx1NTI2RlxcdTYwM0JcXHU4OEMxL1xcdTVGMDJcXHU1NzMwXFx1NEZFMVxcdTYwNkZcXHU0RTJEXFx1NUZDMy9cXHU0RUE3XFx1NTRDMVxcdTk4NzlcXHU3NkVFXFx1OTBFODwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU0RUE3XFx1NTRDMVxcdTdFQ0ZcXHU3NDA2PC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibGFzdFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJ0ZXh0LXBpbmsgdGFibGUtb3BlcmF0ZVwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoKTtcIj5cXHU2N0U1XFx1NzcwQjwvYT5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwidGV4dC1yZWQgdGFibGUtb3BlcmF0ZVwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoKTtcIj5cXHU5MTREXFx1N0Y2RVxcdTY3NDNcXHU5NjUwPC9hPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJ0ZXh0LWJsdWUgdGFibGUtb3BlcmF0ZVwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoKTtcIj5cXHU1MjIwXFx1OTY2NDwvYT5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBjbGFzcz1cImxhc3RcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjEwMjM0Njc3PC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTY3OTdcXHU2NUI5XFx1NEU2NjwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU1NkZEXFx1N0Y4RVxcdTk2QzZcXHU1NkUyL1xcdTk2QzZcXHU1NkUyXFx1NjAzQlxcdTkwRTgvXFx1NEZFMVxcdTYwNkZcXHU2MjgwXFx1NjcyRlxcdTUyNkZcXHU2MDNCXFx1ODhDMS9cXHU1RjAyXFx1NTczMFxcdTRGRTFcXHU2MDZGXFx1NEUyRFxcdTVGQzMvXFx1NEVBN1xcdTU0QzFcXHU5ODc5XFx1NzZFRVxcdTkwRTg8L3RkPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NEVBN1xcdTU0QzFcXHU3RUNGXFx1NzQwNjwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImxhc3RcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwidGV4dC1waW5rIHRhYmxlLW9wZXJhdGVcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKCk7XCI+XFx1NjdFNVxcdTc3MEI8L2E+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cInRleHQtcmVkIHRhYmxlLW9wZXJhdGVcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKCk7XCI+XFx1OTE0RFxcdTdGNkVcXHU2NzQzXFx1OTY1MDwvYT5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwidGV4dC1ibHVlIHRhYmxlLW9wZXJhdGVcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKCk7XCI+XFx1NTIyMFxcdTk2NjQ8L2E+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXHJcXG5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XFxyXFxuICAgICAgICAgICAgICAgIDwvdGFibGU+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuPC93cmFwcGVyLWNvbnRlbnQ+Jyk7fV0pOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnY3QuY29udHJvbGxlcnMuZXZhbHVhdGUnLCBbXHJcbiAgICAgICAgJ2N0LmNvbnRyb2xsZXIuZXZhbHVhdGUubWFrZScsXHJcbiAgICAgICAgJ2N0LmNvbnRyb2xsZXIuZXZhbHVhdGUucmVzdWx0J1xyXG4gICAgXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdjdC5jb250cm9sbGVyLmV2YWx1YXRlLm1ha2UnLCBbXSlcclxuICAgICAgICAuY29udHJvbGxlcignRXZhbHVhdGVNYWtlQ3RybCcsIEV2YWx1YXRlTWFrZUN0cmwpO1xyXG5cclxuICAgIEV2YWx1YXRlTWFrZUN0cmwuJGluamVjdCA9IFsnJHNjb3BlJ107XHJcblxyXG4gICAgZnVuY3Rpb24gRXZhbHVhdGVNYWtlQ3RybCgkc2NvcGUpIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLmlzU2hvd1VwbG9hZE1vZGFsID0gZmFsc2U7XHJcbiAgICAgICAgJHNjb3BlLnNob3dVcGxvYWRNb2RhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5pc1Nob3dVcGxvYWRNb2RhbCA9IHN0YXRlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2N0LmNvbnRyb2xsZXIuZXZhbHVhdGUucmVzdWx0JywgW10pXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0V2YWx1YXRlUmVzdWx0Q3RybCcsIEV2YWx1YXRlUmVzdWx0Q3RybCk7XHJcblxyXG5cclxuICAgIEV2YWx1YXRlUmVzdWx0Q3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHRpbWVvdXQnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBFdmFsdWF0ZVJlc3VsdEN0cmwoJHNjb3BlLCAkdGltZW91dCkge1xyXG4gICAgICAgICRzY29wZS5zZWFyY2hQYXJhbXMgPSB7XHJcbiAgICAgICAgICAgIHRlc3RUaW1lQmVnaW46IG51bGwsXHJcbiAgICAgICAgICAgIHRlc3RUaW1lRW5kOiBudWxsLFxyXG4gICAgICAgICAgICBwZW9wbGU6IG51bGwsXHJcbiAgICAgICAgICAgIHN0YXRlOiBudWxsLFxyXG4gICAgICAgICAgICBuYW1lOiAnJ1xyXG4gICAgICAgIH1cclxuICAgICAgICAkc2NvcGUuc2VhcmNoID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KCdzZWFyY2g6XFxuJyArIEpTT04uc3RyaW5naWZ5KCRzY29wZS5zZWFyY2hQYXJhbXMpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiLyoqXHJcbiAqIGluZGV46Lev55Sx5qih5Z2XXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnXHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2N0LmNvbnRyb2xsZXIubG9naW4nLCBbXSlcclxuICAgICAgICAuY29udHJvbGxlcignTG9naW5DdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUpIHtcclxuICAgICAgICAgICAgJHNjb3BlLm5hbWUgPSAnJztcclxuICAgICAgICAgICAgJHNjb3BlLnBhc3N3b3JkID0gJyc7XHJcbiAgICAgICAgICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJHNjb3BlLm5hbWUgKyAn55m76ZmG5LqGJyArICRzY29wZS52YWx1ZSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUub3B0aW9ucyA9IFtcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ+acquivhOa1iycsIHZhbHVlOiAxIH0sXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICflt7Lor4TmtYsnLCB2YWx1ZTogMiB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAn5bey5pS+5byDJywgdmFsdWU6IDMgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ+W3sumAmui/hycsIHZhbHVlOiA0IH1cclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgJHNjb3BlLnZhbHVlID0gMTtcclxuICAgICAgICB9XSk7XHJcbn0pKCk7IiwiLyoqXHJcbiAqIGluZGV46Lev55Sx5qih5Z2XXHJcbiAqL1xyXG5cclxuO1xyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCdcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnY3QuY29udHJvbGxlci5yZWdpc3QnLCBbXSlcclxuICAgICAgICAuY29udHJvbGxlcignUmVnaXN0Q3RybCcsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5uYW1lID0gJyc7XHJcbiAgICAgICAgICAgICRzY29wZS5wYXNzd29yZCA9ICcnO1xyXG4gICAgICAgIH1dKTtcclxuXHJcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
