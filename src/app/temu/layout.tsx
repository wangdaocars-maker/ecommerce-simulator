'use client'

import { usePathname } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import TemuHeader from '@/components/temu/TemuHeader'
import TemuSidebar from '@/components/temu/TemuSidebar'

export default function TemuLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showSidebar = !pathname.startsWith('/temu/products/create')
  return (
    <SessionProvider>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f5f5f5' }}>
        <TemuHeader />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {showSidebar && <TemuSidebar />}
          <main style={{ flex: 1, overflowY: 'auto', padding: showSidebar ? 16 : 0, backgroundColor: '#f5f5f5' }}>
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  )
}
