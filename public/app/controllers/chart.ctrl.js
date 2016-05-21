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
                    var chartData = formatDate();
                        /*$rootScope.classifieds.map(function (obj) {
                        var mappedObj = {};

                        //todo: function setTimeToZero()
                        obj.created = new Date(obj.created);
                        obj.created.setSeconds(0);
                        obj.created.setMinutes(0);
                        mappedObj.hours = obj.created.getHours();
                        obj.created.setHours(0);
                        mappedObj.year = obj.created.getFullYear();
                        mappedObj.month = obj.created.getMonth();
                        mappedObj.day = obj.created.getDate();
                        obj.created = obj.created.toString();

                        mappedObj.date = obj.created;

                        //console.log(mappedObj);
                        return mappedObj;

                    });*/

                    function formatDate(minPeriod) {
                        return $rootScope.classifieds.map(function (obj) {
                            var mappedObj = {};

                            //todo: function setTimeToZero()
                            mappedObj.date = new Date(obj.created);
                            mappedObj.date.setSeconds(0);
                            mappedObj.date.setMinutes(0);
                            //console.log(mappedObj.date);
                            mappedObj.hours = mappedObj.date.getHours();
                            //console.log(typeof minPeriod);
                            if (minPeriod !== "hours") {
                                mappedObj.date.setHours(0);
                            }
                            mappedObj.year = mappedObj.date.getFullYear();
                            mappedObj.month = mappedObj.date.getMonth();
                            mappedObj.day = mappedObj.date.getDate();
                            mappedObj.date = mappedObj.date.toString();

                            //mappedObj.date = obj.created;

                            //console.log(mappedObj);
                            return mappedObj;

                        });
                    }

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

                    var classifiedsCreationDatesMonthly = _.uniqBy(chartData, 'month');

                    classifiedsCreationDatesMonthly.forEach(function (elemOuter) {
                        elemOuter.classifiedsCountMonthly = 0;
                        chartData.forEach(
                            function (elem) {
                                if (elem.month === elemOuter.month) {
                                    elemOuter.classifiedsCountMonthly += 1;
                                }
                                //console.log(elem.date);
                            }
                        );
                    });

                    var chart = new AmCharts.AmSerialChart();
                    chart.dataProvider = chartData;
                    chart.categoryField = "date";
                    /*chart.startDuration = 1;
                    chart.sequencedAnimation = false;*/
                    chart.categoryAxis = {
                        parseDates: true,
                        //minPeriod: 'hh'
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
                    chart.valueAxes = [ {
                        "title": "Кіл-ть оголошень",
                        "minimum": 0
                    } ];

                    var graph = new AmCharts.AmGraph();
                    graph.id = "g1";
                    graph.valueField = "classifiedsCount";
                    graph.type = "column";
                    graph.fillAlphas = 0.8;
                    graph.balloonText = "[[category]]: <b>[[value]]</b> оголош.";

                    chart.addGraph(graph);

                    chart.angle = 30;
                    chart.depth3D = 5;

                    chart.write('classifiedsCountChart');



                    $scope.classifiedsCountHourly = function () {

                        $scope.classifiedsHourly = true;
                        var chartData = formatDate("hours");

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
                        /*chart.startDuration = 1;
                         chart.sequencedAnimation = false;*/
                        chart.categoryAxis = {
                            parseDates: true,
                            minPeriod: 'hh'
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
                        chart.valueAxes = [ {
                            "title": "Кіл-ть оголошень",
                            "minimum": 0
                        } ];

                        var graph = new AmCharts.AmGraph();
                        graph.id = "g1";
                        graph.valueField = "classifiedsCount";
                        graph.type = "column";
                        graph.fillAlphas = 0.8;
                        graph.balloonText = "[[category]]: <b>[[value]]</b> оголош.";

                        chart.addGraph(graph);

                        chart.angle = 30;
                        chart.depth3D = 5;

                        chart.write('classifiedsCountChart');
                    };

                    /*var chart = AmCharts.makeChart( "classifiedsCountChart", {
                        "type": "stock",
                        "theme": "light",

                        "dataProvider": chartData,
                        "categoryField": "date",

                        "panels": [ {
                            "showCategoryAxis": false,
                            "title": "Value",
                            "percentHeight": 70,
                            "stockGraphs": [ {
                                "id": "g1",
                                "valueField": "classifiedsCount",
                                "comparable": true,
                                "compareField": "classifiedsCount",
                                "balloonText": "[[title]]:<b>[[value]]</b>",
                                "compareGraphBalloonText": "[[title]]:<b>[[value]]</b>"
                            } ],
                            "stockLegend": {
                                "periodValueTextComparing": "[[classifiedsCount]]%",
                                "periodValueTextRegular": "[[classifiedsCount]]"
                            }
                        } ],

                        "chartScrollbarSettings": {
                            "graph": "g1"
                        },

                        "chartCursorSettings": {
                            "valueBalloonsEnabled": true,
                            "fullWidth": true,
                            "cursorAlpha": 0.1,
                            "valueLineBalloonEnabled": true,
                            "valueLineEnabled": true,
                            "valueLineAlpha": 0.5
                        },

                        "periodSelector": {
                            "position": "bottom",
                            "periods": [ {
                                "period": "MM",
                                "selected": true,
                                "count": 1,
                                "label": "1 month"
                            }, {
                                "period": "YYYY",
                                "count": 1,
                                "label": "1 year"
                            }, {
                                "period": "YTD",
                                "label": "YTD"
                            }, {
                                "period": "MAX",
                                "label": "MAX"
                            } ]
                        }
                    } );*/


                    /*
                     **
                     *   Classifieds Prices Chart
                     */

                    //console.log($rootScope.classifieds);
                    /*var chartDataPrices = $rootScope.classifieds.map(function (obj) {
                        var mappedObj = {};

                        //todo: function setTimeToZero()
                        obj.created = new Date(obj.created);
                        obj.created.setSeconds(0);
                        obj.created.setMinutes(0);
                        //obj.created.setHours(0);
                        //obj.created = obj.created;

                        mappedObj.date = obj.created;
                        mappedObj.price = obj.price;
                        console.log(mappedObj);
                        return mappedObj;

                    });

                    var classifiedsCreationDatesPrices = _.uniqBy(chartDataPrices, 'date');

                    classifiedsCreationDatesPrices.forEach(function (elemOuter) {
                        elemOuter.close = 0;
                        elemOuter.open = 100000;
                        elemOuter.classifiedsCount = 0;
                        elemOuter.sumOfPrices = 0;

                        angular.forEach(chartDataPrices, function (classified) {
                            if (elemOuter.date === classified.date) {

                                elemOuter.sumOfPrices += classified.price;

                                elemOuter.classifiedsCount += 1;

                                if (elemOuter.close < classified.price) {
                                    elemOuter.close = classified.price;
                                }
                                if (elemOuter.open > classified.price) {
                                    elemOuter.open = classified.price;
                                }
                            }
                        });

                        elemOuter.averagePrice = (elemOuter.sumOfPrices / elemOuter.classifiedsCount).toFixed(2);
                    });*/

/*
                    angular.forEach(classifiedsCreationDatesPrices, function (value, key) {
                        console.log(value.date);
                        console.log(value.close);
                        console.log(value.open);
                    });
*/

                    /*AmCharts.makeChart( "classifiedsPricesChart", {
                        "type": "serial",
                        "theme": "light",
                        "legend": {
                            "equalWidths": false,
                            "useGraphSettings": true,
                            "valueAlign": "left",
                            "valueWidth": 120
                        },
                        "dataProvider": chartDataPrices,
                        "valueAxes": [ {
                            "axisAlpha": 0,
                            "gridAlpha": 0.1,
                            "position": "left",
                            "title": "Ціна, грн"
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
                                "id": "g2",
                                "balloonText": "<span style='font-size:12px;'>[[category]]:<br><span style='font-size:12px;'>Середня Ціна:<br><b>[[value]]</b></span></span>",
                                "bullet": "round",
                                "lineThickness": 3,
                                "bulletSize": 7,
                                "bulletBorderAlpha": 1,
                                "bulletColor": "#FFFFFF",
                                "useLineColorForBulletBorder": true,
                                "bulletBorderThickness": 3,
                                "fillAlphas": 0,
                                "lineAlpha": 1,
                                "title": "Середня ціна",
                                "valueField": "averagePrice",
                                "dashLengthField": "dashLengthLine"
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
                    } );*/

                    /*var chartData= [
                        {date: new Date(2011, 5, 1, 0, 0, 0, 0), val:10},
                        {date: new Date(2011, 5, 2, 0, 0, 0, 0), val:11},
                        {date: new Date(2011, 5, 3, 0, 0, 0, 0), val:12},
                        {date: new Date(2011, 5, 4, 0, 0, 0, 0), val:11},
                        {date: new Date(2011, 5, 5, 0, 0, 0, 0), val:10},
                        {date: new Date(2011, 5, 6, 0, 0, 0, 0), val:11},
                        {date: new Date(2011, 5, 7, 0, 0, 0, 0), val:13},
                        {date: new Date(2011, 5, 8, 0, 0, 0, 0), val:14},
                        {date: new Date(2011, 5, 9, 0, 0, 0, 0), val:17},
                        {date: new Date(2011, 5, 10, 0, 0, 0, 0), val:13}
                    ];

                    var chartData= [
                        {date: new Date(2011, 5, 1, 10, 0, 0, 0), val:10},
                        //{date: new Date(2011, 5, 1, 11, 0, 0, 0), val:11},
                        {date: new Date(2011, 5, 1, 12, 0, 0, 0), val:12},
                        {date: new Date(2011, 5, 1, 13, 0, 0, 0), val:11},
                        {date: new Date(2011, 5, 1, 14, 0, 0, 0), val:10},
                        //{date: new Date(2011, 5, 1, 15, 0, 0, 0), val:11},
                        //{date: new Date(2011, 5, 1, 16, 0, 0, 0), val:13},
                        {date: new Date(2011, 5, 1, 17, 0, 0, 0), val:14},
                        {date: new Date(2011, 5, 1, 18, 0, 0, 0), val:17},
                        {date: new Date(2011, 5, 1, 19, 0, 0, 0), val:13}
                    ];*/
                    /*var chart = new AmCharts.AmStockChart();

                    //chart.pathToImages = "amcharts/images/";

                    var dataSet = new AmCharts.DataSet();
                    dataSet.dataProvider = chartData;
                    dataSet.fieldMappings = [{fromField:"classifiedsCount", toField:"value"}];
                    dataSet.categoryField = "date";

                    chart.dataSets = [dataSet];

                    var stockPanel = new AmCharts.StockPanel();

                    chart.panels = [stockPanel];

                    var panelsSettings = new AmCharts.PanelsSettings();
                    panelsSettings.startDuration = 1;

                    chart.panelsSettings = panelsSettings;

                    var graph = new AmCharts.StockGraph();
                    graph.valueField = "value";
                    graph.type = "column";
                    graph.fillAlphas = 1;
                    graph.title = "Кіл-ть оголошень";

                    stockPanel.addStockGraph(graph);

                    var categoryAxesSettings = new AmCharts.CategoryAxesSettings();
                    //categoryAxesSettings.minPeriod = "";
                    categoryAxesSettings.equalSpacing = false;
                    chart.categoryAxesSettings = categoryAxesSettings;

                    var valueAxesSettings = new AmCharts.ValueAxesSettings();
                    valueAxesSettings.title = "К-ть оголошень";
                    chart.valueAxesSettings = valueAxesSettings;*/

                    //chart.write("classifiedsCountChart");

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