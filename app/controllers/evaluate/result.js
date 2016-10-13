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