'use strict'

import { RENDER_CONSTANTS } from './constants.mjs'

const { R_BOLD, R_ITALIC, R_STRIKE, R_IMG, R_URL } = RENDER_CONSTANTS.REGEXP
const { GALLERY_CLOSE } = RENDER_CONSTANTS.HTMLS
const BOLD = 'bold'
const EMPHASIS = 'emphasis'
const STRIKE = 'strike'

const THEME_TAGS = {
    digital_life: 'Цифровая жизнь',
    sci_fi: 'Научная фантастика',
    space: 'Космос'
}

const tagToRegexp = new Map([
    [BOLD, {regex: R_BOLD, tag: 'strong'}],
    [EMPHASIS, {regex: R_ITALIC, tag: 'em'}],
    [STRIKE, {regex: R_STRIKE, tag: 'strike' }]
])

const tagProcess = function(paragraph, tagType) {
    let result = paragraph
    const { regex, tag } = tagToRegexp.get(tagType)

    const tagMatches = paragraph.match(regex)
    const tagCount = tagMatches?.length ?? 0

    if(tagCount) {
        for(let i = 0; i < tagCount; i++) {
            const _replace = `<${tag}>${tagMatches[i].slice(2,-2)}</${tag}>`
            result = result.replace(tagMatches[i], _replace)
        }
    }
    
    return result
}

const imageProcess = function(paragraph) {
	let result = paragraph
    const images = result.match(R_IMG)
	const imgCount = images?.length ?? 0
    if(imgCount) {
        for(let i = 0; i < imgCount; i++) {
            const imgIds = images[i].slice(6, -1).split(/\s*\,\s*/)
            let _image = ''
            if (imgIds.length > 1) {
                _image += '<span class="gallery">'
                imgIds.forEach(ID => {
                    _image +=  `<img class="_gallery-img" src="/data/imgs/${ID}" />`
                })
                _image += GALLERY_CLOSE
            } else {
                _image = `<img class="_img" src="/data/imgs/${imgIds[0]}" />`
            }
            result = result.replace(images[i], _image)
        }
    }
    return result
}

const urlProcess = function(paragraph) {
	let result = paragraph
    const urls = result.match(R_URL)
	const urlCount = urls?.length ?? 0
    if(urlCount) {
        for(let i = 0; i < urlCount; i++) {
            let [ href, title ] = url[i].split(/\]\s*\{/)
            href = href.slice(5)
            title = title.slice(0, -1)
            _url = `<a href="${href}" target="_blank">${title}</a>`
            result = result.replace(urls[i], _url)

        }
    }
    return result
}

const processParagraph = function(paragraph) {
    let result = paragraph
    result = tagProcess(result, BOLD)
    result = tagProcess(result, EMPHASIS)
    result = tagProcess(result, STRIKE)
    result = imageProcess(result)
    result = urlProcess(result)
		
	return `<p>${result}</p>`
}

const processText = function(text) {
	const paragraphs = text.split(/\n+/)
	const size = paragraphs.length
	let res = '<div>'
	for(let i = 0; i < size; i++) {
		res += processParagraph(paragraphs[i])
	}
	
	return res
}

const processTags = function(tags) {
	const tagSize = tags.length
	let res = ''
	for (let i = 0; i < tagSize; i++) {
		const tag = THEME_TAGS[tags[i]] ?? tags[i]
		res += `<a href="/tags/${tags[i]}" class="main-content__list-item-meta__tag" target="_blank">${tag}</a>`
	}
	
	return `<div class="main-content__list-item-meta__tags">${res}</div>`
}

// const processAbout = function(about) {
// 	const { author, datetime } = about
// 	return `<span class="meta-info _datetime">${datetime}</span><span class="meta-info">${author}</span>`
// }

export const createPreview = function(preview) {
	const { header, content, meta } = preview
	const _content = processText(content)
	const _tags = processTags(meta.tags)
	//const _about = processAbout(meta.about)
	
	return `<section class="main-content__list-item"><h3 class="main-content__list_item-header">${header}</h3><div class="main-content__list-item-text">${_content}</div><div class="main-content__list-item-meta">${_tags}</div></section>`
}
