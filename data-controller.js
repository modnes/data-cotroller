/* global CustomEvent */

export class DataHandler {
  constructor (eventTarget, prefix) {
    this.eventTarget = eventTarget
    this.prefix = prefix
  }

  set (target, property, value) {
    target[property] = value
    this.eventTarget.dispatchEvent(new CustomEvent('dataUpdated', {
      detail: {
        property: this.prefix + property,
        value: value
      }
    }))

    return true
  }

  get (target, property) {
    // return a new proxy if possible, add to prefix
    const out = target[property]

    if (out && Object.getPrototypeOf(out) === Object.prototype) {
      return new Proxy(out, new DataHandler(this.eventTarget, this.prefix + property + '.'))
    }

    return out
  }
}

export default class DataController {
  constructor (host) {
    this.host = host

    this.setData({})
  }

  setData (data) {
    this.host.controledData = new Proxy(data, new DataHandler(this.host, ''))
  }

  bindDOM (mapping) {
    this.host.addEventListener('dataUpdated', event => {
      this.updateDOM(mapping, event.detail)
    })
  }

  updateDOM (mapping, data) {
    const filteredMapping = mapping.filter(element => element.property === data.property)

    for (const map of filteredMapping) {
      if (map.element) {
        this.updateElement(map.element, map, data.value)
      }

      if (map.elements) {
        for (const element of map.elements) {
          this.updateElement(element, map, data.value)
        }
      }

      if (map.query) {
        this.host.querySelectorAll(map.query).forEach(element => {
          this.updateElement(element, map, data.value)
        })
      }
    }
  }

  updateElement (element, map, value) {
    if (map.attributes) {
      for (const attribute of map.attributes) {
        element.setAttribute(attribute, value)
      }
    }

    if (map.template) {
      while (element.firstChild) {
        element.removeChild(element.firstChild)
      }

      element.insertAdjacentHTML('beforeEnd', map.template.replace(/{{\s*value\s*}}/g, value))
    }
  }

  bindForm (form) {
    const fields = form.elements

    for (const field of fields) {
      switch (field.type) {
        case 'file':
          break
        default:
          this.updateFromField(field, form)
          field.addEventListener('input', () => {
            this.updateFromField(field, form)
          })
          field.addEventListener('change', () => {
            this.updateFromField(field, form)
          })
          break
      }
    }
  }

  updateFromField (field, form) {
    const propertiesNodes = field.name.split('.')
    const propertiesNodesDepth = propertiesNodes.length
    let value
    let options

    switch (field.type) {
      case 'number':
      case 'range':
        value = field.valueAsNumber
        break
      case 'checkbox':
        value = (field.getAttribute('value')) ? field.getAttribute('value') : field.checked
        options = form.querySelectorAll(`[name="${field.name}"]`)

        if (!field.checked && field.getAttribute('value')) {
          value = null
        }
        break
      case 'select-multiple':
        value = (field.dataset.asNumber !== undefined) ? Number(field.value) : field.value
        options = field.selectedOptions
        break
      default:
        value = (field.dataset.asNumber !== undefined) ? Number(field.value) : field.value
        break
    }

    const updateProperty = (data, property, level) => {
      if (propertiesNodesDepth === level) {
        if (options && options.length > 1) {
          if (property.endsWith('[]')) {
            data = []

            for (const option of options) {
              const toPush = {}

              if (field.type === 'checkbox') {
                if (option.checked) {
                  toPush[property] = option.value
                }
              } else {
                toPush[property] = option.value
              }

              data.push(toPush)
            }
          } else {
            data[property] = []

            for (const option of options) {
              if (field.type === 'checkbox') {
                if (option.checked) {
                  data[property].push(option.value)
                }
              } else {
                data[property].push(option.value)
              }
            }
          }
        } else {
          if (value === undefined || value === null) {
            delete data[property]
          } else {
            data[property] = value
          }
        }
      } else {
        if (data[property] === undefined || data[property] === null) {
          data[property] = {}
        }

        updateProperty(data[property], propertiesNodes[level], level + 1)
      }
    }

    updateProperty(this.host.data, propertiesNodes[0], 1)
  }
}
