import {MetricsPanelCtrl} from 'app/plugins/sdk';
import _ from 'lodash';
import kbn from 'app/core/utils/kbn';
import TimeSeries from 'app/core/time_series';
import rendering from './rendering';
import {SVGDemos} from './demos';
import {Snap} from './node_modules/snapsvg/dist/snap.svg-min.js';
import ace from './node_modules/brace/index.js';
import './node_modules/brace/ext/language_tools.js';
import './node_modules/brace/theme/tomorrow_night_bright.js';
import './node_modules/brace/mode/javascript.js';
import './node_modules/brace/mode/svg.js';


class GrafanaJSCompleter {
    constructor($lang_tools, $control, $panel) {
        this.$lang_tools = $lang_tools;
        this.$control = $control;
        this.$panel = $panel;
    }

    getCompletions(editor, session, pos, prefix, callback) {
        var pos = editor.getCursorPosition();
        var line = editor.session.getLine(pos.row);

        prefix = line.substring(0, pos.column).match(/this\.\S*/g);
        if (prefix) {
            prefix = prefix[prefix.length - 1];
            prefix = prefix.substring(0, prefix.lastIndexOf('.'));

            var panelthis = this.$panel;
            var evalObj = eval('panel' + prefix);
            this.evaluatePrefix(evalObj, callback);
            return;
        }

        prefix = line.substring(0, pos.column).match(/ctrl\.\S*/g);
        if (prefix) {
            prefix = prefix[prefix.length - 1];
            prefix = prefix.substring(0, prefix.lastIndexOf('.'));

            var ctrl = this.$control;
            var evalObj = eval(prefix);
            this.evaluatePrefix(evalObj, callback);
            return;
        }

        prefix = line.substring(0, pos.column).match(/svgnode\.\S*/g);
        if (prefix) {
            prefix = prefix[prefix.length - 1];
            prefix = prefix.substring(0, prefix.lastIndexOf('.'));

            var svgnode = document.querySelector('.svg-object');
            var evalObj = eval(prefix);
            this.evaluatePrefix(evalObj, callback);
            return;
        }

        if (prefix == '') {
            var wordList = ['ctrl', 'svgnode', 'this'];

            callback(null, wordList.map(function (word) {
                return {
                    caption: word,
                    value: word,
                    meta: 'Grafana keyword'
                };
            }));
        }
    }

    evaluatePrefix(evalObj, callback) {
        var wordList = [];
        for (var key in evalObj) {
            wordList.push(key);
        }
        callback(null, wordList.map(function (word) {
            return {
                caption: word + ': ' + (Array.isArray(evalObj[word]) ? 'Array[' + (evalObj[word] || []).length + ']' : typeof evalObj[word]),
                value: word,
                meta: "Grafana keyword"
            };
        }));
        return;
    }
}


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
            js_init_code: '',
            useSVGBuilder: false,
            svgBuilderData: {
                width: '100%',
                height: '100%',
                viewport: {
                    x: 0,
                    y: 0,
                    width: 1000,
                    height: 1000
                },
                elements: []
            }
        };

        _.defaults(this.panel, panelDefaults);

        this.events.on('render', this.onRender.bind(this));
        this.events.on('refresh', this.onRender.bind(this));
        this.events.on('data-received', this.onDataReceived.bind(this));
        this.events.on('data-error', this.onDataError.bind(this));
        this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));

        this.demos = new SVGDemos(this);
        this.initialized = 0;
        this.editors = {};
    }

    onInitEditMode() {
        this.addEditorTab('SVG Builder', 'public/plugins/marcuscalidus-svg-panel/editor_builder.html', 2);
        this.addEditorTab('SVG', 'public/plugins/marcuscalidus-svg-panel/editor_svg.html', 3);
        this.addEditorTab('Events', 'public/plugins/marcuscalidus-svg-panel/editor_events.html', 4);
        this.prepareEditor();
        this.unitFormats = kbn.getUnitFormats();
        this.aceLangTools = ace.acequire("ace/ext/language_tools");

        this.aceLangTools.addCompleter(new GrafanaJSCompleter(this.aceLangTools, this, this.panel));
    }

    doShowAceJs(nodeId) {
        setTimeout(function () {
            if ($('#' + nodeId).length === 1) {
                this.editors[nodeId] = ace.edit(nodeId);
                $('#' + nodeId).attr('id', nodeId + '_initialized');
                this.editors[nodeId].setValue(this.panel[nodeId], 1);
                this.editors[nodeId].getSession().on('change', function () {
                    var val = this.editors[nodeId].getSession().getValue();
                    this.panel[nodeId] = val;
                    try {
                        this.setInitFunction();
                        this.setHandleMetricFunction();
                        this.render();
                    } catch (err) {
                        console.error(err);
                    }
                }.bind(this));
                this.editors[nodeId].setOptions({
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    theme: 'ace/theme/tomorrow_night_bright',
                    mode: 'ace/mode/javascript',
                    showPrintMargin: false
                });
            }
        }.bind(this), 100);
        return true;
    }

    doShowAceSvg(nodeId) {
        setTimeout(function () {
            if ($('#' + nodeId).length === 1) {
                this.editors[nodeId] = ace.edit(nodeId);
                $('#' + nodeId).attr('id', nodeId + '_initialized');
                this.editors[nodeId].setValue(this.panel[nodeId], 1);
                this.editors[nodeId].getSession().on('change', function () {
                    var val = this.editors[nodeId].getSession().getValue();
                    this.panel[nodeId] = val;
                    try {
                        this.resetSVG();
                        this.render();
                    } catch (err) {
                        console.error(err);
                    }
                }.bind(this));
                this.editors[nodeId].setOptions({
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    readOnly: this.panel.useSVGBuilder,
                    theme: 'ace/theme/tomorrow_night_bright',
                    mode: 'ace/mode/svg',
                    showPrintMargin: false
                });
            }
        }.bind(this), 100);
        return true;
    }

    setUnitFormat(subItem) {
        this.panel.format = subItem.value;
        this.render();
    }

    onDataError() {
        this.data = [];
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
        if (!_.isFunction(this.panel.handleMetric)) {
            this.setHandleMetricFunction();
        }

        if (!_.isFunction(this.panel.doInit)) {
            this.setInitFunction();
        }
    }

    onDataReceived(dataList) {
        this.data = [];

        if (dataList.length > 0 && dataList[0].type === 'table') {
            this.data = dataList.map(this.tableHandler.bind(this));
            this.table = this.data; // table should be regarded as deprecated
        } else if (dataList.length > 0 && dataList[0].type === 'docs') {
            this.data = dataList.map(this.docsHandler.bind(this));
        } else {
            this.data = dataList.map(this.seriesHandler.bind(this));
            this.series = this.data; // series should be regarded as deprectated
        }

        this.render();
    }

    resetSVG() {
        this.initialized = 0;
    }

    seriesHandler(seriesData) {
        const series = new TimeSeries({
            datapoints: seriesData.datapoints,
            alias: seriesData.target
        });

        series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
        return series;
    }


    docsHandler(seriesData) {
        return seriesData;
    }

    tableHandler(tableData) {

        const columnNames = tableData.columns.map(column => column.text);

        const rows = tableData.rows.map(row => {
            const datapoint = {};

            row.forEach((value, columnIndex) => {
                const key = columnNames[columnIndex];
                datapoint[key] = value;
            });

            return datapoint;
        });

        return {columnNames: columnNames, rows: rows};
    }

    getSeriesIdByAlias(aliasName) {
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].alias == aliasName) {
                return i;
            }
        }
        return -1;
    }

    getSeriesElementByAlias(aliasName) {
        var i = this.getSeriesIdByAlias(aliasName);
        if (i >= 0) {
            return this.data[i];
        }
        return null;
    }

    getDecimalsForValue(value) {
        if (_.isNumber(this.panel.decimals)) {
            return {decimals: this.panel.decimals, scaledDecimals: null};
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
        if (Math.floor(value) === value) {
            dec = 0;
        }

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

    formatValueWithFormatter(value, formatter) {
        var decimalInfo = this.getDecimalsForValue(value);
        var formatFunc = kbn.valueFormats[formatter];
        if (formatFunc) {
            return formatFunc(value, decimalInfo.decimals, decimalInfo.scaledDecimals);
        }
        return value;
    }

    link(scope, elem, attrs, ctrl) {
        rendering(scope, elem, attrs, ctrl);
    }

    removeElement(idx) {
        this.panel.svgBuilderData.elements.splice(idx, 1);
        this.buildSVG();
    }

    moveElement(idx, steps) {
        this.panel.svgBuilderData.elements = _.move(this.panel.svgBuilderData.elements, idx, idx + steps);
        this.buildSVG();
    }

    prepareEditor() {
        var request = new XMLHttpRequest();

        request.open("GET", "public/plugins/marcuscalidus-svg-panel/assets/repositories.json");
        request.addEventListener('load', (event) => {
            if (request.status >= 200 && request.status < 300) {
                this.panel.repositories = JSON.parse(request.responseText);
            } else {
                console.warn(request.statusText, request.responseText);
            }
        });
        request.send();
    }

    repositorySelected() {
        let newCategories = [];
        this.panel.selectedSVG = null;

        if (this.panel.repositories[this.panel.selectedRepository]) {
            _.forEach(this.panel.repositories[this.panel.selectedRepository].items,
                (item) => {
                    if (!_.includes(newCategories, item.category)) {
                        newCategories.push(item.category);
                    }
                })
        }

        this.panel.categories = newCategories;
    }

    categorySelected() {
        this.panel.svglist = [];
        this.panel.selectedSVG = null;

        if (this.panel.repositories[this.panel.selectedRepository]) {
            this.panel.svglist = _.filter(this.panel.repositories[this.panel.selectedRepository].items,
                (item) => item.category === this.panel.selectedCategory);
        }
    }

    addSVGItem() {
        let svg = JSON.parse(this.panel.selectedSVG);

        this.panel.svgBuilderData.elements.push({
            name: svg.name,
            id: svg.name,
            path: svg.path,
            x: 0,
            y: 0,
            rotate: 0,
            rcenterx: 0,
            rcentery: 0,
            scale: 1
        })
        this.buildSVG();
    }

    buildSVG() {
        var all = function (array) {
            var deferred = $.Deferred();
            var fulfilled = 0,
                length = array.length;
            var results = [];

            if (length === 0) {
                deferred.resolve(results);
            } else {
                array.forEach(function (promise, i) {
                    $.when(promise()).then(function (value) {
                        results[i] = value;
                        fulfilled++;
                        if (fulfilled === length) {
                            deferred.resolve(results);
                        }
                    });
                });
            }

            return deferred.promise();
        };

        let panel = this.panel;
        if (panel.useSVGBuilder) {
            let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            let svgNS = svg.namespaceURI;

            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svg.setAttribute('width', panel.svgBuilderData.width);
            svg.setAttribute('height', panel.svgBuilderData.height);
            svg.setAttribute('viewBox', panel.svgBuilderData.viewport.x + ' ' +
                panel.svgBuilderData.viewport.y + ' ' +
                panel.svgBuilderData.viewport.width + ' ' +
                panel.svgBuilderData.viewport.height);

            let promises = [];

            panel.svgBuilderData.elements.forEach((element) => {
                promises.push(() => {
                    return $.Deferred((dfd) => {
                        $.get('public/plugins/marcuscalidus-svg-panel/assets/' + element.path, (data) => {
                            dfd.resolve(data);
                        });
                    }).promise();
                });
            });

            $.when(all(promises)).then(results => {
                results.forEach(
                    (svgFragment, i) => {
                        let g = document.createElementNS(svgNS, 'g');
                        g.setAttribute('id', panel.svgBuilderData.elements[i].id)
                        g.setAttribute('transform', 'translate(' + panel.svgBuilderData.elements[i].x + ' ' + panel.svgBuilderData.elements[i].y + ') ' +
                            'rotate(' + panel.svgBuilderData.elements[i].rotate + ' ' + panel.svgBuilderData.elements[i].rcenterx + ' ' + panel.svgBuilderData.elements[i].rcentery + ') ' +
                            'scale(' + panel.svgBuilderData.elements[i].scale + ')');
                        svg.appendChild(g);
                        $(g).html(svgFragment.documentElement.children);
                    }
                )
                panel.svg_data = svg.outerHTML;
                this.resetSVG();
                this.render();
            });
        }
    }

}

SVGCtrl.templateUrl = 'module.html';