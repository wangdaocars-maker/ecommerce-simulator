import TemuHeader from '@/components/temu/TemuHeader'
import TemuSidebar from '@/components/temu/TemuSidebar'

export default function TemuLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <TemuHeader />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <TemuSidebar />
        <main style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
