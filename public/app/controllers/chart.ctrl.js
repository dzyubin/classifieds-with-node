(function () {

    "use strict";

angular
    .module('classifieds')
    .controller('ChartCtrl',
    ['$rootScope', '$scope', '$mdToast', 'ClassifiedsDB',
        function ($rootScope, $scope, $mdToast, ClassifiedsDB) {

            $scope.ClassifiedsDBService = new ClassifiedsDB(null, null, null, 1);
            $scope.ClassifiedsDBService.nextPage()
                .success(function () {

                    /*
                     **
                     *   Classifieds Prices Chart
                     */

                    /*var data = $rootScope.classifieds.map(function (obj) {
                        var mappedObj = {};
                        //var date = new Date(obj.created);
                        mappedObj.date = obj.created.split('T')[0];
                        mappedObj.open = (obj.price + 200).toString();
                        mappedObj.high = (obj.price + 300).toString();
                        mappedObj.low = obj.price.toString();
                        mappedObj.close = (obj.price + 100).toString();

                        return mappedObj;

                    });

                    AmCharts.shortMonthNames = [
                        'Січ',
                        'Лют',
                        'Бер',
                        'Кві',
                        'Тра',
                        'Чер',
                        'Лип',
                        'Сер',
                        'Вер',
                        'Жов',
                        'Лис',
                        'Гру'
                    ];

                    AmCharts.makeChart("classifiedsPricesChart",
                        {
                            "type": "serial",
                            "categoryField": "date",
                            "categoryAxis": {
                                "parseDates": true
                            },
                            "chartCursor": {
                                "enabled": true
                            },
                            "chartScrollbar": {
                                "enabled": true,
                                "graph": "g1",
                                "graphType": "line",
                                "scrollbarHeight": 30
                            },
                            "trendLines": [],
                            "graphs": [
                                {
                                    "balloonText": "На початок:<b>[[open]]</b><br>Найнижча:<b>[[low]]</b><br>Найвища:<b>[[high]]</b><br>На кінець:<b>[[close]]</b><br>",
                                    "closeField": "close",
                                    "fillAlphas": 0.9,
                                    "fillColors": "#7f8da9",
                                    "highField": "high",
                                    "id": "g1",
                                    "lineColor": "#7f8da9",
                                    "lowField": "low",
                                    "negativeFillColors": "#db4c3c",
                                    "negativeLineColor": "#db4c3c",
                                    "openField": "open",
                                    "title": "Price:",
                                    "type": "candlestick",
                                    "valueField": "close"
                                }
                            ],
                            "guides": [],
                            "valueAxes": [
                                {
                                    "id": "ValueAxis-1"
                                }
                            ],
                            "allLabels": [],
                            "balloon": {},
                            "titles": [],
                            "dataProvider": data
                        }
                    );*/


                    AmCharts.shortMonthNames = [
                        'Січ',
                        'Лют',
                        'Бер',
                        'Кві',
                        'Тра',
                        'Чер',
                        'Лип',
                        'Сер',
                        'Вер',
                        'Жов',
                        'Лис',
                        'Гру'
                    ];

                    /*
                    **
                    *   Classifieds Count Chart
                     */
                    var chartData = $rootScope.classifieds.map(function (obj) {
                        var mappedObj = {};

                        //todo: function setTimeToZero()
                        obj.created = new Date(obj.created);
                        obj.created.setSeconds(0);
                        obj.created.setMinutes(0);
                        obj.created.setHours(0);
                        obj.created = obj.created.toString();

                        mappedObj.date = obj.created;

                        return mappedObj;

                    });

                    var classifiedsCreationDates = _.uniqBy(chartData, 'date');
                    classifiedsCreationDates.forEach(function (elemOuter) {
                        elemOuter.classifiedsCount = 0;
                        chartData.forEach(
                            //todo: function increaseClassifiedsCount()
                            function (elem) {
                                if (elem.date === elemOuter.date) {
                                    elemOuter.classifiedsCount += 1;
                                }
                            }
                        );
                    });

                    var chart = new AmCharts.AmSerialChart();
                    chart.dataProvider = chartData;
                    chart.categoryField = "date";
                    chart.startDuration = 1;
                    chart.sequencedAnimation = false;
                    chart.categoryAxis = {
                        parseDates: true
                    };
                    chart.chartCursor = {
                        "enabled": true
                    };
                    chart.chartScrollbar = {
                        "enabled": true,
                        "graph": "g1",
                        "graphType": "line",
                        "scrollbarHeight": 30
                    };

                    var graph = new AmCharts.AmGraph();
                    graph.id = "g1";
                    graph.valueField = "classifiedsCount";
                    graph.type = "column";
                    graph.fillAlphas = 0.8;
                    graph.balloonText = "[[category]]: <b>[[value]]</b> оголош.";

                    chart.addGraph(graph);

                    chart.angle = 30;
                    chart.depth3D = 10;

                    chart.write('classifiedsCountChart');


                    /*
                     **
                     *   Classifieds Prices Chart
                     */
                    console.log($rootScope.classifieds);
                    var chartDataPrices = $rootScope.classifieds.map(function (obj) {
                        var mappedObj = {};

                        //todo: function setTimeToZero()
                        obj.created = new Date(obj.created);
                        obj.created.setSeconds(0);
                        obj.created.setMinutes(0);
                        obj.created.setHours(0);
                        obj.created = obj.created.toString();

                        mappedObj.date = obj.created;

                        //mappedObj.open = 10;
                        mappedObj.price = obj.price;

                        return mappedObj;

                    });

                    var classifiedsCreationDatesPrices = _.uniqBy(chartDataPrices, 'date');

                   /* var dataProvider = $rootScope.classifieds.map(function (classified) {
                        var mappedObj = {};

                        //mappedObj.date = classified.created;
                        //mappedObj.close = classified.high;

                        return mappedObj;
                    });*/

                    classifiedsCreationDatesPrices.forEach(function (value) {
                        value.close = 0;
                        value.open = 100000;

                        angular.forEach(chartDataPrices, function (classified) {
                            if (value.date === classified.date) {
                                if (value.close < classified.price) {
                                    value.close = classified.price;
                                }
                                if (value.open > classified.price) {
                                    value.open = classified.price;
                                }
                            }
                        });
                    });

                    console.log(chartDataPrices);

                    angular.forEach(classifiedsCreationDatesPrices, function (value, key) {
                        console.log(value.date);
                        console.log(value.close);
                        console.log(value.open);
                    });

                    console.log($rootScope.classifieds);

                    console.log(chartDataPrices);

                    AmCharts.makeChart( "classifiedsPricesChart", {
                        "type": "serial",
                        "theme": "light",
                        "dataProvider": chartDataPrices
/*                            [ {
                            "name": "Income A",
                            "open": 0,
                            "close": 11.13,
                            "color": "#54cb6a",
                            "balloonValue": 11.13
                        } ]*/,
                        "valueAxes": [ {
                            "axisAlpha": 0,
                            "gridAlpha": 0.1,
                            "position": "left"
                        } ],
                        "startDuration": 1,
                        "graphs": [
                            {
                                "id": "g1",
                                "balloonText": "<span>[[category]]</span><br>Найвища ціна: <b>[[close]]</b><br>Найнижча ціна: <b>[[open]]</b>",
                                "colorField": "color",
                                "fillAlphas": 0.8,
                                "labelText": "[[balloonValue]]",
                                "lineColor": "#BBBBBB",
                                "openField": "open",
                                "type": "column",
                                "valueField": "close"
                            },
                            {

                            }
                        ],
                        "columnWidth": 0.6,
                        "categoryField": "date",
                        "categoryAxis": {
                            "gridPosition": "start",
                            "axisAlpha": 0,
                            "gridAlpha": 0.1,
                            "parseDates": true
                        },
                        "chartCursor": {
                            "enabled": true
                        },
                        "chartScrollbar": {
                            "enabled": true,
                            "graphType": "line",
                            "scrollbarHeight": 30
                        },
                        "export": {
                            "enabled": true
                        }
                    } );

                })
                .error(function (error) {
                    showToast('Не вдалося отримати дані. Спробуйте ще раз');
                });

            function showToast(message) {
                $mdToast.show(
                    $mdToast.simple()
                        .content(message)
                        .position('top, right')
                        .hideDelay(3000)
                );
            }
        }]);
}());