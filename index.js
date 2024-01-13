'use strict'

const http = require('http')
const LoadManager = require('./load_manager.js')

const { DEFAULT_PORT, MIME_TYPES, CODE, STATUS, UTF8, API_PREFIX } = require('./constants.js')

const testFM = new LoadManager()

/**
* @description получение и кэширование запрашиваемых файлов, при необходимости - обработка ошибок
*/
const fileRespond = async function(response, path, contentType = MIME_TYPES.html) {
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
        const filePath = '/index.html'
        fileRespond(response, filePath)
		return
	}
	
	const extName = url.split('.').pop().toString()
	const mimeType = MIME_TYPES[extName]	
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
console.log(`test server run on port[${PORT_USED}]`)

myServer.listen(PORT_USED)