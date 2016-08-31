import _ from 'lodash';
import $ from 'jquery';
import 'jquery.flot';
import 'jquery.flot.pie';

export class SVGDemos  {

    constructor(ctrl) {
    	this.ctrl = ctrl;
    } 

 	clock() {
 		this.ctrl.panel.svg_data = 
 		  '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 200 200" >\n'+
 		  '  <circle id="circle" style="stroke: black; fill: #f8f8f8;" cx="100" cy="100" r="100"/>\n'+
 		  ' <line id="hour0" x1="100" y1="10"  x2="100" y2="0" style="stroke: green;"/>\n'+
 		  ' <line id="hour1" x1="150" y1="13"  x2="145" y2="22" style="stroke: green;"/>\n'+
	   	  ' <line id="hour2" x1="187" y1="50"  x2="178" y2="55" style="stroke: green;"/>\n'+
	   	  ' <line id="hour3" x1="190" y1="100" x2="200" y2="100" style="stroke: green;"/>\n'+
	   	  ' <line id="hour4" x1="187" y1="150" x2="178" y2="145" style="stroke: green;"/>\n'+
	   	  ' <line id="hour5" x1="150" y1="187" x2="145" y2="178" style="stroke: green;"/>\n'+
	   	  ' <line id="hour6" x1="100" y1="190" x2="100" y2="200" style="stroke: green;"/>\n'+
	   	  ' <line id="hour7" x1="50"  y1="187" x2="55"  y2="178" style="stroke: green;"/>\n'+
	   	  ' <line id="hour8" x1="13"  y1="150" x2="22"  y2="145" style="stroke: green;"/>\n'+
	   	  ' <line id="hour9" x1="0"   y1="100" x2="10"  y2="100" style="stroke: green;"/>\n'+
	   	  ' <line id="hour10" x1="13"  y1="50"  x2="22"  y2="55" style="stroke: green;"/>\n'+
	  	  ' <line id="hour11" x1="50"  y1="13"  x2="55"  y2="22" style="stroke: green;"/>\n'+
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


