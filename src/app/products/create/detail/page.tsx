import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

export default async function ProductDetailPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return <ProductDetailClient />
}
