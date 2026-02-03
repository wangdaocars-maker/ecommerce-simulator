import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ProductCreateClient from './ProductCreateClient'

export default async function ProductCreatePage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return <ProductCreateClient />
}
