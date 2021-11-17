import { escapeHtml } from "../lib/escape";
import { merge } from "../lib/merge";
import { html as beautifyHtml } from "js-beautify"

export default class ComponentViewer {
  defaultOptions = {}

  constructor(query, instanceOptions = {}) {
    this.query = query;
    this.el = (this.query instanceof HTMLElement) ? this.query : document.querySelector(this.query);
    this.options = merge(this.defaultOptions, instanceOptions);
    this.init()
  }

  init() {
    this.element = this.el.innerHTML
    this.elementPretty = beautifyHtml(this.element)
    this.el.innerHTML = ''

    // 
    const wrapperResult = document.createElement('div')
    wrapperResult.classList.add('component-viewer-result')
    wrapperResult.innerHTML = this.element

    // 
    const wrapperCode = document.createElement('div')
    const pre = document.createElement('pre')
    const code = document.createElement('code')
    const buttonCopy = document.createElement('button')
    wrapperCode.classList.add('component-viewer-code')
    buttonCopy.classList.add('component-viewer-button-copy')
    buttonCopy.innerHTML = 'Copy Code to Clipboard'

    // code
    code.classList.add('language-html')
    code.innerHTML = escapeHtml(this.elementPretty)

    // copy
    buttonCopy.addEventListener('click', () => {
      const textarea = document.createElement('textarea')
      textarea.value = this.elementPretty
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      alert('Copied to clipboard')
    })

    // 
    pre.appendChild(code)
    wrapperCode.appendChild(pre)
    wrapperCode.appendChild(buttonCopy)

    // 
    this.el.appendChild(wrapperResult)
    this.el.appendChild(wrapperCode)

    // 
    if (window && window.Prism) {
      window.Prism.highlightElement(code)
    }
  }
}