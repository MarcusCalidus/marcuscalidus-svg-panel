# Summary
Grafana panel for displaying metric sensitive SVG images using the snap svg library ([http://snapsvg.io/](http://snapsvg.io/)).

You need the latest grafana build for Grafana 3.0 to enable plugin support. You can get it here : http://grafana.org/download/builds.html

# Example

![Screenshot](https://raw.githubusercontent.com/MarcusCalidus/marcuscalidus-svg-panel/master/dist/img/inAction.png)

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

# Options

## SVG Builder

![Screenshot](https://raw.githubusercontent.com/MarcusCalidus/marcuscalidus-svg-panel/master/dist/img/svgBuilder.png)

### Adding your own SVG repository

To add your own custom SVG graphics you have to fork the original project and add them to the assets folder. If your repository is of general concern and your license allows sharing you can also add it to the panel plugin via [pull request on github](https://github.com/MarcusCalidus/marcuscalidus-svg-panel/) 

## SVG Data 
paste your svg code here. Don't forget to include a viewbox and IDs for all relevant objects. 

_Note: You cannot use SVG Data editor together with the use SVG Builder option checked!_

![Screenshot](https://raw.githubusercontent.com/MarcusCalidus/marcuscalidus-svg-panel/master/dist/img/svgData.png)

## Demos
For a start check out the Demo-SVGs provided with the panel plugin. To load them go to the bottom of the options page and click the corresponding button

![Screenshot](https://raw.githubusercontent.com/MarcusCalidus/marcuscalidus-svg-panel/master/dist/img/demoButtons.png)
## Events
### onHandleMetric
this code is execute upon **every Rerfresh**

```
onHandleMetric(ctrl: MetricsPanelCtrl, svgnode: HTMLElement)
```

`ctrl` passes a grafana `MetricsPanelCtrl` object. This object contains all relevant data pertainig the current panel. 
You may want to use the `ctrl.data` array property to access the current measurement data.

`svgnode` passes the HTMLElement of the svg object on the panel. You can access the elements of the svg itself by using the integrated Snap Library. ([http://snapsvg.io/](http://snapsvg.io/))

```
var s = Snap(svgnode);
s.select('#status')
```

![Screenshot](https://raw.githubusercontent.com/MarcusCalidus/marcuscalidus-svg-panel/master/dist/img/onHandleMetric.png)

### onInit
this event is executed **once**, right after the first initializiation of the SVG.
```
onHandleMetric(ctrl: MetricsPanelCtrl, svgnode: HTMLElement)
```

`ctrl` passes a grafana `MetricsPanelCtrl` object. This object contains all relevant data pertainig the current panel. 
You may want to use the `ctrl.data` array property to access the current measurement data.

`svgnode` passes the HTMLElement of the svg object on the panel. You can access the elements of the svg itself by using the integrated Snap Library. ([http://snapsvg.io/](http://snapsvg.io/))

```
var s = Snap(svgnode);
s.select('#status')
```

![Screenshot](https://raw.githubusercontent.com/MarcusCalidus/marcuscalidus-svg-panel/master/dist/img/onInit.png)

# Changelog
## 0.3.4
- fixed rendering of SVG that were not able to resize to small heights

## 0.3.3
- fixed rendering of SVG which are higher than wide

## 0.3.1
- Package update due to security vulnerabilities.

## 0.3.0
- Implemented support for data in docs type. (e.g. Elasticsearch Raw Document) Thanks to Zoltán Szabó (https://github.com/zoell)
- The data passed to the panel is now stored in the `ctrl.data` property. The alias property `ctrl.series` should not be used anymore and is to be regarded deprecated. 
 
## 0.2.0
- Implemented support for data in table format. Thanks to Lauri Saurus (https://github.com/saurla)

## 0.1.1
- now includes JavaScript code completion for the objects this, ctrl and svgnode.

![Screenshot](https://raw.githubusercontent.com/MarcusCalidus/marcuscalidus-svg-panel/master/dist/img/codeCompletion_0.1.1.png)

## 0.1.0
- BREAKING: plugin was renamed marcuscalidus-svg-panel in line with http://docs.grafana.org/plugins/developing/code-styleguide/

 ### Steps to update from older version
 
 * export dashboard containing grafana-svg-panel as json
 * install marcuscalidus-svg-panel plugin. Either by cloning it into separate folder (=safe method) or by pulling it into the current version.
 * replace all occurrences of grafana-svg-panel with marcuscalidus-svg-panel in the json file.
 * reimport the json to overwrite the existing dashboard

## 0.0.5
* ace editor for code editing
## 0.0.4
* panel now runs smoothly in IE11 (added necessary polyfill)
## 0.0.3
* fixed bug with onInit function in Grafana 5
* new method for injecting SVG via Snap svg library
## 0.0.2
* added SVG Builder
## 0.0.1
* Initial build
