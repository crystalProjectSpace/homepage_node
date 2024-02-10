'use strict'

const { readFile } = require('fs').promises
const { UTF8, STATUS, CACHE_EXPIRATION } = require('./constants.js')
const { performance } = require('node:perf_hooks')
const ARTICLE_LIST = require('../data/article_list.json')
const PAGE_SIZE = 10
const GetManager = function() {
	this.cachedArticles = new Map()
}
/**
* @description загрузить и кэшировать файл
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

/**
* @description выдать из предзагруженного списка статей фильтрацию по страницам и тегам
*/
GetManager.prototype.getPageList = function(url) {
	const paramsStr = url.split('?')[1]

	if(paramsStr) {
		const params = paramsStr.split('&').reduce((result, prm) => {
			const [key, value] = prm.split('=')
			result[key] = value
		});
		const { page, tags } = params
		let prefilteredPage = ARTICLE_LIST
		if(tags) prefilteredPage = prefilteredPage.filter(articlePreview => tags.some(t => articlePreview.tags.include(t)))
		const pageStart = page * PAGE_SIZE
		const pageEnd = pageStart + PAGE_SIZE
		return { content: prefilteredPage.slice(pageStart, pageEnd), status: STATUS.LOAD }
	}
	return { content: ARTICLE_LIST.slice(0, 10), status: STATUS.LOAD }
}

module.exports = GetManager