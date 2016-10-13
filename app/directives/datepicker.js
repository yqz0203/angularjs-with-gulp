(function() {
    'use strict';

    angular
        .module('ct.directive.datepicker', [])
        .directive('datepicker', Datepicker)

    Datepicker.$inject = ['$document', 'documentDelegate'];

    function Datepicker($document, documentDelegate) {
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
                value: "=model",
                spliter: '@',
                placeholder: '@',
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
            var placeHolder = scope.placeholder === undefined ? '请选择日期' : scope.placeholder;
            //选择后自动关闭
            var autoClose = scope.autoClose || false;
            //最小视图
            var minView = scope.minView !== undefined ? Number(scope.minView) : 0;
            //最大视图
            var maxView = scope.minView !== undefined ? Number(scope.maxView) : 2;
            //区间
            var startRange = convertDate(scope.startRange),
                endRange = convertDate(scope.endRange, true);

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
                var now = new Date();
                //不设置时分秒，防止异常情况
                scope.value = new Date(now.getFullYear(), now.getMonth(), now.getDate());
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

            documentDelegate.on('click', globalBind);
            //元素销毁(也可用作用域scope.$on('destory'))销毁时移除全局的事件
            element.on('$destroy', globalUnBind);

            //转化时间对象
            //@params {date:时间字符串或者对象, isEnd:是否是结束时间}
            function convertDate(date, isEnd) {
                if (date) {
                    if (!angular.isDate(date)) {
                        var tr = date.split(/-|\//gi);
                        if (tr[2] === undefined) {
                            if (isEnd) {
                                tr[1] = Number(tr[1]) + 1;
                                tr[2] = 0;
                            } else {
                                tr[2] = 1;
                            }
                        } else if (tr[1] === undefined) {
                            tr[1] = 1;
                            if (isEnd) {
                                tr[2] = 0;
                            } else {
                                tr[2] = 1;
                            }
                        }
                        return new Date(tr[0], tr[1] - 1, tr[2]);
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
                    time = val.getTime(),
                    trueYear = trueVal && trueVal.getFullYear(),
                    trueMonth = trueVal && trueVal.getMonth(),
                    trueDate = trueVal && trueVal.getDate(),
                    trueTime = trueVal && trueVal.getTime();

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

                var temp;
                var startRangeYearTime = new Date(startRangeYear, 0, 1),
                    startRangeMonthTime = new Date(startRangeYear, startRangeMonth, 1),
                    startRangeDateTime = new Date(startRangeYear, startRangeMonth, startRangeDate),
                    endRangeYearTime = new Date(endRangeYear, 0, 1),
                    endRangeMonthTime = new Date(endRangeYear, endRangeMonth, 1),
                    endRangeDateTime = new Date(endRangeYear, endRangeMonth, endRangeDate);
                //设置年份
                scope.yearViewItems = [];
                for (var i = year - 6; i < year + 6; i++) {
                    temp = new Date(i, 0, 1);
                    scope.yearViewItems.push({
                        t: i,
                        active: trueVal && i === trueYear,
                        disabled: (startRangeYear && temp < startRangeYearTime) || (endRangeYear && temp > endRangeYearTime)
                    });
                }

                //设置月份
                scope.monthViewItems = [];
                for (var j = 1; j <= 12; j++) {
                    temp = new Date(year, j - 1, 1);
                    scope.monthViewItems.push({
                        t: j,
                        active: trueVal && j === trueMonth + 1 && year === trueYear,
                        disabled: (startRangeMonth && temp < startRangeMonthTime) || (endRangeMonth && temp > endRangeMonthTime)
                    });
                }

                //设置日
                scope.dateViewItems = [];
                var lastMonthDateCount = new Date(new Date(time).setDate(0)).getDate();
                var monthDateCount = new Date(new Date(new Date(new Date(time).setDate(1)).setMonth(month + 1)).setDate(0)).getDate();
                var day = new Date(new Date(time).setDate(1)).getDay();

                for (var li = day - 1; li >= 0; li--) {
                    temp = new Date(year, month - 1, lastMonthDateCount - li);
                    scope.dateViewItems.push({
                        t: lastMonthDateCount - li,
                        thisMonth: false,
                        month: month - 1,
                        disabled: (startRangeDate && temp < startRangeDateTime) || (endRangeDate && temp > endRangeDateTime),
                        active: trueVal && lastMonthDateCount - li === trueDate && month === trueMonth - 1 && year === trueYear
                    });
                }
                for (var k = 1; k <= monthDateCount; k++) {
                    temp = new Date(year, month, k);
                    scope.dateViewItems.push({
                        t: k,
                        thisMonth: true,
                        month: month,
                        disabled: (startRangeDate && temp < startRangeDateTime) || (endRangeDate && temp > endRangeDateTime),
                        active: trueVal && k === trueDate && month === trueMonth && year === trueYear

                    });
                }
                for (var lk = 1, lkl = scope.dateViewItems.length; lk <= 42 - lkl; lk++) {
                    temp = new Date(year, month + 1, lk);
                    scope.dateViewItems.push({
                        t: lk,
                        thisMonth: false,
                        month: month + 1,
                        disabled: (startRangeDate && temp < startRangeDateTime) || (endRangeDate && temp > endRangeDateTime),
                        active: trueVal && lk === trueDate && month === trueMonth + 1 && year === trueYear
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
            }

            function globalUnBind() {
                documentDelegate.off('click', globalBind);
            }
        }
    }
    /* @ngInject */
    function DatepickerController() {

    }

    document.createElement('datepicker');
})();