const path = require('path');

module.exports = {
    devServer: {
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: 'http://ec2-3-108-218-11.ap-south-1.compute.amazonaws.com:8080',
                changeOrigin: true,
            },
        },
    },
};
