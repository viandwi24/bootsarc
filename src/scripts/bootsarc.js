import Sidebar from './components/sidebar'

function BootsarchInit() {
  // sidebar
  const sidebar = new Sidebar()
  sidebar.init()

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
  BootsarchInit
}