export default defineConfig({
    plugins: [react()],
    assetsInclude: ['**/*.xml'], // include .xml files as assets
    resolve: {
        alias: {
            '@': '/src',
        },
    },
});
