angular.module('demo', ['ht.advanced-filter']).controller('DemoCtrl', function ($scope) {
    $scope.clients = [
        {name: "Moroni", age: 50},
        {name: "Tiancum", age: 43},
        {name: "Jacob", age: 27},
        {name: "Nephi", age: 29},
        {name: "Enos", age: 34},
        {name: "Tiancum", age: 43},
        {name: "Jacob", age: 27},
        {name: "Nephi", age: 29},
        {name: "Enos", age: 34},
        {name: "Tiancum", age: 43},
        {name: "Jacob", age: 27},
        {name: "Nephi", age: 29},
        {name: "Enos", age: 34},
        {name: "Tiancum", age: 43},
        {name: "Jacob", age: 27},
        {name: "Nephi", age: 29},
        {name: "Enos", age: 34}
    ];
    $scope.filterSettings = {
        fields: [
            {name: "Imię", value: "name"},
            {name: "Wiek", value: "age"}
        ],
        data: $scope.clients,
        filteredData: [],
        select: [
            {
                name: "W wieku",
                options: [
                    {name: "50 lat", field: "age", value: 50, type: "filter"},
                    {name: "34 lat", field: "age", value: 34, type: "filter"}
                ]
            }
        ],
        filters: [
            {field: "age", value: "50", filter: "filter"}
        ]
    };
});
