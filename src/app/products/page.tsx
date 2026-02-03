import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ProductsPageWrapper from './ProductsPageWrapper'

export default async function ProductsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return <ProductsPageWrapper />
}
