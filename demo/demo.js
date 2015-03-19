angular.module('demo', ['ht.advanced-filter', 'ht.table']).controller('DemoCtrl', function ($scope, $timeout) {
    $scope.clients = [];
    for(var i = 0; i < 200; i++) {
        $scope.clients.push({
            name: 'name' + i,
            age: i,
            details: {nick: 'nick' + i}
        });
    }
    //$scope.clients = [
    //    {name: "Moroni", age: 50, details: {nick: 'mike_p98'}},
    //    {name: "Tiancum", age: 43},
    //    {name: "Jacob", age: 27, details: {nick: 'elephoante'}},
    //    {name: "Nephi", age: 29, details: {nick: 'kornlos'}},
    //    {name: "Enos", age: 34, details: {nick: 'coc'}},
    //    {name: "Tiancum", age: 43, details: {nick: 'cesdr'}},
    //    {name: "Jacob", age: 27, details: {nick: 'mike_pl98'}},
    //    {name: "Nephi", age: 29, details: {nick: 'mike_pl98'}},
    //    {name: "Enos", age: 34, details: {nick: 'mike_pl98'}},
    //    {name: "Tiancum", age: 43, details: {nick: 'mike_pl98'}},
    //    {name: "Jacob", age: 27, details: {nick: 'mike_pl98'}},
    //    {name: "Nephi", age: 29, details: {nick: 'mike_pl98'}},
    //    {name: "Enos", age: 34, details: {nick: 'mike_pl98'}},
    //    {name: "Tiancum", age: 43, details: {nick: 'mike_pl98'}},
    //    {name: "Jacob", age: 27, details: {nick: 'mike_pl98'}},
    //    {name: "Nephi", age: 29, details: {nick: 'mike_pl98'}},
    //    {name: "Enos", age: 34, details: {nick: 'mike_pl98'}}
    //];

    var fields = [
        {name: "Imię", value: "name"},
        {name: "Wiek", value: "age"},
        {name: "Nick", value: "details.nick", visible: false}
    ];

    var filtered = [];

    $scope.filterSettings = {
        fields: fields,
        data: $scope.clients,
        filteredData: filtered,
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
        ],
        filterActive: true
    };

    $scope.tableSettings = {
        data: filtered,
        fields: fields
    };
});
