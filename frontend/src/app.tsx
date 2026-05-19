import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/app-layout'
import { BuildPage } from '@/pages/build-page'
import { HistoryPage } from '@/pages/history-page'
import { LandingPage } from '@/pages/landing-page'
import { StackPage } from '@/pages/stack-page'

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/build" element={<BuildPage />} />
        <Route path="/stack/:id" element={<StackPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Route>
    </Routes>
  )
}
