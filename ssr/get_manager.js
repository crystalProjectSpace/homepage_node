'use strict'

const { readFile } = require('fs').promises
const { UTF8, STATUS, CACHE_EXPIRATION } = require('./constants.js')
const { performance } = require('node:perf_hooks')

const GetManager = function() {
	this.cachedArticles = new Map()
}
/**
* @description загрузить и кэшировать файл
* @warning связка readFile/ return неадекватно работает с бинарниками
*/
GetManager.prototype.getPage = async function(ID, forced = false) {
	const _path = `./data/articles/article_${ID}.json`
	const articleKey = `article-${ID}`
	if (!forced) {
		const _cached = this.cachedArticles.get(articleKey)
		if (_cached) {
			const { content, timestamp } = _cached
			const expired = performance.now() - timestamp > CACHE_EXPIRATION
			if (!expired) return { content, status: STATUS.CACHED }
			this.cachedArticles.delete(articleKey)
		}		
	}
	
	try {
		const fileData = await readFile(_path, UTF8)
		this.cachedArticles.set(articleKey, { content: fileData, timestamp: performance.now() })
		return { content: fileData, status: STATUS.LOAD }		
	} catch (e) {
		const { code } = e
		return { content: null, status: code }
	}
}

module.exports = GetManager