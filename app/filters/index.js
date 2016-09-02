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