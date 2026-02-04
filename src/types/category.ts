export interface Category {
  id: number
  name: string
  parentId: number | null
  level: number
  children?: Category[]
}

export type CategoryTree = Category[]
