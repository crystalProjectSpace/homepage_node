'use strict'

const { readdir, readFile, writeFile } = require('fs').promises

const CONTENT_PATH = './data/articles'
const ARTICLE_MASK = /\.json$/
const UTF8 = 'utf8'
const MASTER_LIST_NAME = './data/article_list.json'
/**
* @description прочитать содержимое директории и собрать из него список файлов-статей
*/
const getArticleList = async function(path) {
	try {
		const contentList = await readdir(path)
		const articles = contentList.filter(fileName => fileName.match(ARTICLE_MASK))
		return contentList
	} catch(err) {
		console.error('error has occured ', err)
		return null
	}
}
/**
* @description получить JSON содержимого статьи
*/
const getArticleJSON = async function(name) {
	const path = `${CONTENT_PATH}/${name}`
	try {
		const file = await readFile(path)
		const fileData = JSON.parse(file)
		return fileData
	} catch (err) {
		console.error(`error occured while reading from ${path}`)
		return null
	}
}
/**
* @description собрать список превью для выдачи
*/
const createContentList = async function() {
	const result = []
	const articles = await getArticleList(CONTENT_PATH)
	const articlesCount = articles?.length ?? 0
	if(!articlesCount) return
	
	
	for(let i = 0; i < articlesCount; i++) {
		const articleName = articles[i]
		const articleJSON = await getArticleJSON(articleName)
		if (articleJSON) {
			const { header, content, meta } = articleJSON
			const previewText = content.split('\n').filter(Boolean)[0] ?? ''
			const href = `/article/${meta.ID}`
			const tags = meta.tags.slice(0, 3)
			const previewSrc = `/data/imgs/${meta.preview_img}`
			result.push({
				header,
				content: previewText,
				href,
				previewSrc,
				tags,
				author: meta.about?.author ?? '',
				created: meta.about?.datetime ?? (new Date()).getTime()
			})
		}
	}
	
	const previewList = JSON.stringify(result)
	try {
		await writeFile(MASTER_LIST_NAME, previewList, UTF8)
		console.log('article list created')
	} catch (err) {
		console.error(`An error has occured while writing contents of article list: \n${err}`)
	}	
}

{
	createContentList()
}
