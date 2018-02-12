# 0.1.0
- BREAKING: plugin was renamed marcuscalidus-svg-panel in line with http://docs.grafana.org/plugins/developing/code-styleguide/


 ### Steps to update from older version
 
 * export dashboard containing grafana-svg-panel as json
 * install marcuscalidus-svg-panel plugin. Either by cloning it into separate folder (=safe method) or by pulling it into the current version.
 * replace all occurrences of grafana-svg-panel with marcuscalidus-svg-panel in the json file.
 * reimport the json to overwrite the existing dashboard

# 0.0.5
- ace editor for code and SVG editing
## 0.0.4
- panel now runs smoothly in IE11 (added neccessary polyfill)
## 0.0.3
- fixed bug with onInit function in Grafana 5
- new method for injecting SVG via Snap svg library
## 0.0.2
### New features
- SVG Builder to compose your own complex SVG dashboard
## 0.0.1
Initial release