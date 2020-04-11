/* global describe, it, EventTarget, Event */
import { expect } from 'chai'
import DataController from '../data-controller.js'

class DataHost extends EventTarget {}

describe('Data Controller', function () {
  it('Expect to get a new Data Controller', function () {
    const dataHost = new DataHost()
    const dataController = new DataController(dataHost)

    expect(dataController).to.be.instanceof(DataController)
  })

  it('Expect to set data using Data Controller', function () {
    const dataHost = new DataHost()
    dataHost.dataController = new DataController(dataHost)
    dataHost.data = {
      title: 'Data Title',
      subData: {
        name: 'Sub Data Name',
        number: 1
      }
    }

    expect(dataHost.data).to.deep.equal({
      title: 'Data Title',
      subData: {
        name: 'Sub Data Name',
        number: 1
      }
    })
  })

  it('Expect to get a DIV element attribute updated when data is updated', function () {
    const divElement = document.createElement('div')
    const dataHost = new DataHost()
    dataHost.dataController = new DataController(dataHost)
    dataHost.data = {}

    document.body.insertAdjacentElement('afterBegin', divElement)
    dataHost.dataController.bindDOM([{
      property: 'id',
      element: divElement,
      attributes: ['id']
    }])
    dataHost.data.id = 'id-02'

    expect(divElement.getAttribute('id')).to.be.equal('id-02')
  })

  it('Expect to get the DIV and SPAN elements content updated when data is updated', function () {
    const divElement = document.querySelector('div')
    const spanElement = document.createElement('span')
    const elements = [divElement, spanElement]
    const dataHost = new DataHost()
    dataHost.dataController = new DataController(dataHost)
    dataHost.data = {}

    document.body.insertAdjacentElement('afterBegin', spanElement)
    dataHost.dataController.bindDOM([{
      property: 'text',
      elements: elements
    }])
    dataHost.data.text = 'Some text'

    expect(divElement.textContent).to.be.equal('Some text')
    expect(spanElement.textContent).to.be.equal('Some text')
  })

  it('Expect to get the some elements content and attributes updated when data is updated', function () {
    const dataHost = new DataHost()
    dataHost.dataController = new DataController(dataHost)
    dataHost.data = {}

    dataHost.dataController.bindDOM([
      {
        property: 'person.name',
        query: 'div',
        attributes: ['title'],
        template: '<h1>{{ value }}</h1>'
      },
      {
        property: 'person.bio',
        query: 'span'
      }
    ])

    dataHost.data.person = {}

    dataHost.data.person.name = 'Person Name'
    dataHost.data.person.bio = 'Person bio'

    expect(document.querySelector('div').getAttribute('title')).to.be.equal('Person Name')
    expect(document.querySelector('span').textContent).to.be.equal('Person bio')
  })

  it('Expect to get the some elements content and attributes updated when form is updated', function () {
    const form = document.createElement('form')
    const dataHost = new DataHost()
    dataHost.dataController = new DataController(dataHost)
    dataHost.data = { person: {} }

    document.body.insertAdjacentElement('afterBegin', form)
    form.insertAdjacentHTML('afterBegin', `
      <input type="text" name="person.name" />
      <input type="range" name="person.age" />
      <input type="text" name="person.bio" />
      <input type="checkbox" name="person.active" />
      <input type="checkbox" name="person.deep.attribute" checked />
      <input type="checkbox" name="person.status" value="hasChild" />
      <input type="checkbox" name="person.roles" value="admin" />
      <input type="checkbox" name="person.roles" value="manager" checked />
      <input type="checkbox" name="person.roles" value="user" checked />
      <select name="person.options" multiple>
        <option>1</option>
        <option selected>2</option>
        <option value="3" selected>Other</option>
      </select>
      <input type="checkbox" name="person.favoriteColors.name[]" value="red" />
      <input type="checkbox" name="person.favoriteColors.name[]" value="green" checked />
      <input type="checkbox" name="person.favoriteColors.name[]" value="blue" checked />
      <select name="person.favoritePosts.id[]" data-as-number multiple>
        <option value="1">Post 1</option>
        <option value="2" selected>Post 2</option>
        <option value="3" selected>Post 3</option>
      </select>
      <input type="file" />
    `)
    dataHost.dataController.bindForm(form)
    dataHost.dataController.bindDOM([
      {
        property: 'person.name',
        query: 'div',
        attributes: ['title'],
        template: '<h1>{{ value }}</h1>'
      },
      {
        property: 'person.age',
        query: 'div',
        attributes: ['data-age']
      },
      {
        property: 'person.active',
        query: 'div',
        attributes: ['data-active']
      },
      {
        property: 'person.bio',
        query: 'span'
      }
    ])
    document.querySelector('[name="person.name"]').value = 'New Person Name'
    document.querySelector('[name="person.age"]').value = 25
    document.querySelector('[name="person.bio"]').value = 'New person bio'
    document.querySelector('[name="person.active"]').checked = true
    document.querySelector('[name="person.status"]').checked = true
    document.querySelector('[name="person.name"]').dispatchEvent(new Event('input'))
    document.querySelector('[name="person.age"]').dispatchEvent(new Event('input'))
    document.querySelector('[name="person.bio"]').dispatchEvent(new Event('change'))
    document.querySelector('[name="person.deep.attribute"]').dispatchEvent(new Event('change'))
    document.querySelector('[name="person.active"]').dispatchEvent(new Event('change'))
    document.querySelector('[name="person.status"]').dispatchEvent(new Event('change'))
    document.querySelector('[name="person.options"]').dispatchEvent(new Event('change'))
    document.querySelector('[name="person.roles"]').dispatchEvent(new Event('change'))
    document.querySelector('[name="person.favoriteColors.name[]"]').dispatchEvent(new Event('change'))
    document.querySelector('[name="person.favoritePosts.id[]"]').dispatchEvent(new Event('change'))

    expect(document.querySelector('div').getAttribute('title')).to.be.equal('New Person Name')
    expect(document.querySelector('div').getAttribute('data-age')).to.be.equal('25')
    expect(document.querySelector('div').getAttribute('data-active')).to.be.equal('true')
    expect(dataHost.data.person.deep.attribute).to.be.equal(true)
    expect(dataHost.data.person.status).to.be.equal('hasChild')
    expect(dataHost.data.person.options).to.deep.equal(['2', '3'])
    expect(dataHost.data.person.roles).to.deep.equal(['manager', 'user'])
    expect(dataHost.data.person.favoriteColors).to.deep.equal([{ name: 'green' }, { name: 'blue' }])
    expect(dataHost.data.person.favoritePosts).to.deep.equal([{ id: 2 }, { id: 3 }])
    expect(document.querySelector('span').textContent).to.be.equal('New person bio')
  })
})
