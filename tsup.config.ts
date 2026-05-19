import { defineConfig } from 'tsup';
import pkg from './package.json';

export default defineConfig({
    entry: {
        [`infinite-unixtime-${pkg.version}`]: 'src/index.ts',
    },
    format: ['iife'],
    globalName: 'unixtime',
    clean: true,
    outExtension() {
        return {
            js: '.js',
        };
    },
});
