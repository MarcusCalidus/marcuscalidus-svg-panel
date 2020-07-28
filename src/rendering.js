import _ from 'lodash';
import $ from 'jquery';
import 'jquery.flot';
import 'jquery.flot.pie';
import * as SnapLib  from './node_modules/snapsvg/dist/snap.svg-min.js';

export default function link(scope, elem, attrs, ctrl) {
  var panel;
  var svgelem = elem[0].getElementsByClassName('svg-object')[0];
  elem = elem.find('.svg-panel');
  var plotCanvas = elem.find('.plot-canvas');
  var svgnode;

  ctrl.events.on('render', function() {
    render();
    ctrl.renderingCompleted();
  });

  function setElementHeight() {
    try {
      var height = ctrl.height || panel.height || ctrl.row.height;
      if (_.isString(height)) {
        height = parseInt(height.replace('px', ''), 10);
      }

     // height -= 5; // padding
     // height -= panel.title ? 12 : 5; // subtract panel title bar

      elem.css('height', height + 'px');

      return true;
    } catch(e) { // IE throws errors sometimes
      return false;
    }
  }

  function formatter(label, slice) {
    return "<div style='font-size:" + ctrl.panel.fontSize + ";text-align:center;padding:2px;color:" + slice.color + ";'>" + label + "<br/>" + Math.round(slice.percent) + "%</div>";
  }

  function addSVG() {
    let parentSVG = SnapLib.default(svgnode);
    parentSVG.paper.clear();

    let childSVG = Snap.parse(panel.svg_data);
    parentSVG.node.append(childSVG.node);
  } 

  function resizePlotCanvas() {     
    var plotCss = {
      margin: 'auto',
      position: 'relative',
      height: elem.height() + 'px'
    };
    plotCanvas.css(plotCss);
  }
   
  function render() {
    panel = ctrl.panel;

    if (setElementHeight()) { 
      if (svgelem) {
      	svgnode = svgelem;
      	
      	if (svgnode.getAttribute("name") == 'isInitial') {
      	  svgnode.removeAttribute("name");
      	  ctrl.initialized = 0;
        }
      
      	resizePlotCanvas();
            
      	if (!ctrl.initialized) {
        	addSVG();    
        	panel.doInit(ctrl, svgnode);
        	ctrl.initialized = 1;
      	}
        
      	panel.handleMetric(ctrl, svgnode); 
      
      	svgnode = null;
      }
   	  else {
        ctrl.initialized = 0;
      }
    }
  }
}

