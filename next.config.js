let path = null;

if(process.env.APP_ENV !== "development") {
    path = process.env.BASE_PATH;
}

module.exports = {
    distDir: 'build',
    images: {
        loader: 'akamai',
        path: path || '/',
    },
    basePath: path || ''
}