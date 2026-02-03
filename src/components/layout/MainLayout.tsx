'use client'

import { Layout } from 'antd'
import { SessionProvider } from 'next-auth/react'
import Header from './Header'
import Sidebar from './Sidebar'

const { Content, Sider } = Layout

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SessionProvider>
      <Layout className="min-h-screen">
        <Header />
        <Layout>
          <Sider width={200} style={{ background: '#fafafa' }}>
            <Sidebar />
          </Sider>
          <Content className="bg-[#F9FAFB]" style={{ padding: 0 }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </SessionProvider>
  )
}
