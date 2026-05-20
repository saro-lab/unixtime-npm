import { defineConfig } from 'tsup';
import pkg from './package.json';

export default defineConfig([
    {
        entry: {
            [`infinite-unixtime-${pkg.version}`]: 'src/index.ts',
        },
        format: ['iife'],
        globalName: '$Unixtime',
        clean: true,
        outExtension: () => ({js: '.js',}),
        footer: {
            js: 'if (typeof $Unixtime !== "undefined" && $Unixtime.Unixtime) { $Unixtime = $Unixtime.Unixtime; if (!window.Unixtime) { window.Unixtime = $Unixtime; } }'
        }
    },
    {
        entry: {
            [`infinite-unixtime-${pkg.version}`]: 'src/index.ts',
        },
        format: ['iife'],
        globalName: '$Unixtime',
        clean: true,
        minify: true,
        outExtension: () => ({js: '.min.js',}),
        footer: {
            js: 'if (typeof $Unixtime !== "undefined" && $Unixtime.Unixtime) { $Unixtime = $Unixtime.Unixtime; if (!window.Unixtime) { window.Unixtime = $Unixtime; } }'
        }
    }
]);
