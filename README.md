Data Controller Module
======================

Data Controller is browser module that aims to let implementations to know about data updates inside a data attribute of a host object in a simple way.

It uses a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to capture any modification in the target data and comunicates changes dispatching an event callde `dataUpdated`.


Installing
----------

    npm i modnes-data-controller


Usage
-----

The Data Controller must receive an object that implements the [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) interface for to it be able to dispatch events. This means it can be used within custom elements for example. ;-)


```javascript
import DataController from "path/to/modnes-data-controller/data-controller.js"

class Host extends EventTarget {}

let host = new Host()
let dataController = new DataController(host)

host.addEventListener('dataUpdated', event => {
  console.log(event.detail)
})

host.data = {
  id: 100,
  text: 'String'
}

host.data.text = 'Modified String'
```


Methods
-------

Data Controller provides more two main methods: bindDOM() and bindForm(). These methods allow building applications using the Two Way Data Binding idea.


### bindDOM

The [`bindDOM()`](https://github.com/modnes/data-cotroller/wiki/API#binddom) method uses an array containing mapping set that bind properties modifications to elements in DOM. Each map must to set the `property` attribute from data in the host object.

The following are some examples of configuring mappings:

```javascript
const MAPPING_SET = [
  {
    property: 'id',
    elements: document.querySelector('#test'),
    attributes: 'id'
  },
  {
    property: 'date',
    elements: document.querySelector('.dates'),
  },
  {
    property: 'person.name',
    elements: 'div#person',
    attributes: ['title'],
    template: '<h1>{{ value }}</h1>'
  },
  {
    property: 'person.age',
    elements: 'div#person span.age',
    attributes: ['data-age']
  },
  {
    property: 'person.active',
    elements: 'div#person .active',
    attributes: ['data-active']
  },
  {
    property: 'person.bio',
    elements: 'div#person .bio'
  }
]

dataController.bindDOM(MAPPING_SET)
```

### bindForm

The [`bindForm()`](https://github.com/modnes/data-cotroller/wiki/API#bindform) receives a form and binds each form element to a property from data by it name attribute.

```html
<form class="person-form">
  <input type="text" name="person.name" />
  <input type="range" name="person.age" />
  <input type="text" name="person.bio" />
  <input type="checkbox" name="person.active" />

  // Values as Array
  <input type="checkbox" name="person.roles" value="admin" />
  <input type="checkbox" name="person.roles" value="manager" checked />
  <input type="checkbox" name="person.roles" value="user" checked />

  // person.favoritePosts is an array of objects with id property set to this values
  // Use the data-as-number attribute to use the value as Number type
  <select name="person.favoritePosts.id[]" data-as-number multiple>
    <option value="1">Post 1</option>
    <option value="2" selected>Post 2</option>
    <option value="3" selected>Post 3</option>
  </select>
</form>
```

```javascript
let form = document.querySelector('.person-form')

dataController.bindForm(form)
```

See the [API documentation](https://github.com/modnes/data-cotroller/wiki/API)
