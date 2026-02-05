'use client'

import { useParams } from 'next/navigation'
import ProductDetailClient from '../../create/detail/ProductDetailClient'

export default function EditProductPage() {
  const params = useParams()
  const productId = params.id as string

  return <ProductDetailClient productId={productId} />
}
