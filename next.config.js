const path = require('path');
const rehypePrism = require('@mapbox/rehype-prism');

const isProd = process.env.NODE_ENV === 'production';
// Adds github.com/mdx-js/mdx to Next.js
const withMDX = require('@next/mdx')({
    extension: /\.(md|mdx)?$/,
    options: {
        hastPlugins: [rehypePrism],
    },
});

module.exports = withMDX({
    target: 'serverless',

    experimental: {
        css: true,
    },

    exportTrailingSlash: true,

    // Allow mdx and md files to be pages
    pageExtensions: ['jsx', 'js', 'mdx', 'md'],

    assetPrefix: isProd ? '' : '',

    env: {
        VERSION: require('./package.json').version,
        API_URL: process.env.API_URL,
        IMAGE_ASSETS_URL: 'https://assets.zeit.co/image/upload/front',
        ASSETS: isProd ? '/static' : '/static',
    },

    webpack(config, option){
        // ~ alias
        config.resolve.alias['~'] = path.resolve(__dirname);

        if (option.isServer) {
            require('./scripts/generate-site-map')
        }
        return config;
    },
});
