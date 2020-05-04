/* global HTMLElement, fetch */
export default class PackageDownload extends HTMLElement {
  async connectedCallback () {
    const RESPONSE = await fetch(`https://api.github.com/repos/${this.getAttribute('owner') || ''}/${this.getAttribute('repository')}/releases/latest`)
    const DATA = await RESPONSE.json()

    this.insertAdjacentHTML('afterBegin', `
      <a href="https://github.com/${this.getAttribute('owner') || ''}/${this.getAttribute('repository')}/archive/${DATA.tag_name}.zip">
        ${this.getAttribute('repository')}-${DATA.tag_name}.zip
      </a> |
      <a href="https://github.com/${this.getAttribute('owner') || ''}/${this.getAttribute('repository')}/archive/${DATA.tag_name}.tar.gz">
        ${this.getAttribute('repository')}-${DATA.tag_name}.tar.gz
      </a>
    `)
  }
}
