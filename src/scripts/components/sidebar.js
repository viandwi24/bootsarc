export default class Sidebar {
  constructor(query = 'nav.sidebar') {
    this.query = query
  }

  init() {
    this.el = typeof this.query === HTMLElement ? this.query : document.querySelector(this.query)
    this.prepareMenuItemHasSubMenu()
  }

  prepareMenuItemHasSubMenu() {
    this.el = document.querySelector(this.query)
    const menus = this.el.querySelectorAll('.sidebar-menu')
    menus.forEach(menu => {
      const items = menu.querySelectorAll('.sidebar-item')
      items.forEach(item => {
        // activate menu item
        if (item.classList.contains('active')) { 
          let parent = item.parentElement.parentElement
          while (true) {
            parent.classList.add('submenu-open')
            if (!parent.parentElement.classList.contains('sidebar-submenu') || !parent.parentElement.parentElement.classList.contains('sidebar-item')) {
              break
            } else {
              parent = parent.parentElement.parentElement
            }
          }
        }

        // add event listener
        const itemLink = item.querySelector('.sidebar-link')
        if (item.classList.contains('has-submenu')) {
          itemLink.addEventListener('click', (e) => {
            e.preventDefault()
            const submenu = item.querySelector('.sidebar-submenu')
            if (item.classList.contains('submenu-open')) {
              submenu.animate([
                { height: submenu.scrollHeight + 'px' },
                { height: 0 }
              ],{
                duration: 500,
                easing: 'ease-in'
              }).onfinish = () => {
                item.classList.remove('submenu-open')
              }
            } else {
              item.classList.add('submenu-open')
              submenu.animate([
                { height: 0 },
                { height: submenu.scrollHeight + 'px' }
              ],{
                duration: 500,
                easing: 'ease-out'
              })
            }
          })
        }
      })
    })
  }
}