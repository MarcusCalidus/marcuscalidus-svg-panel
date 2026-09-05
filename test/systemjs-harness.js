const fs = require('fs');
const path = require('path');
const vm = require('vm');

/**
 * A minimal System.register loader, enough to execute the plugin's built
 * bundles outside Grafana. Grafana supplies the modules listed here at
 * runtime; the stubs stand in for them.
 */
function loadBundle(distDir, entry, extraStubs = {}) {
    const loaded = new Map();

    const stubs = Object.assign({
        lodash: require('lodash'),
        jquery: function () {},
        'jquery.flot': {},
        'jquery.flot.pie': {},
        'app/plugins/sdk': {MetricsPanelCtrl: class MetricsPanelCtrl {}, loadPluginCss: () => undefined},
        'app/core/utils/kbn': {valueFormats: {}},
        'app/core/time_series': class TimeSeries {}
    }, extraStubs);

    function load(specifier) {
        if (stubs[specifier]) {
            return stubs[specifier];
        }
        // the vendored browser libraries the build copies in (snapsvg, brace)
        // need a real DOM; the panel's own module graph is what is under test
        if (specifier.includes('node_modules/')) {
            const snapStub = function Snap() {};
            snapStub.default = snapStub;
            return snapStub;
        }
        if (loaded.has(specifier)) {
            return loaded.get(specifier);
        }

        const file = path.join(distDir, specifier.replace(/^\.\//, ''));
        const resolved = fs.existsSync(file) ? file : file + '.js';
        if (!fs.existsSync(resolved)) {
            // a framework file the panel copies in (snapsvg, brace); not needed here
            return {};
        }

        const exports = {};
        loaded.set(specifier, exports);

        let registration;
        const sandbox = {
            System: {
                register(deps, declare) {
                    registration = {deps, declare};
                }
            },
            console,
            // polyfills.js patches DOM prototypes at load time; these stand in
            // for the browser globals it expects to find
            Element: function Element() {},
            Document: function Document() {},
            DocumentFragment: function DocumentFragment() {},
            Node: function Node() {},
            document: {createDocumentFragment: () => ({appendChild: () => undefined})},
            window: {},
            require
        };
        vm.createContext(sandbox);
        vm.runInContext(fs.readFileSync(resolved, 'utf8'), sandbox, {filename: resolved});

        if (!registration) {
            return exports;
        }

        const _export = (name, value) => {
            if (typeof name === 'object') {
                Object.assign(exports, name);
            } else {
                exports[name] = value;
            }
        };

        const body = registration.declare(_export, {id: specifier});
        registration.deps.forEach((dep, index) => {
            const depExports = load(dep);
            if (body.setters && body.setters[index]) {
                body.setters[index](depExports);
            }
        });
        body.execute();

        return exports;
    }

    return load(entry);
}

module.exports = {loadBundle};
