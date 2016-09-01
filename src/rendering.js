import _ from 'lodash';
import $ from 'jquery';
import 'jquery.flot';
import 'jquery.flot.pie';

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

      height -= 5; // padding
      height -= panel.title ? 24 : 9; // subtract panel title bar

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
    var xml = jQuery.parseXML(panel.svg_data);
     
    for (var i = 0; i < xml.documentElement.attributes.length; i++) {
      var attrib = xml.documentElement.attributes[i];
      svgnode.setAttribute(attrib.name, attrib.value);
	} 
	
    $(svgnode).html(xml.documentElement.children); 
  } 

  function resizePlotCanvas() {
    var width = elem.width();
    var height = elem.height();

    var size = Math.min(width, height);

    var plotCss = {
      top: '10px',
      margin: 'auto',
      position: 'relative',
      height: (size) + 'px'
    };
    plotCanvas.css(plotCss);
  }
   
  function render() {
    panel = ctrl.panel;

    if (setElementHeight()) { 
      svgnode = svgelem.contentDocument.documentElement;
      
      resizePlotCanvas();
            
      if (!ctrl.initialized) {
        addSVG();    
        panel.doInit(ctrl, svgnode);
        ctrl.initialized = 1;
      }
        
      panel.handleMetric(ctrl, svgnode); 
      
      svgnode = null;
    } else {
      ctrl.initialized = 0;
    }
  }
}

