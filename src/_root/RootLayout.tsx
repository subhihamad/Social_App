import BottomBar from '@/components/share/BottomBar'
import LeftBar from '@/components/share/LeftBar'
import TopBar from '@/components/share/TopBar'
import { Outlet } from 'react-router'
const RootLayout = () => {
  return (
    <div className='w-full md:flex'>
      <TopBar />
      <LeftBar />
      <section className='flex flex-1 h-full'>
        <Outlet />
      </section>
      <BottomBar />
    </div>
  )
}

export default RootLayout