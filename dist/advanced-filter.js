/*!
 * angular-ht-advanced-filter
 * https://github.com/hightest/angular-advanced-filter
 * Version: 0.0.1 - 2015-02-18T08:09:50.183Z
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
        controller: function($scope, $filter, $timeout) {
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
                        if (angular.isDefined(result[filter.filter][filter.field])) {
                            if (!Array.isArray(result[filter.filter][filter.field])) {
                                result[filter.filter][filter.field] = [result[filter.filter][filter.field]];
                            }
                            result[filter.filter][filter.field].push(filter.value);
                        } else {
                            result[filter.filter][filter.field] = filter.value;
                        }
                    }
                });

                return result;
            };

            var addSelectFilters = function(filters) {
                var selectFilters = $scope.select;

                angular.forEach(selectFilters, function(filter) {
                    angular.forEach(filter.options, function(option) {
                        if (angular.isDefined(option.selected) && option.selected) {
                            var filterName = option.type;
                            var filterField = option.field;
                            var filterValue = option.value;

                            if (!angular.isDefined(filters[filterName])) {
                                filters[filterName] = {};
                            }
                            if (angular.isDefined(filters[filterName][filterField]) && (filters[filterName][filterField].length > 0 || angular.isNumber(filters[filterName][filterField]))) {
                                if (!Array.isArray(filters[filterName][filterField])) {
                                    filters[filterName][filterField] = [filters[filterName][filterField]];
                                }
                                filters[filterName][filterField].push(filterValue);
                            } else {
                                filters[filterName][filterField] = filterValue;
                            }
                        }
                    });
                });
                return filters;
            };

            var getFlatObjects = function (object) {
                var elements = [];
                angular.forEach(object, function(value, key) {
                    if (Array.isArray(value)) {
                        angular.forEach(value, function(datum) {
                            var flatObject = angular.copy(object);
                            flatObject[key] = datum;
                            elements = elements.concat(getFlatObjects(flatObject));
                        });
                    }
                });
                if (elements.length === 0) {
                    elements.push(object);
                }
                return elements;
            };

            var timeoutPromise;
            var filterData = function() {
                if (timeoutPromise) {
                    $timeout.cancel(timeoutPromise);
                }
                timeoutPromise = $timeout(filter, 500);
            };

            var filter = function() {
                var data = angular.copy(elements);
                var filters = transformFilter($scope.filters);
                filters = addSelectFilters(filters);
                angular.forEach(filters, function (value, key) {
                    value = getFlatObjects(value);
                    if (value.length === 1) {
                        data = $filter(key)(data, value[0]);
                    } else {
                        var result = [];
                        angular.forEach(value, function(datum) {
                            result = result.concat($filter(key)(data, datum));
                        });

                        for (var i = 0; i < result.length; i++) {
                            for (var j = i + 1; j < result.length; j++) {
                                if (result[i] == result[j]) {
                                    result.splice(j--, 1);
                                }
                            }
                        }
                        data = result;
                    }
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

angular.module("ht.advanced-filter").run(["$templateCache", function($templateCache) {$templateCache.put("advanced-filter.html","<div><div class=\"form-inline\" ng-repeat=\"filter in filters\"><div class=\"form-group\"><select class=\"form-control\" ng-model=\"filter.filter\" ng-options=\"filterType.value as filterType.name for filterType in filterTypes\"></select></div><div class=\"form-group\"><select class=\"form-control\" ng-model=\"filter.field\" ng-options=\"field.value as field.name for field in fields\"></select></div><div class=\"form-group\"><input class=\"form-control\" type=\"text\" ng-model=\"filter.value\"></div><div class=\"form-group\"><span class=\"glyphicon glyphicon-remove-circle\" ng-click=\"remove($index)\"></span></div></div><button type=\"button\" class=\"btn btn-default\" ng-click=\"add()\">Dodaj filtr</button></div><h4 ng-repeat-start=\"field in select\">{{field.name}}</h4><div class=\"btn-group\" ng-repeat-end=\"\"><label ng-repeat=\"option in field.options\" class=\"btn btn-success\" ng-model=\"option.selected\" btn-radio=\"1\" btn-checkbox=\"\">{{option.name}}</label></div>");}]);