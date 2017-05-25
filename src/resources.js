import urljoin from 'url-join'
import { inherits } from 'util'

import { Base } from './base'
import { Resource } from './resource'

export function Resources (baseURL, options = {}, data = {}, settings = {}) {
  const resources = function (id) {
    return new resources.Resource(resources.getResourceURL(id), options, data)
  }

  Base.apply(resources, arguments)
  Object.setPrototypeOf(resources, Resources.prototype)

  resources.data = data
  resources.settings = settings

  return resources
}

inherits(Resources, Base)

Resources.extend = function (resourcePath, protoProps, BaseResources = null) {
  const Rs = BaseResources || Resources

  function ExtendedResources (baseURL, options = {}, data = {}, settings = {}) {
    const resourcesURL = urljoin(baseURL, resourcePath)
    const resources = Rs(resourcesURL, options, data, settings)

    Object.setPrototypeOf(resources, ExtendedResources.prototype)

    return resources
  }

  inherits(ExtendedResources, Rs)

  Object.assign(ExtendedResources.prototype, protoProps)

  ExtendedResources.extend = (resourcePath, protoProps) => Rs.extend(resourcePath, protoProps, ExtendedResources)
  ExtendedResources.__super__ = Rs.prototype
  ExtendedResources.prototype.resourcePath = resourcePath

  return ExtendedResources
}

Resources.prototype.beforeCreate = function () {
  return Promise.resolve(...arguments)
}

Resources.prototype.create = function () {
  return this.beforeCreate(...arguments)
    .then(args => this.post(...args).then(response => this.afterCreate(response)))
}

Resources.prototype.afterCreate = function defaultAfterCreate (response) {
  const R = this.Resource || Resource
  const { data } = response
  const { id } = data

  return new R(this.getResourceURL(id), this.options, data)
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

Resources.prototype.toJSON = function () {
  return this.data
}
