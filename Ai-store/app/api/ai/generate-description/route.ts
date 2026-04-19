import { NextRequest, NextResponse } from 'next/server'
import { products, getProductById } from '@/lib/products'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, style, length } = body
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    const product = getProductById(productId)
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    const descriptionStyle = style || 'professional'
    const descriptionLength = length || 'medium'
    
    // AI-powered product description generation
    const generatedDescription = generateDescription(product, descriptionStyle, descriptionLength)
    
    const variations = {
      short: generateDescription(product, descriptionStyle, 'short'),
      medium: generateDescription(product, descriptionStyle, 'medium'),
      long: generateDescription(product, descriptionStyle, 'long')
    }
    
    const features = extractFeatures(product)
    const benefits = generateBenefits(product)
    const keywords = generateKeywords(product)
    
    return NextResponse.json({
      productId: product.id,
      productName: product.name,
      generatedDescription,
      variations,
      features,
      benefits,
      keywords,
      style: descriptionStyle,
      metadata: {
        wordCount: generatedDescription.split(' ').length,
        characterCount: generatedDescription.length,
        readabilityScore: calculateReadability(generatedDescription)
      }
    })
  } catch (error) {
    console.error('Description generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 500 }
    )
  }
}

function generateDescription(product: any, style: string, length: string): string {
  let description = ''
  
  // Base description based on product attributes
  const intro = `${product.name} is a ${product.category.toLowerCase()} product`
  
  // Style variations
  if (style === 'professional') {
    description = `${intro} designed for professionals and enthusiasts. `
  } else if (style === 'casual') {
    description = `${intro} that's perfect for everyday use. `
  } else if (style === 'marketing') {
    description = `Discover the ${product.name} - ${intro} that will transform your experience. `
  } else {
    description = `${intro}. `
  }
  
  // Add features based on tags and description
  if (product.tags) {
    const tagFeatures = product.tags.map((tag: string) => {
      switch(tag.toLowerCase()) {
        case 'wireless': return 'wireless connectivity'
        case 'rgb': return 'customizable RGB lighting'
        case 'ergonomic': return 'ergonomic design'
        case 'gaming': return 'gaming-optimized performance'
        case 'premium': return 'premium build quality'
        default: return tag
      }
    })
    
    if (tagFeatures.length > 0) {
      description += `Features include ${tagFeatures.slice(0, 3).join(', ')}. `
    }
  }
  
  // Add rating and reviews
  if (product.rating >= 4.5) {
    description += `Highly rated with ${product.rating} stars from ${product.reviews} satisfied customers. `
  } else if (product.rating >= 4.0) {
    description += `Well-reviewed with ${product.rating} stars and ${product.reviews} customer reviews. `
  }
  
  // Add price context
  if (product.price < 50) {
    description += `Affordably priced at $${product.price.toFixed(2)}, making it an excellent value. `
  } else if (product.price < 200) {
    description += `Priced at $${product.price.toFixed(2)}, offering great features for the price. `
  } else {
    description += `Premium pricing at $${product.price.toFixed(2)} reflects its high-quality construction and advanced features. `
  }
  
  // Length adjustments
  if (length === 'short') {
    const sentences = description.split('. ').slice(0, 2)
    description = sentences.join('. ').trim() + '.'
  } else if (length === 'long') {
    description += `Perfect for ${getUseCases(product)}. `
    description += `With ${product.inStock ? 'immediate availability' : 'limited stock'}, this product is ${product.inStock ? 'ready to ship' : 'in high demand'}. `
  }
  
  return description.trim()
}

function extractFeatures(product: any): string[] {
  const features: string[] = []
  
  if (product.tags) {
    product.tags.forEach((tag: string) => {
      switch(tag.toLowerCase()) {
        case 'wireless':
          features.push('Wireless connectivity')
          break
        case 'rgb':
          features.push('RGB customization')
          break
        case 'ergonomic':
          features.push('Ergonomic design')
          break
        case 'gaming':
          features.push('Gaming optimized')
          break
        case 'premium':
          features.push('Premium materials')
          break
      }
    })
  }
  
  // Add category-specific features
  if (product.category === 'Electronics') {
    features.push('Advanced technology', 'Modern design')
  } else if (product.category === 'Accessories') {
    features.push('Compatible design', 'Easy setup')
  }
  
  return features.length > 0 ? features : ['Quality construction', 'Reliable performance']
}

function generateBenefits(product: any): string[] {
  const benefits: string[] = []
  
  if (product.tags?.includes('wireless')) {
    benefits.push('Freedom of movement without cables')
  }
  if (product.tags?.includes('ergonomic')) {
    benefits.push('Improved comfort during extended use')
  }
  if (product.tags?.includes('gaming')) {
    benefits.push('Enhanced gaming experience')
  }
  if (product.rating >= 4.5) {
    benefits.push('Proven customer satisfaction')
  }
  if (product.price < 100) {
    benefits.push('Great value for your budget')
  }
  
  return benefits.length > 0 ? benefits : ['Enhanced productivity', 'Improved user experience']
}

function generateKeywords(product: any): string[] {
  const keywords: string[] = [product.name, product.category]
  
  if (product.tags) {
    keywords.push(...product.tags)
  }
  
  // Add related keywords
  if (product.category === 'Electronics') {
    keywords.push('tech', 'digital', 'smart device')
  } else {
    keywords.push('accessory', 'add-on', 'enhancement')
  }
  
  return [...new Set(keywords)] // Remove duplicates
}

function getUseCases(product: any): string {
  if (product.tags?.includes('gaming')) {
    return 'gaming, streaming, and competitive play'
  }
  if (product.tags?.includes('wireless')) {
    return 'on-the-go use and wireless convenience'
  }
  if (product.category === 'Electronics') {
    return 'professional work and personal projects'
  }
  return 'daily use and productivity'
}

function calculateReadability(text: string): number {
  // Simple readability score (0-100, higher = easier to read)
  const words = text.split(' ').length
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  const avgWordsPerSentence = words / sentences
  
  // Flesch-like score (simplified)
  const score = 100 - (avgWordsPerSentence * 1.5)
  return Math.max(0, Math.min(100, Math.round(score)))
}
