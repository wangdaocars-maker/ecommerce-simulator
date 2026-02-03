'use client'

import MainLayout from '@/components/layout/MainLayout'
import ProductsClient from './ProductsClient'

export default function ProductsPageWrapper() {
  return (
    <MainLayout>
      <ProductsClient />
    </MainLayout>
  )
}
