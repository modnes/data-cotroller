/* global HTMLElement, fetch */
export default class PackageDownload extends HTMLElement {
  async connectedCallback () {
    const RESPONSE = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'bearer 2d3f821517c05ea92bd72da66356be4933cad497'
      },
      body: JSON.stringify({
        query: `
          {
            repository(owner:"${this.getAttribute('owner')}", name:"${this.getAttribute('repository')}") {
              releases(last: 1) {
                edges {
                  node {
                    tag {
                      name
                    }
                  }
                }
              }
            }
          }
        `
      })
    })
    const DATA = await RESPONSE.json()
    const VERSION_TAG = DATA.data.repository.releases.edges.shift().node.tag.name

    this.insertAdjacentHTML('afterBegin', `
      <a href="https://github.com/${this.getAttribute('owner') || ''}/${this.getAttribute('repository')}/archive/${VERSION_TAG}.zip">
        ${this.getAttribute('repository')}-${VERSION_TAG}.zip
      </a> |
      <a href="https://github.com/${this.getAttribute('owner') || ''}/${this.getAttribute('repository')}/archive/${VERSION_TAG}.tar.gz">
        ${this.getAttribute('repository')}-${VERSION_TAG}.tar.gz
      </a>
    `)
  }
}
