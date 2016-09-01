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
						this.ctrl.panel.svg_data = '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 200 200" >\n' + '  <circle id="circle" style="stroke: black; fill: #f8f8f8;" cx="100" cy="100" r="100"/>\n' + '  <line id="hour0" x1="100" y1="10"  x2="100" y2="0" style="stroke: green;"/>\n' + '  <line id="hour1" x1="150" y1="13"  x2="145" y2="22" style="stroke: green;"/>\n' + '  <line id="hour2" x1="187" y1="50"  x2="178" y2="55" style="stroke: green;"/>\n' + '  <line id="hour3" x1="190" y1="100" x2="200" y2="100" style="stroke: green;"/>\n' + '  <line id="hour4" x1="187" y1="150" x2="178" y2="145" style="stroke: green;"/>\n' + '  <line id="hour5" x1="150" y1="187" x2="145" y2="178" style="stroke: green;"/>\n' + '  <line id="hour6" x1="100" y1="190" x2="100" y2="200" style="stroke: green;"/>\n' + '  <line id="hour7" x1="50"  y1="187" x2="55"  y2="178" style="stroke: green;"/>\n' + '  <line id="hour8" x1="13"  y1="150" x2="22"  y2="145" style="stroke: green;"/>\n' + '  <line id="hour9" x1="0"   y1="100" x2="10"  y2="100" style="stroke: green;"/>\n' + '  <line id="hour10" x1="13"  y1="50"  x2="22"  y2="55" style="stroke: green;"/>\n' + '  <line id="hour11" x1="50"  y1="13"  x2="55"  y2="22" style="stroke: green;"/>\n' + '    <g>\n' + '      <line x1="100" y1="100" x2="100" y2="45" style="stroke-width: 6px; stroke: green;" id="hourhand" />\n' + '      <line x1="100" y1="100" x2="100" y2="15" style="stroke-width: 4px; stroke: blue;"  id="minutehand"/>\n' + '      <line x1="100" y1="100" x2="100" y2="5"  style="stroke-width: 2px; stroke: red;"   id="secondhand"/>\n' + '    </g>\n' + '</svg>';

						this.ctrl.panel.js_code = 'var now = new Date();\n' + 'var angle = 360 * now.getHours()   / 12;\n' + '$(svgnode).find("#hourhand").attr("transform", "rotate("+angle.toString()+ " 100 100)"  );\n' + 'var angle = 360 * now.getMinutes() / 60;\n' + '$(svgnode).find("#minutehand").attr("transform", "rotate("+angle.toString()+ " 100 100)"  );\n' + 'var angle = 360 * now.getSeconds() / 60;\n' + '$(svgnode).find("#secondhand").attr("transform", "rotate("+angle.toString()+ " 100 100)"  );';

						this.ctrl.panel.js_init_code = '';

						this.ctrl.setInitFunction();
						this.ctrl.setHandleMetricFunction();
						this.ctrl.resetSVG();
						this.ctrl.render();
					}
				}, {
					key: 'snap',
					value: function snap() {
						this.ctrl.panel.svg_data = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 500 500" ></svg>';
						this.ctrl.panel.js_code = '';
						this.ctrl.panel.js_init_code = 'var s = Snap(svgnode), circles = [],\n    bg = s.rect(0, 0, 800, 200);\n\nbg.attr({\n  \'fill\': \'#fff\'\n});\n\nvar circleGroup = s.group(bg);\n\n\/\/ create 200 circles\nfor(var i=0; i<200; i++) {\n  var size = Math.random()*5 + 3,\n      cx = Math.random()*800,\n      cy = Math.random()*200,\n      opacity = Math.random(),\n      fill = \'#9d77da\',\n      counter = Math.random()*360;\n      circ = s.circle(cx, cy, size);\n  circ.attr({\n    \'fill\': fill,\n    \'fill-opacity\': opacity\n  });\n  circ.data(\'xOffset\', cx); \n  circ.data(\'cx\', cx);\n  circ.data(\'yOffset\', cy); \n  circ.data(\'cy\', cy);\n  circ.data(\'counter\', counter); \n  circles.push(circ);\n  circleGroup.add(circ);\n  \n}\n\nvar increase = Math.PI * 2 \/40,\n    text = s.text(10, 130, \"SNAPSVG\");\n\ntext.attr({\n  \'font-size\': 120,\n  \'fill\': \'#fff\'\n});\n\ncircleGroup.attr({\n  mask: text\n});\n\nfunction draw() {\n  for(var i=0, l=circles.length; i<l; i++) {\n    var circ = circles[i];\n    \n    if(circ.data(\'cy\') < 0) {\n      circ.data(\'cy\', 200);\n    } else {\n      circ.data(\'cy\', (circ.data(\'cy\')-2));\n    }\n    circ.data(\'cx\', (circ.data(\'xOffset\') + (50*(Math.sin( circ.data(\'counter\')) \/ 5))));\n    circ.attr({\n      cx: circ.data(\'cx\'),\n      cy: circ.data(\'cy\')\n    });\n    \n    circ.data(\'counter\',      circ.data(\'counter\')+increase);\n  }  \n  \n}\n\nfunction animate() {\n  draw();\n  window.requestAnimationFrame(animate);\n}\n\nanimate();';

						this.ctrl.setInitFunction();
						this.ctrl.setHandleMetricFunction();
						this.ctrl.resetSVG();
						this.ctrl.render();
					}
				}]);

				return SVGDemos;
			}());

			_export('SVGDemos', SVGDemos);
		}
	};
});
//# sourceMappingURL=demos.js.map
