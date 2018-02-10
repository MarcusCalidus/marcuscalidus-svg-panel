'use strict';

System.register(['app/plugins/sdk', 'lodash', 'app/core/utils/kbn', 'app/core/time_series', './rendering', './demos', './node_modules/snapsvg/dist/snap.svg-min.js', './node_modules/brace/index.js', './node_modules/brace/ext/language_tools.js', './node_modules/brace/theme/ambiance.js', './node_modules/brace/mode/javascript.js'], function (_export, _context) {
    "use strict";

    var MetricsPanelCtrl, _, kbn, TimeSeries, rendering, SVGDemos, Snap, ace, _createClass, SVGCtrl;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    return {
        setters: [function (_appPluginsSdk) {
            MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
        }, function (_lodash) {
            _ = _lodash.default;
        }, function (_appCoreUtilsKbn) {
            kbn = _appCoreUtilsKbn.default;
        }, function (_appCoreTime_series) {
            TimeSeries = _appCoreTime_series.default;
        }, function (_rendering) {
            rendering = _rendering.default;
        }, function (_demos) {
            SVGDemos = _demos.SVGDemos;
        }, function (_node_modulesSnapsvgDistSnapSvgMinJs) {
            Snap = _node_modulesSnapsvgDistSnapSvgMinJs.Snap;
        }, function (_node_modulesBraceIndexJs) {
            ace = _node_modulesBraceIndexJs.default;
        }, function (_node_modulesBraceExtLanguage_toolsJs) {}, function (_node_modulesBraceThemeAmbianceJs) {}, function (_node_modulesBraceModeJavascriptJs) {}],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            _export('SVGCtrl', SVGCtrl = function (_MetricsPanelCtrl) {
                _inherits(SVGCtrl, _MetricsPanelCtrl);

                function SVGCtrl($scope, $injector, $rootScope) {
                    _classCallCheck(this, SVGCtrl);

                    var _this = _possibleConstructorReturn(this, (SVGCtrl.__proto__ || Object.getPrototypeOf(SVGCtrl)).call(this, $scope, $injector));

                    _this.$rootScope = $rootScope;

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

                    _.defaults(_this.panel, panelDefaults);

                    _this.events.on('render', _this.onRender.bind(_this));
                    _this.events.on('refresh', _this.onRender.bind(_this));
                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    _this.events.on('data-error', _this.onDataError.bind(_this));
                    _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));

                    _this.demos = new SVGDemos(_this);
                    _this.initialized = 0;
                    return _this;
                }

                _createClass(SVGCtrl, [{
                    key: 'onInitEditMode',
                    value: function onInitEditMode() {
                        this.addEditorTab('SVG Builder', 'public/plugins/grafana-svg-panel/editor_builder.html', 2);
                        this.addEditorTab('SVG', 'public/plugins/grafana-svg-panel/editor_svg.html', 3);
                        this.addEditorTab('Events', 'public/plugins/grafana-svg-panel/editor_events.html', 4);
                        this.prepareEditor();
                        this.unitFormats = kbn.getUnitFormats();
                    }
                }, {
                    key: 'doshow',
                    value: function doshow(nodeId) {
                        setTimeout(function () {
                            if ($('#' + nodeId).length === 1) {
                                var langTools = ace.acequire("ace/ext/language_tools");
                                var editor = ace.edit(nodeId);
                                $('#' + nodeId).attr('id', '');
                                editor.getSession().on('change', function () {
                                    var val = editor.getSession().getValue();
                                    //     console.log(val);
                                });
                                editor.setOptions({
                                    enableBasicAutocompletion: true,
                                    enableLiveAutocompletion: true,
                                    theme: 'ace/theme/ambiance',
                                    mode: 'ace/mode/javascript'
                                });
                            }
                        }.bind(this), 100);
                        return true;
                    }
                }, {
                    key: 'setUnitFormat',
                    value: function setUnitFormat(subItem) {
                        this.panel.format = subItem.value;
                        this.render();
                    }
                }, {
                    key: 'onDataError',
                    value: function onDataError() {
                        this.series = [];
                        this.render();
                    }
                }, {
                    key: 'changeSeriesColor',
                    value: function changeSeriesColor(series, color) {
                        series.color = color;
                        this.panel.aliasColors[series.alias] = series.color;
                        this.render();
                    }
                }, {
                    key: 'setHandleMetricFunction',
                    value: function setHandleMetricFunction() {
                        this.panel.handleMetric = Function('ctrl', 'svgnode', this.panel.js_code);
                    }
                }, {
                    key: 'setInitFunction',
                    value: function setInitFunction() {
                        this.initialized = 0;
                        this.panel.doInit = Function('ctrl', 'svgnode', this.panel.js_init_code);
                    }
                }, {
                    key: 'onRender',
                    value: function onRender() {
                        if (!_.isFunction(this.panel.handleMetric)) {
                            this.setHandleMetricFunction();
                        }

                        if (!_.isFunction(this.panel.doInit)) {
                            this.setInitFunction();
                        }
                    }
                }, {
                    key: 'onDataReceived',
                    value: function onDataReceived(dataList) {
                        this.series = dataList.map(this.seriesHandler.bind(this));
                        this.render();
                    }
                }, {
                    key: 'resetSVG',
                    value: function resetSVG() {
                        this.initialized = 0;
                    }
                }, {
                    key: 'seriesHandler',
                    value: function seriesHandler(seriesData) {
                        var series = new TimeSeries({
                            datapoints: seriesData.datapoints,
                            alias: seriesData.target
                        });

                        series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
                        return series;
                    }
                }, {
                    key: 'getSeriesIdByAlias',
                    value: function getSeriesIdByAlias(aliasName) {
                        for (var i = 0; i < this.series.length; i++) {
                            if (this.series[i].alias == aliasName) {
                                return i;
                            }
                        }
                        return -1;
                    }
                }, {
                    key: 'getSeriesElementByAlias',
                    value: function getSeriesElementByAlias(aliasName) {
                        var i = this.getSeriesIdByAlias(aliasName);
                        if (i >= 0) {
                            return this.series[i];
                        }
                        return null;
                    }
                }, {
                    key: 'getDecimalsForValue',
                    value: function getDecimalsForValue(value) {
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
                        if (Math.floor(value) === value) {
                            dec = 0;
                        }

                        var result = {};
                        result.decimals = Math.max(0, dec);
                        result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;

                        return result;
                    }
                }, {
                    key: 'formatValue',
                    value: function formatValue(value) {
                        var decimalInfo = this.getDecimalsForValue(value);
                        var formatFunc = kbn.valueFormats[this.panel.format];
                        if (formatFunc) {
                            return formatFunc(value, decimalInfo.decimals, decimalInfo.scaledDecimals);
                        }
                        return value;
                    }
                }, {
                    key: 'link',
                    value: function link(scope, elem, attrs, ctrl) {
                        rendering(scope, elem, attrs, ctrl);
                    }
                }, {
                    key: 'removeElement',
                    value: function removeElement(idx) {
                        this.panel.svgBuilderData.elements.splice(idx, 1);
                        this.buildSVG();
                    }
                }, {
                    key: 'moveElement',
                    value: function moveElement(idx, steps) {
                        this.panel.svgBuilderData.elements = _.move(this.panel.svgBuilderData.elements, idx, idx + steps);
                        this.buildSVG();
                    }
                }, {
                    key: 'prepareEditor',
                    value: function prepareEditor() {
                        var _this2 = this;

                        var request = new XMLHttpRequest();

                        request.open("GET", "public/plugins/grafana-svg-panel/assets/repositories.json");
                        request.addEventListener('load', function (event) {
                            if (request.status >= 200 && request.status < 300) {
                                _this2.panel.repositories = JSON.parse(request.responseText);
                            } else {
                                console.warn(request.statusText, request.responseText);
                            }
                        });
                        request.send();
                    }
                }, {
                    key: 'repositorySelected',
                    value: function repositorySelected() {
                        var newCategories = [];
                        this.panel.selectedSVG = null;

                        if (this.panel.repositories[this.panel.selectedRepository]) {
                            _.forEach(this.panel.repositories[this.panel.selectedRepository].items, function (item) {
                                if (!_.includes(newCategories, item.category)) {
                                    newCategories.push(item.category);
                                }
                            });
                        }

                        this.panel.categories = newCategories;
                    }
                }, {
                    key: 'categorySelected',
                    value: function categorySelected() {
                        var _this3 = this;

                        this.panel.svglist = [];
                        this.panel.selectedSVG = null;

                        if (this.panel.repositories[this.panel.selectedRepository]) {
                            this.panel.svglist = _.filter(this.panel.repositories[this.panel.selectedRepository].items, function (item) {
                                return item.category === _this3.panel.selectedCategory;
                            });
                        }
                    }
                }, {
                    key: 'addSVGItem',
                    value: function addSVGItem() {
                        var svg = JSON.parse(this.panel.selectedSVG);

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
                        });
                        this.buildSVG();
                    }
                }, {
                    key: 'buildSVG',
                    value: function buildSVG() {
                        var _this4 = this;

                        var all = function all(array) {
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

                        var panel = this.panel;
                        if (panel.useSVGBuilder) {
                            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                            var svgNS = svg.namespaceURI;

                            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                            svg.setAttribute('width', panel.svgBuilderData.width);
                            svg.setAttribute('height', panel.svgBuilderData.height);
                            svg.setAttribute('viewBox', panel.svgBuilderData.viewport.x + ' ' + panel.svgBuilderData.viewport.y + ' ' + panel.svgBuilderData.viewport.width + ' ' + panel.svgBuilderData.viewport.height);

                            var promises = [];

                            panel.svgBuilderData.elements.forEach(function (element) {
                                promises.push(function () {
                                    return $.Deferred(function (dfd) {
                                        $.get('public/plugins/grafana-svg-panel/assets/' + element.path, function (data) {
                                            dfd.resolve(data);
                                        });
                                    }).promise();
                                });
                            });

                            $.when(all(promises)).then(function (results) {
                                results.forEach(function (svgFragment, i) {
                                    var g = document.createElementNS(svgNS, 'g');
                                    g.setAttribute('id', panel.svgBuilderData.elements[i].id);
                                    g.setAttribute('transform', 'translate(' + panel.svgBuilderData.elements[i].x + ' ' + panel.svgBuilderData.elements[i].y + ') ' + 'rotate(' + panel.svgBuilderData.elements[i].rotate + ' ' + panel.svgBuilderData.elements[i].rcenterx + ' ' + panel.svgBuilderData.elements[i].rcentery + ') ' + 'scale(' + panel.svgBuilderData.elements[i].scale + ')');
                                    svg.appendChild(g);
                                    $(g).html(svgFragment.documentElement.children);
                                });
                                panel.svg_data = svg.outerHTML;
                                _this4.resetSVG();
                                _this4.render();
                            });
                        }
                    }
                }]);

                return SVGCtrl;
            }(MetricsPanelCtrl));

            _export('SVGCtrl', SVGCtrl);

            SVGCtrl.templateUrl = 'module.html';
        }
    };
});
//# sourceMappingURL=svg_ctrl.js.map
