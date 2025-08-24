import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import rawPlugin from 'vite-plugin-raw';

export default defineConfig({
    plugins: [
        react(),
        rawPlugin({
            fileRegex: /\.xml$/, // 👈 Treat all .xml as raw text
        }),
    ],
});
