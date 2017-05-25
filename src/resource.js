import { Base } from './base'
import { Resources } from './resources'

export class Resource extends Base {
  static extend (protoProps = {}) {
    class ExtendedResource extends Resource {}

    Object.keys(protoProps).forEach((propName) => {
      const propValue = protoProps[propName]

      // If it is `Resources`, treat it like a subresources.
      if (typeof propValue === 'function' && Object.getPrototypeOf(propValue.prototype) === Resources.prototype) {
        return Object.defineProperty(ExtendedResource.prototype, propName, {
          get: function () {
            /* eslint new-cap: "off" */
            return new propValue(this.baseURL, this.options)
          }
        })
      }

      ExtendedResource.prototype[propName] = propValue
    })

    return ExtendedResource
  }

  /**
   * @param {String} baseURL
   * @param {Object} options
   * @param {Object} [data={}]
   */
  constructor (baseURL, options, data = {}) {
    super(baseURL, options)

    this.data = data
  }

  before () {
    return Promise.resolve(arguments)
  }

  beforeRetrieve () {
    return Promise.resolve(arguments)
  }

  retrieve () {
    return this.before(...arguments)
      .then(args => this.beforeRetrieve(...args))
      .then(args => this.get(...args))
      .then(response => this.afterRetrieve(response))
  }

  afterRetrieve (response) {
    const { data } = response

    return new this.constructor(this.baseURL, this.options, data)
  }

  update () {
    return this.put(...arguments).then(response => this.afterUpdate(response))
  }

  afterUpdate (response) {
    const { data } = response

    return new this.constructor(this.baseURL, this.options, data)
  }

  destroy () {
    return this.delete(...arguments).then(response => this.afterDestroy(response))
  }

  afterDestroy (response) {
    const { data } = response

    return new this.constructor(this.baseURL, this.options, data)
  }

  toJSON () {
    return this.data
  }
}
