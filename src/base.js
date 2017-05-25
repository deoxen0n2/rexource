import axios from 'axios'
import urljoin from 'url-join'

import { Resource } from './resource'

export function Base (baseURL, options) {
  if (typeof baseURL !== 'string') {
    throw new TypeError('"baseURL" is required as the first parameter and must be a string')
  }

  this.options = options

  this.baseURL = baseURL
  this.axios = axios.create({
    baseURL,
    ...options
  })
}

Base.prototype.get = function (query = {}, baseURL) {
  const params = query
  baseURL = baseURL || this.baseURL

  return this.axios.get(baseURL, { params })
}

Base.prototype.put = function (body = {}) {
  return this.axios.put(this.baseURL, body)
}

Base.prototype.post = function (body = {}, baseURL) {
  baseURL = baseURL || this.baseURL

  return this.axios.post(baseURL, body)
}

Base.prototype.delete = function (query = {}) {
  const params = query

  return this.axios.delete(this.baseURL, { params })
}

Base.prototype.getResourceURL = function (resourcePath) {
  return urljoin(this.baseURL, encodeURIComponent(resourcePath))
}

Base.prototype.Resource = Resource
