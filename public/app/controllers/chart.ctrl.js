(function () {

    "use strict";

angular
    .module('classifieds')
    .controller('ChartCtrl',
    ['$rootScope', '$scope', '$mdToast', 'ClassifiedsDB', 'Classified',
        function ($rootScope, $scope, $mdToast, ClassifiedsDB, Classified) {

            $rootScope.classifieds = [];

            $scope.ClassifiedsDBService = new ClassifiedsDB(null, null, null, 1);
            $scope.ClassifiedsDBService.nextPage()
                .success(function () {

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

                    var chartConfig = {
                        minPeriod: "DD"
                    };

                    getClassifiedsCountAndRenderChart(chartConfig);

                    /*
                    **
                    *   Classifieds Count Chart
                     */

                    function formatDate(minPeriod) {
                        return $rootScope.classifieds.map(function (obj) {
                            var mappedObj = {};

                            //todo: function setTimeToZero()
                            mappedObj.date = new Date(obj.created);
                            mappedObj.date.setSeconds(0);
                            mappedObj.date.setMinutes(0);
                            mappedObj.hours = mappedObj.date.getHours();
                            if (minPeriod !== "hh") {
                                mappedObj.date.setHours(0);
                            }
                            mappedObj.year = mappedObj.date.getFullYear();
                            mappedObj.month = mappedObj.date.getMonth();
                            if (minPeriod === "YYYY") {
                                mappedObj.date.setMonth(0);
                            }
                            mappedObj.day = mappedObj.date.getDate();
                            if (minPeriod === "MM" || minPeriod === "YYYY") {
                                mappedObj.date.setDate(1);
                            }
                            mappedObj.date = mappedObj.date.toString();

                            function getWeekNumber(d) {
                                // Copy date so don't modify original
                                d = new Date(+d);
                                d.setHours(0,0,0);
                                // Set to nearest Thursday: current date + 4 - current day number
                                // Make Sunday's day number 7
                                d.setDate(d.getDate() + 4 - (d.getDay()||7));
                                // Get first day of year
                                var yearStart = new Date(d.getFullYear(),0,1);
                                // Calculate full weeks to nearest Thursday
                                var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
                                // Return array of year and week number
                                return [d.getFullYear(), weekNo];
                            }

                            mappedObj.weekNo = getWeekNumber(new Date(obj.created));
                            mappedObj.weekNo = mappedObj.weekNo[0].toString() + mappedObj.weekNo[1].toString();

                            return mappedObj;

                        });
                    }

                    //todo: use array.prototype.reduce technique from "Learning behavior-driven
                    // development with Javascript" page 56
                    function getClassifiedsCountAndRenderChart(config) {

                        $scope.chartScaleBtn = config.minPeriod;

                        var chartData = formatDate(config.minPeriod);

                        if (config.minPeriod === "YYYY") {
                            for (var i = 0; i < 3; i++) {
                                chartData.unshift({
                                    date: new Date(2014, 11, 20)
                                });
                            }
                        }

                        if (config.minPeriod === "MM") {
                            chartData.unshift({
                                date: new Date(2015, 8, 10)
                            })
                        }

                        var classifiedsCreationDates = _.uniqBy(chartData, 'date');

                        if (config.minPeriod === "7DD") {
                            classifiedsCreationDates = _.uniqBy(chartData, 'weekNo');
                        }


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
                            parseDates: true,
                            minPeriod: config.minPeriod
                        };
                        chart.chartCursor = {
                            "pan": true,
                            "enabled": true,
                            "categoryBalloonDateFormat": config.balloonDateFormat || "MMM DD, YYYY"
                        };
                        chart.chartScrollbar = {
                            "enabled": true,
                            "graph": "g1",
                            "graphType": "line",
                            "scrollbarHeight": 30,
                            "dragIcon": "dragIconRectBig",
                            "autoGridCount": true
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

                        console.log(chart);

                        chart.write('classifiedsCountChart');
                    }

                    $scope.classifiedsCountHourly = function () {

                        var config = {
                            minPeriod: "hh",
                            balloonDateFormat: "J:NN, DD MMM"
                        };

                        getClassifiedsCountAndRenderChart(config);
                    };

                    $scope.classifiedsCountDaily = function () {

                        var config = {
                            minPeriod: "DD"
                        };

                        getClassifiedsCountAndRenderChart(config);

                    };

                    $scope.classifiedsCountWeekly = function () {

                        var config = {
                            minPeriod: "7DD"
                        };

                        getClassifiedsCountAndRenderChart(config);
                    };

                    $scope.classifiedsCountMonthly = function () {

                        var config = {
                            minPeriod: "MM",
                            balloonDateFormat: "MMM, YYYY"
                        };

                        getClassifiedsCountAndRenderChart(config);
                    };

                    $scope.classifiedsCountYearly = function () {

                        var config = {
                            minPeriod: "YYYY",
                            balloonDateFormat: "YYYY"
                        };

                        getClassifiedsCountAndRenderChart(config);
                    };

                    /*
                     **
                     *   Classifieds Prices Chart
                     */

                    var chartDataPrices = $rootScope.classifieds.map(function (obj) {
                        var mappedObj = {};

                        //todo: function setTimeToZero()
                        mappedObj.date = new Date(obj.created);
                        mappedObj.date.setSeconds(0);
                        mappedObj.date.setMinutes(0);
                        mappedObj.date.setHours(0);
                        mappedObj.date = mappedObj.date.toString();
                        mappedObj.price = obj.price;
                        return mappedObj;

                    });

                    var classifiedsCreationDatesPrices = _.uniqBy(chartDataPrices, 'date');

                    console.log(classifiedsCreationDatesPrices);

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
                    });

                    AmCharts.makeChart( "classifiedsPricesChart", {
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
                                "valueField": "close",
                                "title": "Найвища/Найнижча Ціна"
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
                        /*"export": {
                            "enabled": true
                        }*/
                    } );

                })
                .error(function (error) {
                    Classified.notify("Не вдалося отримати дані. Спробуйте ще раз");
                    //showToast('Не вдалося отримати дані. Спробуйте ще раз');
                });

            /*function showToast(message) {
                $mdToast.show(
                    $mdToast.simple()
                        .content(message)
                        .position('top, right')
                        .hideDelay(3000)
                );
            }*/
        }]);
}());