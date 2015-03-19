(function() {
    function FilterController($scope, $filter, $timeout) {
        var self = this;
        var settings = $scope.htAdvancedFilter;
        var elements = settings.data;
        var filteredData = settings.filteredData;

        self.fields = [{name: "Wszędzie", value: "$"}];
        self.fields = self.fields.concat(settings.fields);
        self.select = angular.isDefined(settings.select) ? settings.select : [];
        self.filters = angular.isDefined(settings.filters) ? settings.filters : [];

        self.filterTypes = [
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

        self.add = add;
        self.update = update;
        self.remove = remove;

        filter();

        if (settings.filterActive) {
            add();
        }


        $scope.$watch(function() {return elements;}, function(newVal, oldVal) {
            if (newVal == oldVal)
                return;
            filterData();
        }, true);

        function transformFilter(filters) {
            var result = {};

            var count = filters.length;
            for (var i = 0; i < count; ++i) {
                var filter = filters[i];

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
            }

            return result;
        }

        function addSelectFilters(filters) {
            var selectFilters = self.select;
            var countFilters = selectFilters.length;

            for (var i = 0; i < countFilters; ++i) {
                var filter = selectFilters[i];
                var countOptions = filter.options.length;

                for (var j = 0; j < countOptions; ++j) {
                    var option = filter.options[j];

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
                }
            }

            return filters;
        }

        function getFlatObjects(object) {
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
        }

        var timeout = null;
        function filterData() {
            if (timeout) {
                $timeout.cancel(timeout);
            }
            timeout = $timeout(filter, 500);
        }

        function buildObject(key, value, object, objectKey) {
            var index = key.indexOf('.');

            if (index === -1) {
                if (objectKey) {
                    if (typeof object[objectKey] === 'undefined')  object[objectKey] = {};
                    object[objectKey][key] = value;
                } else {
                    object[key] = value;
                }
            } else {
                var currentKey = key.split('.', 1)[0];
                var nextKey = key.substr(index + 1);
                if (objectKey) {
                    if (typeof object[objectKey] === 'undefined') object[objectKey] = {};
                    object = object[objectKey];
                }
                buildObject(nextKey, value, object, currentKey);
            }
        }

        function convertValue(object) {
            var result = {};
            var keys = Object.keys(object);

            for (var i = 0, count = keys.length; i < count; i++) {
                buildObject(keys[i], object[keys[i]], result);
            }

            return result;
        }

        function filter() {
            var data = elements.slice();
            var filters = transformFilter(self.filters);
            filters = addSelectFilters(filters);

            for (var key in filters) {
                if (!filters.hasOwnProperty(key)) continue;

                var value = filters[key];
                value = getFlatObjects(value);
                if (value.length === 1) {
                    value[0] = convertValue(value[0]);
                    data = $filter(key)(data, value[0]);
                } else {
                    var result = [];
                    var valueLength = value.length;
                    for (var i = 0; i < valueLength; i++) {
                        result = result.concat($filter(key)(data, value[i]));
                    }

                    for (i = 0; i < result.length; i++) {
                        for (var j = i + 1; j < result.length; j++) {
                            if (result[i] == result[j]) {
                                result.splice(j--, 1);
                            }
                        }
                    }
                    data = result;
                }
            }

            filteredData.length = 0;
            for (var l = 0; l < data.length; l++) {
                filteredData.push(data[l]);
            }
        }


        function update() {
            filterData();
        }

        function remove(index) {
            self.filters.splice(index, 1);
            filter();
        }

        function add() {
            self.filters.push({
                filter: self.filterTypes[0].value,
                field: '$',
                value: ''
            });
        }
    }

    function FilterDirective() {
        return {
            require: '^ngModel',
            scope: {
                htAdvancedFilter: '='
            },
            controllerAs: 'filter',
            templateUrl: 'advanced-filter.html',
            controller: FilterController
        };
    }

    function GreaterThanOrEqualToFilter(filterFilter) {
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
    }

    function LessThanOrEqualToFilter(filterFilter) {
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
    }

    function FocusDirective() {
        return function (scope, element) {
            element[0].focus();
        };
    }

    angular.module('ht.advanced-filter', ['ui.bootstrap'])
        .directive('htAdvancedFilter', FilterDirective)
        .directive('htFocus', FocusDirective)
        .filter('greaterThanOrEqualTo', GreaterThanOrEqualToFilter)
        .filter('lessThanOrEqualTo', LessThanOrEqualToFilter);
})();
