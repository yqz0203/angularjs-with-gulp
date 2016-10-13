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