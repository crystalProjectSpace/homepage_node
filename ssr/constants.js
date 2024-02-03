'use strict'

module.exports = {
	DEFAULT_PORT: 3000,
	API_PREFIX: 'api',
	CACHE_EXPIRATION: 1000,//3.6E6,
	UTF8: 'utf8',
	STATUS: {
		CACHED: 'cached',
		LOAD: 'load',
        FAIL: 'fail',
	},
	MIME_TYPES: {
        html: 'text/html',
        js: 'text/javascript',
        mjs: 'text/javascript',
        css: 'text/css',
        json: 'application/json',
        png: 'image/png',
        jpg: 'image/jpg',
        gif: 'image/gif',
        svg: 'image/svg+xml',
        wav: 'audio/wav',
        mp4: 'video/mp4',
        woff: 'application/font-woff',
        ttf: 'application/font-ttf',
        eot: 'application/vnd.ms-fontobject',
        otf: 'application/font-otf',
        wasm: 'application/wasm',
        ico: 'image/x-icon',
    },
	CODE: {
		SUCCESS: 200,
		INNER_ERR: 500,
		NOT_FOUND: 404,
	},
    PATH: {
        PAGE: '/pages',
        STYLE: '/styles',
        SCRIPT_CLIENT: '/script_client',
    },
    GET: 'GET',
    POST: 'POST',
}