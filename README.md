You need the lastest grafana build for Grafana 3.0 to enable plugin support. You can get it here : http://grafana.org/download/builds.html

## Installation

It is possible to clone this repo directly into your plugins directory.

Afterwards restart grafana-server and the plugin should be automatically detected and used.

```
npm install
grunt
sudo service grafana-server restart
```


## Clone into a directory of your choice

If the plugin is cloned to a directory that is not the default plugins directory then you need to edit your grafana.ini config file (Default location is at /etc/grafana/grafana.ini) and add this:

```ini
[plugin.svg]
path = /home/your/clone/dir/svg-panel
```

Note that if you clone it into the grafana plugins directory you do not need to add the above config option. That is only
if you want to place the plugin in a directory outside the standard plugins directory. Be aware that grafana-server
needs read access to the directory.

#Usage
##Demos
For a start check out the Demo-SVGs provided with the panel plugin. To load them go to the bottom of the options page and click the corresponding button

##Events
###onHandleMetric
this code is execute upon **every Rerfresh**

```
onHandleMetric(ctrl: MetricsPanelCtrl, svgnode: HTMLElement)
```

`ctrl` passes a grafana `MetricsPanelCtrl` object. This object contains all relevant data pertainig the current panel. 
You may want to use the `ctrl.series` array property to access the current measurement data.

`svgnode` passes the HTMLElement of the svg object on the panel. You can access the elements of the svg itself by using the integrated Snap Library. ([http://snapsvg.io/](http://snapsvg.io/))

```
var s = Snap(svgnode);
s.select('#status')
```


###onInit
this event is executed **once**, right after the first initializiation of the SVG.
```
onHandleMetric(ctrl: MetricsPanelCtrl, svgnode: HTMLElement)
```

`ctrl` passes a grafana `MetricsPanelCtrl` object. This object contains all relevant data pertainig the current panel. 
You may want to use the `ctrl.series` array property to access the current measurement data.

`svgnode` passes the HTMLElement of the svg object on the panel. You can access the elements of the svg itself by using the integrated Snap Library. ([http://snapsvg.io/](http://snapsvg.io/))

```
var s = Snap(svgnode);
s.select('#status')
```

##SVG Data 
paste your svg code here. Don't forget to include a viewbox and IDs for all relevant objects.

# Changelog

## 0.0.1

* Initial build