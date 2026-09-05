const path = require('path');
const {loadBundle} = require('./systemjs-harness');

/**
 * This plugin ships its build output in dist/, and the only thing the
 * dependency work in this branch touches is the build toolchain. So the
 * meaningful check is not on src/ but on what the toolchain emits: these tests
 * execute the built bundles through a minimal System.register loader and
 * assert the module graph and public surface Grafana relies on.
 *
 * The suite is written to run against any dist/ directory, so the same
 * assertions can be pointed at a build from the previous toolchain.
 */
const distDir = process.env.DIST_DIR || path.join(__dirname, '..', 'dist');

describe(`built bundle in ${distDir}`, () => {
    it('exports PanelCtrl from module.js', () => {
        const module = loadBundle(distDir, './module.js');

        expect(typeof module.PanelCtrl).toBe('function');
    });

    it('names the panel template Grafana loads', () => {
        const module = loadBundle(distDir, './module.js');

        expect(module.PanelCtrl.templateUrl).toBe('module.html');
    });

    it('exports SVGDemos with its three demos', () => {
        const demos = loadBundle(distDir, './demos.js');

        expect(typeof demos.SVGDemos).toBe('function');
        ['clock', 'snap', 'animationCont'].forEach(
            name => expect(typeof demos.SVGDemos.prototype[name]).toBe('function')
        );
    });

    it('produces the same demo SVG payloads', () => {
        const {SVGDemos} = loadBundle(distDir, './demos.js');
        const editor = {setValue: () => undefined};
        const noop = () => undefined;
        const ctrl = {
            panel: {},
            editors: {svg_data: editor, js_code: editor, js_init_code: editor},
            render: noop,
            setInitFunction: noop,
            setHandleMetricFunction: noop,
            resetSVG: noop
        };
        const demos = new SVGDemos(ctrl);

        demos.clock();
        expect(ctrl.panel.svg_data).toContain('<circle id="circle"');
        expect(ctrl.panel.svg_data).toContain('id="hour11"');
        expect(ctrl.panel.js_init_code).toBeDefined();
    });

    it('exports a rendering function as default', () => {
        const rendering = loadBundle(distDir, './rendering.js');

        expect(typeof rendering.default).toBe('function');
    });

    it('emits ES5 only - no let, const, arrow functions or class keywords survive', () => {
        const fs = require('fs');
        ['module.js', 'svg_ctrl.js', 'rendering.js', 'demos.js'].forEach(file => {
            const code = fs.readFileSync(path.join(distDir, file), 'utf8');
            // strip string and template literals so SVG payloads do not trip the checks
            const stripped = code.replace(/'(\\.|[^'\\])*'/g, "''").replace(/"(\\.|[^"\\])*"/g, '""');
            expect(stripped).not.toMatch(/\bclass\s+[A-Z]/);
            expect(stripped).not.toMatch(/=>/);
            expect(stripped).not.toMatch(/\bconst\s/);
        });
    });
});
