import { MetricsPanelCtrl } from 'app/plugins/sdk';
import _ from 'lodash';
import kbn from 'app/core/utils/kbn';
import TimeSeries from 'app/core/time_series';
import rendering from './rendering';
import { SVGDemos } from './demos';
import { Snap } from 'node_modules/snapsvg/dist/snap.svg-min.js';

export class SVGCtrl extends MetricsPanelCtrl {

    constructor($scope, $injector, $rootScope) {
        super($scope, $injector);
        this.$rootScope = $rootScope;

        var panelDefaults = {
            links: [],
            datasource: null,
            maxDataPoints: 3,
            interval: null,
            targets: [{}],
            cacheTimeout: null,
            nullPointMode: 'connected',
            aliasColors: {},
            format: 'short',

            svg_data: '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1000 1000" ></svg>',
            js_code: '',
            js_init_code: ''
        };

        _.defaults(this.panel, panelDefaults);

        this.events.on('render', this.onRender.bind(this));
        this.events.on('data-received', this.onDataReceived.bind(this));
        this.events.on('data-error', this.onDataError.bind(this));
        this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));

        this.demos = new SVGDemos(this);
        this.initialized = 0;
    }

    onInitEditMode() {
        this.addEditorTab('Options', 'public/plugins/grafana-svg-panel/editor.html', 2);
        this.unitFormats = kbn.getUnitFormats();
    }

    setUnitFormat(subItem) {
        this.panel.format = subItem.value;
        this.render();
    }

    onDataError() {
        this.series = [];
        this.render();
    }

    changeSeriesColor(series, color) {
        series.color = color;
        this.panel.aliasColors[series.alias] = series.color;
        this.render();
    }

    setHandleMetricFunction() {
        this.panel.handleMetric = Function('ctrl', 'svgnode', this.panel.js_code);
    }

    setInitFunction() {
        this.initialized = 0;
        this.panel.doInit = Function('ctrl', 'svgnode', this.panel.js_init_code);
    }

    onRender() {
        if (!this.panel.handleMetric) {
            this.setHandleMetricFunction();
        }

        if (!this.panel.doInit) {
            this.setInitFunction();
        }
    }

    onDataReceived(dataList) {
        this.series = dataList.map(this.seriesHandler.bind(this));
        this.render();
    }

    resetSVG() {
        this.initialized = 0;
    }

    seriesHandler(seriesData) {
        var series = new TimeSeries({
            datapoints: seriesData.datapoints,
            alias: seriesData.target
        });

        series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
        return series;
    }

    getSeriesIdByAlias(aliasName) {
        for (var i = 0; i < this.series.length; i++) {
            if (this.series[i].alias == aliasName) {
                return i;
            }
        }
        return -1;
    }

    getSeriesElementByAlias(aliasName) {
        var i = this.getSeriesIdByAlias(aliasName);
        if (i >= 0) {
            return this.series[i];
        }
        return null;
    }

    getDecimalsForValue(value) {
        if (_.isNumber(this.panel.decimals)) {
            return { decimals: this.panel.decimals, scaledDecimals: null };
        }

        var delta = value / 2;
        var dec = -Math.floor(Math.log(delta) / Math.LN10);

        var magn = Math.pow(10, -dec);
        var norm = delta / magn; // norm is between 1.0 and 10.0
        var size;

        if (norm < 1.5) {
            size = 1;
        } else if (norm < 3) {
            size = 2;
            // special case for 2.5, requires an extra decimal
            if (norm > 2.25) {
                size = 2.5;
                ++dec;
            }
        } else if (norm < 7.5) {
            size = 5;
        } else {
            size = 10;
        }

        size *= magn;

        // reduce starting decimals if not needed
        if (Math.floor(value) === value) { dec = 0; }

        var result = {};
        result.decimals = Math.max(0, dec);
        result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;

        return result;
    }

    formatValue(value) {
        var decimalInfo = this.getDecimalsForValue(value);
        var formatFunc = kbn.valueFormats[this.panel.format];
        if (formatFunc) {
            return formatFunc(value, decimalInfo.decimals, decimalInfo.scaledDecimals);
        }
        return value;
    }

    link(scope, elem, attrs, ctrl) {
        rendering(scope, elem, attrs, ctrl);
    }

}

SVGCtrl.templateUrl = 'module.html';