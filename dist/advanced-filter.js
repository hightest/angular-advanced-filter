/*!
 * angular-ht-advanced-filter
 * https://github.com/hightest/angular-advanced-filter
 * Version: 0.0.1 - 2015-01-18T12:47:22.371Z
 * License: 
 */


angular.module('ht.advanced-filter', ['ui.bootstrap'])

.directive('htAdvancedFilter', function() {
    return {
        require: '^ngModel',
        scope: {
            htAdvancedFilter: '='
        },
        templateUrl: 'advanced-filter.html',
        controller: function($scope, $filter) {
            var settings = $scope.htAdvancedFilter;
            var elements = settings.data;
            var originalData = angular.copy(elements);
            $scope.fields = [{name: "Wszędzie", value: "$"}];
            $scope.fields = $scope.fields.concat(settings.fields);
            $scope.select = settings.select;
            $scope.filters = angular.isDefined(settings.filters) ? settings.filters : [];

            $scope.filterTypes = [
                {
                    'name': 'Szukaj w',
                    'value': 'filter'
                },
                {
                    'name': 'Mniejszy od',
                    'value': 'lessThanOrEqualTo'
                },
                {
                    'name': 'Większy od',
                    'value': 'greaterThanOrEqualTo'
                }
            ];

            $scope.add = function() {
                $scope.filters.push({
                    filter: $scope.filterTypes[0].value,
                    field: '$',
                    value: ''
                });
            };

            var transformFilter = function (filters) {
                var result = {};
                angular.forEach(filters, function(filter) {
                    if (filter.value.length) {
                        if (angular.isUndefined(result[filter.filter])) {
                            result[filter.filter] = {};
                        }
                        result[filter.filter][filter.field] = filter.value;
                    }
                });

                return result;
            };

            var addSelectFilters = function(filters) {
                var selectFilters = $scope.select;

                angular.forEach(selectFilters, function(filter) {
                    if (angular.isDefined(filter.selected) && filter.selected !== null) {
                        var filterName = filter.selected.type;
                        var filterField = filter.selected.field;
                        var filterValue = filter.selected.value;

                        if (!angular.isDefined(filters[filterName])) {
                            filters[filterName] = {};
                        }
                        filters[filterName][filterField] = filterValue;
                    }
                });
                return filters;
            };

            var filterData = function() {
                var data = angular.copy(originalData);
                var filters = transformFilter($scope.filters);
                filters = addSelectFilters(filters);
                angular.forEach(filters, function (value, key) {
                    data = $filter(key)(data, value);
                });
                angular.copy(data, elements);
            };

            $scope.$watch('filters', function(newValue, oldValue) {
                if (oldValue == newValue)
                    return;

                filterData();
            }, true);

            $scope.$watch('select', function(newVal, oldVal) {
                if (oldVal == newVal)
                    return;
                filterData();
            }, true);

            $scope.remove = function(index) {
                $scope.filters.splice(index, 1);
            };

            filterData();
        }
    };
})

.filter('greaterThanOrEqualTo', function(filterFilter) {
    return function(input, minValue) {
        return filterFilter(input, minValue, function(actual, expected) {
            var isNumber = function(value) {
                return !isNaN(parseFloat(value));
            };

            if (isNumber(actual) && isNumber(expected)) {
                return actual >= expected;
            }

            return false;
        });
    };
})

.filter('lessThanOrEqualTo', function(filterFilter) {
    return function(input, minValue) {
        return filterFilter(input, minValue, function(actual, expected) {
            var isNumber = function(value) {
                return !isNaN(parseFloat(value));
            };

            if (isNumber(actual) && isNumber(expected)) {
                return actual <= expected;
            }

            return false;
        });
    };
});

angular.module("ht.advanced-filter").run(["$templateCache", function($templateCache) {$templateCache.put("advanced-filter.html","<div><div class=\"form-inline\" ng-repeat=\"filter in filters\"><div class=\"form-group\"><select class=\"form-control\" ng-model=\"filter.filter\" ng-options=\"filterType.value as filterType.name for filterType in filterTypes\"></select></div><div class=\"form-group\"><select class=\"form-control\" ng-model=\"filter.field\" ng-options=\"field.value as field.name for field in fields\"></select></div><div class=\"form-group\"><input class=\"form-control\" type=\"text\" ng-model=\"filter.value\"></div><div class=\"form-group\"><span class=\"glyphicon glyphicon-remove-circle\" ng-click=\"remove($index)\"></span></div></div><button type=\"button\" class=\"btn btn-default\" ng-click=\"add()\">Dodaj filtr</button></div><h4 ng-repeat-start=\"field in select\">{{field.name}}</h4><div class=\"btn-group\" ng-repeat-end=\"\"><label ng-repeat=\"option in field.options\" class=\"btn btn-success\" ng-model=\"field.selected\" btn-radio=\"option\" uncheckable=\"\">{{option.name}}</label></div>");}]);