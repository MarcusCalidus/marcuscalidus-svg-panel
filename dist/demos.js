'use strict';

System.register(['lodash', 'jquery', 'jquery.flot', 'jquery.flot.pie'], function (_export, _context) {
         "use strict";

         var _, $, _createClass, SVGDemos;

         function _classCallCheck(instance, Constructor) {
                  if (!(instance instanceof Constructor)) {
                           throw new TypeError("Cannot call a class as a function");
                  }
         }

         return {
                  setters: [function (_lodash) {
                           _ = _lodash.default;
                  }, function (_jquery) {
                           $ = _jquery.default;
                  }, function (_jqueryFlot) {}, function (_jqueryFlotPie) {}],
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

                           _export('SVGDemos', SVGDemos = function () {
                                    function SVGDemos(ctrl) {
                                             _classCallCheck(this, SVGDemos);

                                             this.ctrl = ctrl;
                                    }

                                    _createClass(SVGDemos, [{
                                             key: 'clock',
                                             value: function clock() {
                                                      console.log(this);
                                                      this.ctrl.panel.svg_data = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewbox="0 0 200 200" >\n' + '  <circle id="circle" style="stroke: black; fill: #f8f8f8;" cx="100" cy="100" r="100"/>\n' + '    <g>\n' + '      <line x1="100" y1="100" x2="100" y2="45" style="stroke-width: 6px; stroke: green;" id="hourhand" />\n' + '      <line x1="100" y1="100" x2="100" y2="15" style="stroke-width: 4px; stroke: blue;"  id="minutehand"/>\n' + '      <line x1="100" y1="100" x2="100" y2="5"  style="stroke-width: 2px; stroke: red;"   id="secondhand"/>\n' + '    </g>\n' + '</svg>';

                                                      this.ctrl.panel.js_code = 'var now = new Date();\n' + 'var angle = 360 * now.getHours()   / 12;\n' + 'elem.find("#hourhand").attr("transform", "rotate("+angle.toString()+ " 100 100)"  );\n' + 'var angle = 360 * now.getMinutes() / 60;\n' + 'elem.find("#minutehand").attr("transform", "rotate("+angle.toString()+ " 100 100)"  );\n' + 'var angle = 360 * now.getSeconds() / 60;\n' + 'elem.find("#secondhand").attr("transform", "rotate("+angle.toString()+ " 100 100)"  );';
                                             }
                                    }]);

                                    return SVGDemos;
                           }());

                           _export('SVGDemos', SVGDemos);
                  }
         };
});
//# sourceMappingURL=demos.js.map
