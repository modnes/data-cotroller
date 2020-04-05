/* global describe, it, EventTarget */
import chai from 'chai'
import DataController from '../data-controller.js'

const expect = chai.expect

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
})
