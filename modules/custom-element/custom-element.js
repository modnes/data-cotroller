/* global HTMLElement */
import DataController from '../modnes/data-controller/data-controller.js'

export default class CustomElement extends HTMLElement {
  constructor () {
    super()
    this.dataController = new DataController(this)
    this.data = {
      text: 'Sample Text',
      seconds: {
        elapsed: 0,
        status: 'counting',
        button: {
          label: 'Stop'
        }
      }
    }
  }

  connectedCallback () {
    this.insertAdjacentHTML('afterBegin', `
      <p class="custom-element-text">${this.data.text}</p>
      <p class="custom-element-seconds-elapsed">
        Elapsed Seconds: ${this.data.seconds.elapsed}
      </p>
      <p class="custom-element-seconds-status">
        Status: ${this.data.seconds.status}
      </p>
      <form class="custom-element-form">
        <label class="custom-element-form_label">
          Text
          <input class="custom-element_text-input" type="text" name="text"
            value="${this.data.text}" />
        </label>
        <div>
          <label class="custom-element-form_label">
            <input class="custom-element_elapsed-input" type="number"
              name="seconds.elapsed"
              value="${this.data.seconds.elapsed}" />
          </label>
          <button class="count-stop-button" type="button">
            ${this.data.seconds.button.label}
          </button>
          <button class="restart-button" type="button">
            Restart
          </button>
        </div>
      </form>
    `)

    const customElementText = this.querySelector('.custom-element-text')
    const customElementSecondsElapsed = this.querySelector('.custom-element-seconds-elapsed')
    const secondsElapsedInput = this.querySelector('input[name="seconds.elapsed"]')
    const customElementSecondsStatus = this.querySelector('.custom-element-seconds-status')
    const countStopButton = this.querySelector('.count-stop-button')
    const restartButton = this.querySelector('.restart-button')

    this.dataController.bindDOM([
      {
        property: 'text',
        elements: customElementText
      },
      {
        property: 'seconds.elapsed',
        elements: customElementSecondsElapsed,
        template: 'Elapsed Seconds: {{ value }}'
      },
      {
        property: 'seconds.elapsed',
        elements: secondsElapsedInput,
        attributes: 'value'
      },
      {
        property: 'seconds.status',
        elements: customElementSecondsStatus,
        template: 'Status: {{ value }}'
      },
      {
        property: 'seconds.button.label',
        elements: countStopButton
      }
    ])

    this.dataController.bindForm(this.querySelector('.custom-element-form'))

    countStopButton.addEventListener('click', () => {
      if (this.data.seconds.status === 'counting') {
        this.stopCountElapsedSeconds()
      } else {
        this.startCountElapsedSeconds()
      }
    })

    restartButton.addEventListener('click', () => {
      this.data.seconds.elapsed = 0
    })

    this.startCountElapsedSeconds()
  }

  startCountElapsedSeconds () {
    this.countElapsedSeconds = setInterval(() => { this.data.seconds.elapsed++ }, 1000)
    this.data.seconds.status = 'counting'
    this.data.seconds.button.label = 'Stop'
  }

  stopCountElapsedSeconds () {
    clearInterval(this.countElapsedSeconds)
    this.data.seconds.status = 'stopped'
    this.data.seconds.button.label = 'Count'
  }
}
