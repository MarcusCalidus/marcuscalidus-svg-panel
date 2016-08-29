import _ from 'lodash';
import $ from 'jquery';
import 'jquery.flot';
import 'jquery.flot.pie';

export class SVGDemos  {

    constructor(ctrl) {
    	this.ctrl = ctrl;
    } 

 	clock() {
 		console.log(this);
 		this.ctrl.panel.svg_data = 
 		  '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewbox="0 0 200 200" >\n'+
 		  '  <circle id="circle" style="stroke: black; fill: #f8f8f8;" cx="100" cy="100" r="100"/>\n'+
          '    <g>\n'+
          '      <line x1="100" y1="100" x2="100" y2="45" style="stroke-width: 6px; stroke: green;" id="hourhand" />\n'+
          '      <line x1="100" y1="100" x2="100" y2="15" style="stroke-width: 4px; stroke: blue;"  id="minutehand"/>\n'+
          '      <line x1="100" y1="100" x2="100" y2="5"  style="stroke-width: 2px; stroke: red;"   id="secondhand"/>\n'+
          '    </g>\n'+
          '</svg>';
          
        this.ctrl.panel.js_code = 
            'var now = new Date();\n'+
			'var angle = 360 * now.getHours()   / 12;\n'+
			'elem.find("#hourhand").attr("transform", "rotate("+angle.toString()+ " 100 100)"  );\n'+
			'var angle = 360 * now.getMinutes() / 60;\n'+
			'elem.find("#minutehand").attr("transform", "rotate("+angle.toString()+ " 100 100)"  );\n'+
			'var angle = 360 * now.getSeconds() / 60;\n'+
			'elem.find("#secondhand").attr("transform", "rotate("+angle.toString()+ " 100 100)"  );';
 	}
}


