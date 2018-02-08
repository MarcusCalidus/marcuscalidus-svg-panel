'use strict';

System.register(['./polyfills.js', 'lodash', './svg_ctrl'], function (_export, _context) {
    "use strict";

    var _, SVGCtrl;

    return {
        setters: [function (_polyfillsJs) {}, function (_lodash) {
            _ = _lodash.default;
        }, function (_svg_ctrl) {
            SVGCtrl = _svg_ctrl.SVGCtrl;
        }],
        execute: function () {
            _export('PanelCtrl', SVGCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map
