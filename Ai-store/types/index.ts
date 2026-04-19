export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
  tags?: string[]
}

export interface CartItem extends Product {
  quantity: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

