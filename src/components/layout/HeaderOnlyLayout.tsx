'use client'

import { SessionProvider } from 'next-auth/react'
import { Layout } from 'antd'
import Header from './Header'

const { Content } = Layout

interface HeaderOnlyLayoutProps {
  children: React.ReactNode
}

export default function HeaderOnlyLayout({ children }: HeaderOnlyLayoutProps) {
  return (
    <SessionProvider>
      <Layout style={{ minHeight: '100vh', overflow: 'visible' }}>
        <Header />
        <Content style={{
          marginTop: 64,
          backgroundColor: '#F5F5F5',
          minHeight: 'calc(100vh - 64px)',
          overflow: 'visible'
        }}>
          {children}
        </Content>
      </Layout>
    </SessionProvider>
  )
}
