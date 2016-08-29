'use strict';

System.register(['lodash', './svg_ctrl'], function (_export, _context) {
  "use strict";

  var _, SVGCtrl;

  return {
    setters: [function (_lodash) {
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
