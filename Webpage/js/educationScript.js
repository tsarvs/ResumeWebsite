class Controller {
    constructor() {
        this.portfolio = {
            id: 123,
            portfolioAssets: [
                {
                    id: 123,
                    name: 'HTML & CSS',
                    symbol: '',
                    percentage: 10
                },
                {
                    id: 124,
                    name: 'C & C++',
                    symbol: '',
                    percentage: 15
                },
                {
                    id: 125,
                    name: 'C# & .NET',
                    symbol: '',
                    percentage: 20
                },
                {
                    id: 126,
                    name: 'Java',
                    symbol: '',
                    percentage: 15
                },
                {
                    id: 127,
                    name: 'SQL',
                    symbol: '',
                    percentage: 20
                },
                {
                    id: 128,
                    name: 'Assembly',
                    symbol: '',
                    percentage: 10
                },
                {
                    id: 129,
                    name: 'Swift',
                    symbol: '',
                    percentage: 10
                }
            ]
        };
    }
};

angular.module('app', [])
.factory('highstock', ($window) => {
    const Highcharts = $window.Highcharts;
    // Pie chart has gap bug: https://github.com/highcharts/highcharts/issues/1828
    Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'drawPoints', function(proceed) {
        if (this.options.borderColor == null && this.options.borderWidth >= 1) {
            Highcharts.each(this.points, (point) => {
                point.pointAttr['']['stroke-width'] = 1;
                point.pointAttr[''].stroke = point.pointAttr[''].fill;
                point.pointAttr['hover']['stroke-width'] = 1;
                point.pointAttr['hover'].stroke = point.pointAttr['hover'].fill;
                point.pointAttr['select']['stroke-width'] = 1;
                point.pointAttr['select'].stroke = point.pointAttr['select'].fill;
            });
        }
        proceed.apply(this);
    });
    
    return Highcharts;
})
.controller('Controller', Controller)
.directive('pieChart', ($timeout, highstock) => {
    let colors = [
        '#CD5955',
        '#E96D66',
        '#EC876C',
        '#EFA071',
        '#EFB278',
        '#EEC27D',
        '#DEC782',
        '#BCBB87',
        '#99AD8A',
        '#7B9D8A',
        '#5E8D8A',
    ];
    let chartConfig = {
        chart: {
            type: 'pie',
            //renderTo: null,
            height: 300,
            backgroundColor: 'none',
            events: {
                //load: null
            }
        },
        title: {
            style: {display: 'none'}
        },
        subtitle: {
            style: {display: 'none'}
        },
        yAxis: {
            title: {
                text: 'Total percent market share'
            }
        },
        plotOptions: {
            pie: {
                shadow: false,
                center: ['50%', '50%'],
                colors: colors,
                borderWidth: 1,
                borderColor: null,
                stickyTracking: false,
                dataLabels: {
                    enabled: false
                },
                states: {
                    hover: {
                        brightness: 0,
                    }
                },
            }
        },
        tooltip: {
            backgroundColor: '',
            borderWidth: 0,
            useHTML: true,
            formatter() {
                console.log('this is ', this)
                let point = this.point;
                return `
                    <section class="donut-chart-tooltip">
                        <i style="background-color:${point.color}"><span class="point-percentage">${point.y+'%'}</span></i>
                        <span class="point-name" style="color:${point.color}">${point.name}</span>
                    </section>
                `;
            }
        },
        series: [{
            name: 'Assets Percentage',
            data: null, // To be set
            size: '100%',
            innerSize: '60%',
        }],
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
    };
    
    return {
        restrict: 'AE',
        scope: {
            portfolio: '=',
            chartTitle: '@'
        },
        template: `
                <header class="portfolio-assets-donut-chart-title">
                    <h3 ng-bind="chartTitle"></h3>
                </header>
                <div class="portfolio-assets-donut-chart"></div>
                
        `,
        link(scope, elem) {
            const titleElem = elem[0].getElementsByClassName('portfolio-assets-donut-chart-title')[0];
            const chartElem = elem[0].getElementsByClassName('portfolio-assets-donut-chart')[0];
            const portfolio = scope.portfolio;
            
            let chart = null;
            let createChart = () => {
                // Process data
                let data = portfolio.portfolioAssets.map((item) => {
                    return {
                        y: item.percentage,
                        name: item.name
                    };
                });
                
                chartConfig.series[0].data = data;
                
                chart = new highstock.Chart(chartConfig);
            };
            
            scope.getColorByIndex = (i) => {
                let len = colors.length;
                return colors[i % len];
            };
            
            const positionTitle = function() {
                console.log('positioning title', chart);
                console.log('this is ', this)

                Object.assign(titleElem.style, {
                    width: `${this.plotWidth}px`,
                    height: `${this.plotHeight}px`,
                    left: `${this.plotLeft}px`,
                    top: `${this.plotTop}px`,
                });
            };

            //chartConfig.events.load = positionTitle;
            chartConfig.chart.renderTo = chartElem;
            chartConfig.chart.events.load = positionTitle;
            chartConfig.chart.events.redraw = positionTitle;
            createChart();
        }
    };
});