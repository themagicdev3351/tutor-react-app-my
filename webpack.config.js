const path = require('path');

module.exports = {
    devServer: {
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: 'http://ec2-3-108-218-11.ap-south-1.compute.amazonaws.com:8080', // Your backend API
                changeOrigin: true,
                secure: false, // Set to false if your backend is using HTTP
                pathRewrite: { '^/api': '' }, // Remove '/api' from the request path if necessary
            },
        },
        // If you want to run on HTTPS
        https: true, // Set to true if you want to serve your React app over HTTPS during development
        port: 3000,
    },

};
