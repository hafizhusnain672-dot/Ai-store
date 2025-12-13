import { products } from './products'
import { Product } from '@/types'

// Mock AI service that simulates AI responses
// In production, replace with actual OpenAI API calls

export interface AIResponse {
  message: string
  recommendations?: Product[]
  products?: Product[]
}

export async function getAIResponse(
  userMessage: string,
  context?: { cartItems?: any[], viewedProducts?: string[] }
): Promise<AIResponse> {
  const lowerMessage = userMessage.toLowerCase()
  
  // Product search queries
  if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('looking for')) {
    const searchTerms = extractSearchTerms(userMessage)
    const results = searchProducts(searchTerms)
    if (results.length > 0) {
      const prices = results.map(p => p.price)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      let priceRangeMsg = minPrice === maxPrice
        ? `The price for "${searchTerms}" is $${minPrice.toFixed(2)}.`
        : `The price range for "${searchTerms}" is $${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}.`
      return {
        message: `I found ${results.length} product(s) matching your search. ${priceRangeMsg} Here are some options:`,
        products: results.slice(0, 5)
      }
    } else {
      return {
        message: `I couldn't find products matching "${searchTerms}". Would you like to browse our categories instead?`,
        products: []
      }
    }
  }
  
  // Price inquiries
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
    const productName = extractProductName(userMessage)
    const product = products.find(p => 
      p.name.toLowerCase().includes(productName.toLowerCase())
    )
    
    if (product) {
      return {
        message: `The ${product.name} is currently priced at $${product.price.toFixed(2)}. It has a ${product.rating}-star rating with ${product.reviews} reviews.`,
        recommendations: [product]
      }
    }
  }
  
  // Recommendations based on cart
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('similar')) {
    const recommendations = getRecommendations(context)
    return {
      message: recommendations.length > 0
        ? `Based on your interests, I recommend these products:`
        : `Here are some popular products you might like:`,
      recommendations: recommendations.length > 0 ? recommendations : products.slice(0, 3)
    }
  }
  
  // Shipping/return questions
  if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
    return {
      message: `We offer free shipping on orders over $50. Standard shipping takes 3-5 business days, and express shipping (2-3 days) is available for $9.99.`
    }
  }
  
  if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
    return {
      message: `We offer a 30-day return policy. Items must be in original condition with tags attached. Returns are free for orders over $50.`
    }
  }
  
  // Category browsing
  const categories = ['Electronics', 'Accessories']
  const mentionedCategory = categories.find(cat => 
    lowerMessage.includes(cat.toLowerCase())
  )
  
  if (mentionedCategory) {
    const categoryProducts = products.filter(p => p.category === mentionedCategory)
    return {
      message: `Here are our ${mentionedCategory} products:`,
      products: categoryProducts.slice(0, 6)
    }
  }
  
  // Comparison requests
  if (lowerMessage.includes('compare') || lowerMessage.includes('difference between')) {
    return {
      message: `I can help you compare products! Visit our AI Features page to use the Product Comparison tool, or tell me which products you'd like to compare and I'll help you analyze them.`
    }
  }
  
  // Price prediction requests
  if (lowerMessage.includes('price prediction') || lowerMessage.includes('will price go') || lowerMessage.includes('price forecast')) {
    return {
      message: `I can help predict product prices! Check out the Price Predictor on any product page to see AI-powered price forecasts and get recommendations on when to buy.`
    }
  }
  
  // Review analysis requests
  if (lowerMessage.includes('review') && (lowerMessage.includes('analyze') || lowerMessage.includes('sentiment'))) {
    return {
      message: `I can analyze product reviews for sentiment! Visit our AI Features page to use the Review Sentiment Analyzer, which can identify positive, negative, and neutral feedback from customer reviews.`
    }
  }
  
  // Image analysis requests
  if (lowerMessage.includes('image') || lowerMessage.includes('photo') || lowerMessage.includes('picture')) {
    return {
      message: `I can analyze product images! Our AI Image Analysis feature can detect objects, extract colors, assess quality, and provide recommendations. Check out the AI Features page to try it.`
    }
  }
  
  // Description generation requests
  if (lowerMessage.includes('generate description') || lowerMessage.includes('create description')) {
    return {
      message: `I can generate product descriptions in different styles! Our AI Description Generator can create professional, casual, or marketing-focused descriptions. Visit the AI Features page to try it.`
    }
  }
  
  // Default helpful response
  return {
    message: `I'm here to help! I can assist you with:\n• Finding products (semantic search)\n• Product recommendations\n• Price inquiries & predictions\n• Product comparisons\n• Review sentiment analysis\n• Image analysis\n• Shipping information\n• Returns and refunds\n\nTry our AI Features page for advanced capabilities!`,
    recommendations: products.slice(0, 3)
  }
}

function extractSearchTerms(message: string): string {
  const searchPatterns = [
    /(?:find|search|looking for|show me)\s+(.+)/i,
    /(.+?)(?:\s+under|\s+below|\s+less than)/i,
  ]
  
  for (const pattern of searchPatterns) {
    const match = message.match(pattern)
    if (match) {
      return match[1].trim()
    }
  }
  
  return message.replace(/(find|search|looking for|show me)/gi, '').trim() || message
}

function extractProductName(message: string): string {
  const productNames = products.map(p => p.name.toLowerCase())
  for (const name of productNames) {
    if (message.toLowerCase().includes(name)) {
      return name
    }
  }
  return message
}

function getRecommendations(context?: { cartItems?: any[], viewedProducts?: string[] }): Product[] {
  if (!context) return []
  
  const recommendations: Product[] = []
  const seenIds = new Set(context.viewedProducts || [])
  
  // If user has items in cart, recommend complementary products
  if (context.cartItems && context.cartItems.length > 0) {
    const cartCategories = new Set(context.cartItems.map((item: any) => item.category))
    
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
  
  // Fill remaining slots with popular products
  products.forEach(product => {
    if (!seenIds.has(product.id) && recommendations.length < 5) {
      recommendations.push(product)
      seenIds.add(product.id)
    }
  })
  
  return recommendations
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase()
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

