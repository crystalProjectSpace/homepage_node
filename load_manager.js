'use strict'

const { readFile } = require('fs').promises
const { UTF8, STATUS, CACHE_EXPIRATION } = require('./constants.js')
const { performance } = require('node:perf_hooks')

const LoadManager = function() {
	this.cached = new Map()
}
/**
* @description загрузить и кэшировать файл
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

module.exports = LoadManager