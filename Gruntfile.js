module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({

        clean: ["dist"],

        copy: {
            src_to_dist: {
                cwd: 'src',
                expand: true,
                src: ['**/*', '!**/*.js', '!**/*.scss'],
                dest: 'dist'
            },
            img_to_dist: {
                expand: true,
                src: ['img/**'],
                dest: 'dist'
            },
            assets_to_dist: {
                expand: true,
                src: ['assets/**'],
                dest: 'dist'
            },
            pluginDef: {
                expand: true,
                src: ['plugin.json', 'README.md'],
                dest: 'dist',
            },
            frameworks: {
                expand: true,
                src: [
                    'node_modules/snapsvg/dist/snap.svg-min.js',
                    'node_modules/brace/index.js',
                    'node_modules/brace/ext/language_tools.js',
                    'node_modules/brace/mode/javascript.js',
                    'node_modules/brace/mode/svg.js',
                    'node_modules/brace/worker/javascript.js',
                    'node_modules/brace/worker/xml.js',
                    'node_modules/brace/theme/tomorrow_night_bright.js'
                ],
                dest: 'dist',
            }
        },

        watch: {
            rebuild_all: {
                files: ['src/**/*', 'plugin.json'],
                tasks: ['default'],
                options: { spawn: false }
            },
        },

        babel: {
            options: {
                sourceMap: true,
                // Babel 7 equivalents of the former es2015 preset and its
                // systemjs / for-of transforms (for-of is part of preset-env)
                presets: [['@babel/preset-env', {modules: false}]],
                plugins: ['@babel/plugin-transform-modules-systemjs'],
            },
            dist: {
                files: [{
                    cwd: 'src',
                    expand: true,
                    src: ['*.js'],
                    dest: 'dist',
                    ext: '.js'
                }]
            },
        },

    });

    grunt.registerTask('default', ['clean', 'copy:src_to_dist', 'copy:img_to_dist', 'copy:assets_to_dist', 'copy:pluginDef', 'babel', 'copy:frameworks']);
};