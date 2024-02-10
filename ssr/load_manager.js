'use strict'

const { readFile } = require('fs').promises
const { createReadStream } = require('fs')
const { UTF8, STATUS, CACHE_EXPIRATION } = require('./constants.js')
const { performance } = require('node:perf_hooks')

const LoadManager = function() {
	this.cached = new Map()
}
/**
* @description загрузить и кэшировать файл
* @warning связка readFile/ return неадекватно работает с бинарниками
*/
LoadManager.prototype.getFile = async function(path, relative, forced = false) {
	const _path = relative ? `.${path}` : path
	if (!forced) {
		const _cached = this.cached.get(path)
		if (_cached) {
			const { content, timestamp } = _cached
			const expired = performance.now() - timestamp > CACHE_EXPIRATION
			if (!expired) return { content, status: STATUS.CACHED }
			this.cached.delete(path)
		}		
	}
	
	try {
		const fileData = await readFile(_path, UTF8)
		this.cached.set(path, { content: fileData, timestamp: performance.now() })
		return { content: fileData, status: STATUS.LOAD }		
	} catch (e) {
		const { code } = e
		return { content: null, status: code }
	}
}
/**
* @description получить медиафайл
* @warning использует метод подгрузки из https://stackoverflow.com/questions/5823722/how-to-serve-an-image-using-nodejs
*/
LoadManager.prototype.getMedia = async function(path, response, type, relative = true) {
	const _path = relative ? `.${path}` : path
	var mediaStream = createReadStream(_path)

	const result = new Promise((resolve, reject) => {
		mediaStream.on('open', function () {
			console.log('opened')
			response.setHeader('Content-Type', type)
			mediaStream.pipe(response);
			resolve({ content: null, status: STATUS.LOAD })
		});
		mediaStream.on('error', function (err) {
			try {
				reject({ content: null, status: STATUS.FAIL })
			} catch(e) {
				console.error(e)
			}
		})
	})

	return await result
}	

module.exports = LoadManager