const {
        HotModuleReplacementPlugin,
        NoEmitOnErrorsPlugin,
        NamedModulesPlugin,
        DefinePlugin,
        LoaderOptionsPlugin,
        optimize:{
            CommonsChunkPlugin,
            ModuleConcatenationPlugin,
            UglifyJsPlugin
        }
    } = require('webpack'),
    npmInstallPlugin = require('npm-install-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    path = require('path'),
    NODE_ENV = process.env.NODE_ENV || 'development',
    PRODUCTION  = NODE_ENV === 'production',
    DEVELOPMENT  = NODE_ENV === 'development';



const GLOBALS = {
    'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV)
    }
};

const publicEntries = {
    'app': ['react-hot-loader/patch', './index.js'],
    'vendor': ['./vendor.js'],
};

const ProdPlugins  = [
    new ModuleConcatenationPlugin(),
    new UglifyJsPlugin({
        // extractComments:{
        //     banner:"Hello my Dear ;) Searching for ... what?"
        // },
        // warnings: false,
        // compress: {
        //     // unsafe:true,
        //     properties: false,
        //     sequences: true,
        //     dead_code: true,
        //     conditionals: true,
        //     booleans: true,
        //     unused: true,
        //     if_return: true,
        //     join_vars: true,
        //     drop_debugger:true,
        //     drop_console: true
        // },
        // uglifyOptions: {
        //         output: {
        //             quote_keys: true,
        //             max_line_len:114,
        //             comments: false,
        //             beautify: false,
        //         },
        //         parse:{
        //             html5_comments:false,
        //             shebang:false
        //         },
        //         mangle: {
        //             toplevel:true,
        //         }
        //     }
    })
];

const DevPlugins = [
    new HotModuleReplacementPlugin(),
    new NoEmitOnErrorsPlugin(),
    new NamedModulesPlugin(),
    new npmInstallPlugin()
];

const plugins = [...(_ => PRODUCTION ? ProdPlugins : DevPlugins)(),
    new DefinePlugin(GLOBALS),
    new ExtractTextPlugin({filename: "css/[name].css"}),
    new CommonsChunkPlugin({
        name: 'vendor',
        // chunks: Object.keys(publicEntries),
        minChunks: 2
    }),
    new LoaderOptionsPlugin({
        minimize: PRODUCTION,
        debug: DEVELOPMENT,
        noInfo: true,
    }),
];



module.exports = {
    context: path.resolve(__dirname, '../src'),
    entry: publicEntries,
    output: {
        pathinfo: NODE_ENV === 'development',
        path: path.resolve('public/build'),
        publicPath: '/build/',
        filename: 'js/[name].js',
        library: '[name]'
    },

    plugins,
    module: {
        loaders:[{
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
                presets:['react', 'es2015', 'stage-2'],
                env: {
                    "development": {
                        "presets": ["react-hmre"]
                    }
                },
                plugins: [
                    "transform-react-constant-elements",
                    "transform-react-remove-prop-types"
                ]
            },
            exclude: /node_modules/,
        }, {
            test: /\.(css|scss)$/,
            loaders:  ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader"],
            })),
            exclude: /node_modules/
        },
            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[name]-[hash].[ext]'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream&name=fonts/[name]-[hash].[ext]'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=fonts/[name]-[hash].[ext]'}
        ]
    },
    devtool: NODE_ENV === 'development' ? 'cheap-inline-module-source-map' : false
};
