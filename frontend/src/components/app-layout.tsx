import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/sections/navbar'
import { Footer } from '@/components/sections/footer'

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
