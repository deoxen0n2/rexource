import urljoin from 'url-join'
import { inherits } from 'util'

import { Base } from './base'
import { Resource } from './resource'

export function Resources (baseURL, options = {}, data = {}) {
  const resources = function (id) {
    return new resources.Resource(resources.getResourceURL(id), options, data)
  }

  Base.apply(resources, arguments)
  Object.setPrototypeOf(resources, Resources.prototype)

  resources.data = data

  return resources
}

inherits(Resources, Base)

Resources.extend = function (resourcePath, protoProps) {
  function ExtendedResources (baseURL, options = {}, data = {}) {
    const resourcesURL = urljoin(baseURL, resourcePath)
    const resources = Resources(resourcesURL, options, data)

    Object.setPrototypeOf(resources, ExtendedResources.prototype)

    return resources
  }

  inherits(ExtendedResources, Resources)

  Object.assign(ExtendedResources.prototype, protoProps)

  ExtendedResources.prototype.resourcePath = resourcePath

  return ExtendedResources
}

Resources.prototype.create = function () {
  return this.post(...arguments).then(response => this.afterCreate(response))
}

Resources.prototype.afterCreate = function defaultAfterCreate (response) {
  const { data } = response
  const { id } = data

  return new this.Resource(this.getResourceURL(id), this.options, data)
}

Resources.prototype.list = function () {
  if (typeof this.beforeList === 'function') {
    return this.beforeList(...arguments)
      .then((result) => {
        const { baseURL, query } = result

        return this.get(query, baseURL)
      })
      .then(response => this.afterList(response))
  }

  return this.get(...arguments).then(response => this.afterList(response))
}

Resources.prototype.afterList = function defaultAfterList (response) {
  const { data } = response

  return new this.constructor(this.baseURL, this.options, data)
}

Resources.prototype.Resource = Resource

Resources.prototype.toJSON = function () {
  return this.data
}
