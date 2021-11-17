import { merge } from '../lib/merge'

export default class Sidebar {
  defaultOptions = {
    OverlayScrollbars: {
    }
  }

  constructor(query = 'nav.sidebar', isntanceOptions = {}) {
    this.query = query
    this.options = merge(this.defaultOptions, isntanceOptions)
  }

  init() {
    this.el = typeof this.query === HTMLElement ? this.query : document.querySelector(this.query)
    this.addSidebarItemEventListener()
    this.openSubMenuIfActive()
    this.constructSidebarCollapse()
    this.addMenuScrollbar()
  }

  addMenuScrollbar() {
    if (window && window.OverlayScrollbars) {
      const { OverlayScrollbars } = window
      this.OverlayScrollbars = OverlayScrollbars(document.querySelectorAll('.sidebar-content'), this.options.OverlayScrollbars);
    }
  }

  addSidebarItemEventListener() {
    const menus = this.el.querySelectorAll('.sidebar-menu')
    menus.forEach(menu => {
      const items = menu.querySelectorAll('.sidebar-item')
      items.forEach(item => {
        // add event listener
        const itemLink = item.querySelector('.sidebar-link')
        if (item.classList.contains('has-submenu')) {
          itemLink.addEventListener('click', (e) => {
            e.preventDefault()
            const submenu = item.querySelector('.sidebar-submenu')
            this.OverlayScrollbars.sleep()
            if (item.classList.contains('submenu-open')) {
              submenu.animate([
                { height: submenu.scrollHeight + 'px' },
                { height: 0 }
              ],{
                duration: 400,
                easing: 'ease-in'
              }).onfinish = () => {
                item.classList.remove('submenu-open')
                this.OverlayScrollbars.update()
              }
            } else {
              item.classList.add('submenu-open')
              submenu.animate([
                { height: 0 },
                { height: submenu.scrollHeight + 'px' }
              ],{
                duration: 400,
                easing: 'ease-out'
              }).onfinish = () => {
                this.OverlayScrollbars.update()
              }
            }
          })
        }
      })
    })
  }

  constructSidebarCollapse() {
    const btn = document.querySelector('.sidebar-collapse-btn')
    const toggle = () => {
      const wrapper = this.el.querySelector('.sidebar-wrapper')
      if (this.el.classList.contains('sidebar-collapse')) {
        this.el.classList.remove('sidebar-collapse')
        const animmateShowHeader = () => {
          wrapper.querySelectorAll('.sidebar-link span').forEach(text => {
            text.style.display = null
            text.animate([ { opacity: 0 }, { opacity: 1 } ],{ duration: 250, easing: 'ease-in' })
          })
          setTimeout(() => {
            wrapper.querySelectorAll('.sidebar-item-header').forEach((el, i) => {
              el.style.display = null
              el.animate([ { opacity: 0 }, { opacity: 1 } ],{ duration: 250, easing: 'ease-in' })
            })
            document.body.classList.remove('sidebar-collapsed')
            setTimeout(() => onAllFinish(), 250)
          }, 500)
        }
        const animateSidebarWidth = () => {
          document.body.classList.remove('sidebar-collapsed')
          document.querySelector('.main').animate([{ marginLeft: 5 + 'rem' },{ marginLeft: wrapper.scrollWidth + 'px' }], { duration: 500, easing: 'ease-in-out' })
          document.querySelector('.main-navbar')?.animate([{ paddingLeft: (80 + 32) + 'px', width: 100 + '%' },{ paddingLeft: wrapper.scrollWidth + 'px', width: document.querySelector('.main-navbar').scrollWidth + 'px' }], { duration: 500, easing: 'ease-in-out' })
          wrapper.querySelector('.sidebar-collapse-btn i')?.animate([{ transform: 'rotate(180deg)' },{ transform: 'rotate(360deg)' }], { duration: 1000, easing: 'ease-in-out' })
          wrapper.animate([
            { width: 80 + 'px' },
            { width: wrapper.scrollWidth + 'px' }
          ],{
            duration: 500,
            easing: 'ease-in-out',
          }).onfinish = () => {
            wrapper.querySelector('.sidebar-brand span').style.removeProperty('display')
            wrapper.querySelectorAll('.sidebar-content > *').forEach(el => {
              if (el.classList.contains('sidebar-menu')) return
              el.style.display = null
              el.animate([ { opacity: 0 }, { opacity: 1 } ],{ duration: 200, easing: 'ease-in' })
            })
          }
        }
        const onAllFinish = () => {
          this.openSubMenuIfActive()
        }
        animateSidebarWidth()
        setTimeout(() => animmateShowHeader(), 400)
      } else {
        wrapper.querySelectorAll('.sidebar-item-header').forEach((el, i) => {
          el.animate([ { opacity: 1 }, { opacity: 0 } ],{ duration: 100, easing: 'ease-in' }).onfinish = () => {
            el.style.display = 'none'
            if (i === wrapper.querySelectorAll('.sidebar-item-header').length - 1) {
              animateHideElement()
            }
          }
        })
        const animateHideElement = () => {
          wrapper.querySelector('.sidebar-brand span')
            .animate([ { opacity: 1, display: 'inline' }, { opacity: 0, display: 'none' } ],{ duration: 500, easing: 'ease-in' })
            .onfinish = () => wrapper.querySelector('.sidebar-brand span').style.display = 'none'
          // wrapper.querySelectorAll('.sidebar-content > *').forEach(el => {
          //   console.log(el)
          //   if (el.classList.contains('sidebar-menu')) return
          //   el.animate([ { opacity: 1 }, { opacity: 0 } ],{ duration: 300, easing: 'ease-in' }).onfinish = () => {
          //     el.style.display = 'none'
          //   }
          // })
          setTimeout(() => animateSidebarWidth(), 350)
        }
        const animateSidebarWidth = () => {
          wrapper.querySelectorAll('.sidebar-link span').forEach(text => {
            text.animate([ { opacity: 1 }, { opacity: 0 } ],{ duration: 300, easing: 'ease-in' }).onfinish = () => {
              text.style.display = 'none'
            }
          })
          setTimeout(() => {
            document.querySelector('.main').animate([ { marginLeft: wrapper.scrollWidth + 'px' }, { marginLeft: 5 + 'rem' } ], { duration: 500, easing: 'ease-in-out' })
            document.querySelector('.main-navbar')?.animate([{ paddingLeft: wrapper.scrollWidth + 'px', width: document.querySelector('.main-navbar').scrollWidth + 'px' },{ paddingLeft: (80 + 32) + 'px', width: 100 + '%' }], { duration: 500, easing: 'ease-in-out' })
            wrapper.querySelector('.sidebar-collapse-btn i')?.animate([{ transform: 'rotate(0deg)' },{ transform: 'rotate(180deg)' }], { duration: 1000, easing: 'ease-in-out' })
            wrapper.animate([
              { width: wrapper.scrollWidth + 'px' },
              { width: 80 + 'px' }
            ],{
              duration: 500,
              easing: 'ease-in-out',
            }).onfinish = () => {
              onAllFinish()
            }
          }, 300)
        }
        const onAllFinish = () => {
          wrapper.querySelector('.sidebar-brand span').style.removeProperty('display')
          this.el.classList.add('sidebar-collapse')
          document.body.classList.add('sidebar-collapsed')
          this.collapseAllSubMenu()
        }
      }
    }
    btn.addEventListener('click', toggle)
  }

  openSubMenuIfActive() {
    const menus = this.el.querySelectorAll('.sidebar-menu')
    menus.forEach(menu => {
      const items = menu.querySelectorAll('.sidebar-item')
      items.forEach(item => {
        // activate menu item
        if (item.classList.contains('active')) { 
          let parent = item.parentElement.parentElement
          while (true) {
            parent.classList.add('submenu-open')
            parent.classList.add('submenu-active')
            if (!parent.parentElement.classList.contains('sidebar-submenu') || !parent.parentElement.parentElement.classList.contains('sidebar-item')) {
              break
            } else {
              parent = parent.parentElement.parentElement
            }
          }
        }
      })
    })
  }

  collapseAllSubMenu() {
    const menus = this.el.querySelectorAll('.sidebar-menu')
    menus.forEach(menu => {
      const items = menu.querySelectorAll('.sidebar-item')
      items.forEach(item => {
        if (item.classList.contains('submenu-open')) {
          const submenu = item.querySelector('.sidebar-submenu')
          submenu.animate([
            { height: submenu.scrollHeight + 'px' },
            { height: 0 }
          ],{
            duration: 400,
            easing: 'ease-in'
          }).onfinish = () => {
            item.classList.remove('submenu-open')
          }
        }
      })
    })
  }
}