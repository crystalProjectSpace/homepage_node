'use strict'

const http = require('http')
const LoadManager = require('./ssr/load_manager.js')
const GetManager = require('./ssr/get_manager.js')

const { DEFAULT_PORT, MIME_TYPES, CODE, STATUS, UTF8, API_PREFIX, PATH, GET, POST } = require('./ssr/constants.js')

const POSITIONS = {
	PREFIX: 0,
	METHOD: 1,
	PARAMS: 2,
}

const HTML_PAGES = ['article']

const testFM = new LoadManager()
const testGM  = new GetManager()

/**
* @description получение и кэширование запрашиваемых файлов, при необходимости - обработка ошибок
* @todo rewrite using 
* @warning file-write couldn't serve binaries
*/

const getRelevantPage = function(url) {
	const hasExtension = url.match(/\.[\w\d]+$/i)
	if(hasExtension) return url

	const prefix = url.split('/').filter(Boolean)[POSITIONS.PREFIX]

	switch(prefix) {
		case 'article': return `${PATH.PAGE}/article.html`
		default: return ''
	}
}

const fileRespond = async function(response, path, contentType = MIME_TYPES.html) {

	const isImg = [MIME_TYPES.png, MIME_TYPES.jpg, MIME_TYPES.gif].includes(contentType);
	if (!isImg) {
		const { content, status } = await testFM.getFile(path, true)
	
		switch(status) {
			case STATUS.LOAD:
			case STATUS.CACHED: {
					response.writeHead(CODE.SUCCESS, { 'Content-type': contentType })
					response.end(content, UTF8 )
				return	
			}
			default:
			case 'ENOENT': {
				response.writeHead(CODE.NOT_FOUND, { 'Content-type': MIME_TYPES.html })
				response.end('<p>sorry, not found</p>', UTF8)	
				return
			}
		}
	} else {
		const {status} = await testFM.getMedia(path, response, contentType)
		switch(status) {
			case STATUS.LOAD: return
			default:
			case STATUS.FAIL: {
				response.writeHead(CODE.NOT_FOUND, { 'Content-type': MIME_TYPES.html })
				response.end('<p>sorry, not found</p>', UTF8)	
				return
			}
		}
	}
}
/**
* @description обработка файловых запросов
*/
const fileHandler = function(url, response) {
	if (url === '/') {
        const filePath = `${PATH.PAGE}/index.html`
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
const apiGetHandler = async function(url, response) {
	const URLComponents = url.split('/').filter(Boolean)
	const handle = URLComponents[POSITIONS.METHOD]
	switch(handle) {
		case 'article': 
		const pageId = URLComponents[POSITIONS.PARAMS]
			const { content } = await testGM.getPage(pageId)
			response.writeHead(CODE.SUCCESS, { 'Content-type': 'application/json' })
			response.end(content, UTF8 )
			return;
		default: return;
	}
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
	const prefix = url.split('/').filter(Boolean)[POSITIONS.PREFIX]
	const isApi = prefix === API_PREFIX
	
	if (isApi) {
		switch(method) {
			case GET: apiGetHandler(url, response)
			case POST: apiPostHandler(url, response)
		}
	} else {
		const isPage = HTML_PAGES.includes(prefix)
		const _url =  isPage ? getRelevantPage(url) : url
		fileHandler(_url, response)
	}
}

const myServer = http.createServer(requestHandler)
console.log(`test server run on port[${DEFAULT_PORT}]`)

myServer.listen(DEFAULT_PORT)