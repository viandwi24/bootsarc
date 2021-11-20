import { merge } from '../lib/merge'

export default class Navbar {
  defaultOptions = {}

  constructor(query = 'nav.navbar', isntanceOptions = {}) {
    this.query = query
    this.options = merge(this.defaultOptions, isntanceOptions)
  }

  init() {
    this.el = typeof this.query === HTMLElement ? this.query : document.querySelector(this.query)
    if (this.el.classList.contains('main-navbar')) {
      this.addEventListenerMainNavbar()
    }
  }
  
  addEventListenerMainNavbar() {
    const body = document.body.querySelector('.os-padding > .os-viewport') ? document.body.querySelector('.os-padding > .os-viewport') : document.body
    body.addEventListener('scroll', () => {
      if (body.scrollTop > 0) {
        this.el.classList.add('on-scroll')
      } else {
        this.el.classList.remove('on-scroll')
      }      
    })
  }
}
