'use strict'

const http = require('http')
const LoadManager = require('./ssr/load_manager.js')

const { DEFAULT_PORT, MIME_TYPES, CODE, STATUS, UTF8, API_PREFIX, PATH, GET, POST } = require('./ssr/constants.js')

const testFM = new LoadManager()

/**
* @description получение и кэширование запрашиваемых файлов, при необходимости - обработка ошибок
*/
const fileRespond = async function(response, path, contentType = MIME_TYPES.html) {
	console.log(path);
	const { content, status } = await testFM.getFile(path, true)
	
	switch(status) {
		case STATUS.LOAD:
		case STATUS.CACHED: {
			response.writeHead(CODE.SUCCESS, { 'Content-type': contentType })
			response.end(content, UTF8)
			return	
		}
		case 'ENOENT': {
			response.writeHead(CODE.NOT_FOUND, { 'Content-type': MIME_TYPES.html })
			response.end('<p>sorry, not found</p>', UTF8)	
			return
		}
	}
}
/**
* @description обработка файловых запросов
*/
const fileHandler = function(url, response) {
	if (url === '/') {
        const filePath = `${PATH.PAGE}/index.html`
		console.log(filePath)
        fileRespond(response, filePath)
		return
	}
	
	const extName = url.split('.').pop().toString()
	const mimeType = MIME_TYPES[extName]
	console.log('mimeType', mimeType)
	fileRespond(response, url, mimeType)
}
/**
* @description обработка GET-запросов
*/
const apiGetHandler = function(url, response) {
	
}
/**
* @description обработка POST-запросов
*/
const apiPostHandler = function(url, response) {
	
}
/**
* @description обработка запросов с выбором соответствующего способа в зависимости от пути и метода запроса
*/
const requestHandler = (request, response) => {
	const { method, url } = request
	const prefix = url.split('/').filter(Boolean).shift()
	const isApi = prefix === API_PREFIX
	
	if (isApi) {
		switch(method) {
			case GET: apiGetHandler(url, response)
			case POST: apiPostHandler(url, response)
		}
	} else {
		fileHandler(url, response)
	}
}

const myServer = http.createServer(requestHandler)
console.log(`test server run on port[${DEFAULT_PORT}]`)

myServer.listen(DEFAULT_PORT)