angular.module('ht.advanced-filter', [])

.directive('htAdvancedFilter', function() {
    return {
        require: '^ngModel',
        scope: {
            htAdvancedFilter: '=',
            ngModel: '='
        },
        templateUrl: 'advanced-filter.html',
        controller: function($scope, $filter) {
            var elements = $scope.ngModel;
            var settings = $scope.htAdvancedFilter;
            $scope.ngModel = elements;
            $scope.fields = [{name: "Wszędzie", field: "$"}];
            $scope.fields = $scope.fields.concat(settings.fields);

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

            $scope.filters = [];

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
            $scope.$watch('filters', function(newValue, oldValue) {
                if (oldValue == newValue)
                    return;

                var data = angular.copy(elements);
                var filters = transformFilter(newValue);
                angular.forEach(filters, function (value, key) {
                    data = $filter(key)(data, value);
                });
                $scope.ngModel = data;
            }, true);

            $scope.remove = function(index) {
                $scope.filters.splice(index, 1);
            };
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
