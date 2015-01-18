angular.module('ht.advanced-filter', ['ui.bootstrap'])

.directive('htAdvancedFilter', function() {
    return {
        require: '^ngModel',
        scope: {
            htAdvancedFilter: '='
        },
        templateUrl: 'advanced-filter.html',
        controller: function($scope, $filter) {
            var self = this;
            var settings = $scope.htAdvancedFilter;
            var elements = settings.data;
            var filteredData = settings.filteredData;
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

            $scope.$watch(function() {return elements;}, function(newVal, oldVal) {
                if (newVal == oldVal)
                    return;
                filterData();
            }, true);

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
                var data = angular.copy(elements);
                var filters = transformFilter($scope.filters);
                filters = addSelectFilters(filters);
                angular.forEach(filters, function (value, key) {
                    data = $filter(key)(data, value);
                });
                angular.copy(data, filteredData);
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
