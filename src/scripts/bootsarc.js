import Sidebar from './components/sidebar'
import Navbar from './components/navbar'
import ComponentViewer from './components/component-viewer'

function BootsarchInit() {
  // body scrollbar
  if (window && window.OverlayScrollbars) {
    const { OverlayScrollbars } = window
    window.OverlayScrollbarsBodyInstance = OverlayScrollbars(document.querySelector('body'), {});
  }

  // sidebar
  const sidebar = new Sidebar('nav.sidebar.main-sidebar')
  sidebar.init()

  // navbar
  const navbar = new Navbar('nav.navbar.main-navbar')
  navbar.init()

  // Component Viewer
  const componentViewers = document.querySelectorAll('.component-viewer')
  componentViewers.forEach(el => {
    (new ComponentViewer(el))
  })

  // icons
  if (typeof window.feather !== 'undefined') {
    feather.replace()
  }

  // save to window
  if (typeof window !== 'undefined') {
    window.sidebar = sidebar
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    const autoInit = document.body.classList.contains('auto-init')
    if (autoInit) {
      BootsarchInit()
    }
  })
}

export {
  Sidebar,
  Navbar,
  ComponentViewer,
  BootsarchInit
}
