import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/lib/products'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cartItems, viewedProducts } = body
    
    // AI-powered recommendation logic
    const recommendations: typeof products = []
    const seenIds = new Set(viewedProducts || [])
    
    // If user has items in cart, recommend complementary products
    if (cartItems && cartItems.length > 0) {
      const cartCategories = new Set(cartItems.map((item: any) => item.category))
      
      products.forEach(product => {
        if (
          !seenIds.has(product.id) &&
          cartCategories.has(product.category) &&
          recommendations.length < 3
        ) {
          recommendations.push(product)
          seenIds.add(product.id)
        }
      })
    }
    
    // Fill with popular/highly rated products
    const popularProducts = [...products]
      .sort((a, b) => b.rating - a.rating)
      .filter(p => !seenIds.has(p.id))
      .slice(0, 5 - recommendations.length)
    
    recommendations.push(...popularProducts)
    
    return NextResponse.json({ recommendations: recommendations.slice(0, 5) })
  } catch (error) {
    console.error('Recommendations error:', error)
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    )
  }
}

