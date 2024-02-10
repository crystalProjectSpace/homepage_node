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

export const getArticleList = async function(params) {
  let getParams = Object.entries(params ?? {}).map(prm => {
    const [key, value] = prm
    const _value = Array.isArray(value) ? value.join(';') : value
    return`${key}=${_value}`
  }).join('&')
  if(getParams) getParams = `?${getParams}`
  const path = `/api/all-articles${getParams}`
  const articleListFetch = await fetch(path, { headers: ARTICLE_FETCH_OPTIONS });
  const articleJSON = await articleListFetch.text()
  return articleJSON
}