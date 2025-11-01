import { SidebarComponent } from '@syncfusion/ej2-react-navigations'
import { useRef } from 'react'
import { Link } from 'react-router'
import NavItems from './Navitems'

const MobileSidebar = () => {
  const sidebarRef = useRef<SidebarComponent>(null)
  
  const toggleSidebar = () => {
    if (sidebarRef.current) {
      sidebarRef.current.toggle()
    }
  }

  return (
    <div className='mobile-sidebar wrapper'>
      <header>
        <Link to="/">
          <img src="/assets/icons/logo.svg" alt="logo" className='size-[30px]' />
          <h1>TravelEase</h1>
        </Link>
        
        <button onClick={toggleSidebar} aria-label="Toggle menu">
          <img src="/assets/icons/menu.svg" alt="menu" className="size-7" />
        </button>
      </header>
      
      <SidebarComponent 
        width={270} 
        ref={sidebarRef}
        closeOnDocumentClick={true}
        showBackdrop={true}
        type='Over'>
        <NavItems handleClick={toggleSidebar} />
      </SidebarComponent>
    </div>
  )
}

export default MobileSidebar