import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react({ include: /\.(jsx|js|tsx|ts)$/ })],
    resolve: {
        alias: [
            { find: /^~bootstrap-sass/, replacement: 'bootstrap-sass' },
            { find: 'react-custom-scrollbars', replacement: path.resolve(__dirname, '../../src/index.ts') }
        ],
        dedupe: ['react', 'react-dom']
    },
    server: {
        fs: {
            allow: ['..']
        }
    },
    esbuild: {
        loader: "tsx",
        include: /.*\.[tj]sx?$/,
        exclude: []
    },
    optimizeDeps: {
        exclude: ['react-custom-scrollbars'],
        esbuildOptions: {
            loader: {
                '.js': 'tsx',
            },
        },
    },
})
