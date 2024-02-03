'use strict'

const ARTICLE_FETCH_OPTIONS = {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    mode: 'same-origin',
}

export const getArticleContent = async function(articleId) {
    const path = `/api/article/${articleId}`
    const articleFetch = await fetch(path, { headers: ARTICLE_FETCH_OPTIONS });
    const articleJSON = await articleFetch.text()
    return articleJSON
}