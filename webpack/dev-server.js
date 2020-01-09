const wp_config = require('./webpack.config'),
    configs = require('./frontEndConfigs');


if (configs.useBrowserSynk) {
    const BrowserSync = require('browser-sync-webpack-plugin');
    wp_config.plugins.push(new BrowserSync({
        host: configs.wp_devServerHost,
        port: configs.browserSynkPort,
        proxy: configs.browserSynkProxy,
        // server: { baseDir: ['public'] }
    }, { reload: false}));
}


wp_config.devServer = {
    noInfo: true,
    proxy: {
        '*': {
            target: configs.proxyUrl,
            secure: false
        }
    },
    port:configs.wp_devServerPort,
    compress: true,
    stats: {
        colors: true
    },
    historyApiFallback: false,
    open:true,
    hot: true,
    filename: wp_config.output.filename,
    publicPath:wp_config.output.publicPath,
};

module.exports = wp_config;



