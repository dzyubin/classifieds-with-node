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

                    var data = $rootScope.classifieds.map(function (obj) {
                        var mappedObj = {};
                        //var date = new Date(obj.created);
                        mappedObj.date = obj.created.split('T')[0];
                        mappedObj.open = (obj.price + 200).toString();
                        mappedObj.high = (obj.price + 300).toString();
                        mappedObj.low = obj.price.toString();
                        mappedObj.close = (obj.price + 100).toString();

                        return mappedObj;

                    });

                    AmCharts.makeChart("pricesChart",
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
                    );

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
                    chart.categoryAxis = {
                        parseDates: true
                    };
                    chart.chartScrollbar = {
                        "enabled": true,
                        "graph": "g1",
                        "graphType": "line",
                        "scrollbarHeight": 30
                    };

                    var graph = new AmCharts.AmGraph();
                    graph.valueField = "classifiedsCount";
                    graph.type = "column";
                    graph.fillAlphas = 0.8;
                    graph.balloonText = "[[category]]: <b>[[value]]</b> оголош.";

                    chart.addGraph(graph);

                    chart.angle = 30;
                    chart.depth3D = 10;

                    chart.write('classifiedsCountChart');
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