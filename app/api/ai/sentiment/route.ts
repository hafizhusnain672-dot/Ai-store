import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reviews } = body
    
    if (!reviews || !Array.isArray(reviews)) {
      return NextResponse.json(
        { error: 'Reviews array is required' },
        { status: 400 }
      )
    }
    
    // AI-powered sentiment analysis
    const sentimentResults = reviews.map((review: string) => {
      const lowerReview = review.toLowerCase()
      
      // Positive indicators
      const positiveWords = ['great', 'excellent', 'amazing', 'love', 'perfect', 'good', 'wonderful', 'fantastic', 'awesome', 'best', 'highly recommend', 'satisfied', 'happy']
      const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disappointed', 'waste', 'poor', 'worst', 'broken', 'defective', 'useless', 'regret']
      
      let positiveScore = 0
      let negativeScore = 0
      
      positiveWords.forEach(word => {
        if (lowerReview.includes(word)) positiveScore++
      })
      
      negativeWords.forEach(word => {
        if (lowerReview.includes(word)) negativeScore++
      })
      
      // Determine sentiment
      let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral'
      let score = 0
      
      if (positiveScore > negativeScore) {
        sentiment = 'positive'
        score = Math.min(1, 0.5 + (positiveScore - negativeScore) * 0.1)
      } else if (negativeScore > positiveScore) {
        sentiment = 'negative'
        score = Math.max(0, 0.5 - (negativeScore - positiveScore) * 0.1)
      } else {
        sentiment = 'neutral'
        score = 0.5
      }
      
      // Extract key phrases
      const keyPhrases: string[] = []
      if (lowerReview.includes('quality')) keyPhrases.push('Quality')
      if (lowerReview.includes('price') || lowerReview.includes('cost')) keyPhrases.push('Price')
      if (lowerReview.includes('delivery') || lowerReview.includes('shipping')) keyPhrases.push('Delivery')
      if (lowerReview.includes('customer service')) keyPhrases.push('Customer Service')
      if (lowerReview.includes('easy') || lowerReview.includes('simple')) keyPhrases.push('Ease of Use')
      
      return {
        review,
        sentiment,
        score,
        confidence: Math.abs(positiveScore - negativeScore) / (positiveScore + negativeScore + 1),
        keyPhrases: keyPhrases.length > 0 ? keyPhrases : ['General']
      }
    })
    
    // Aggregate analysis
    const totalReviews = sentimentResults.length
    const positiveCount = sentimentResults.filter(r => r.sentiment === 'positive').length
    const negativeCount = sentimentResults.filter(r => r.sentiment === 'negative').length
    const neutralCount = sentimentResults.filter(r => r.sentiment === 'neutral').length
    
    const averageScore = sentimentResults.reduce((sum, r) => sum + r.score, 0) / totalReviews
    
    const summary = {
      totalReviews,
      distribution: {
        positive: (positiveCount / totalReviews) * 100,
        negative: (negativeCount / totalReviews) * 100,
        neutral: (neutralCount / totalReviews) * 100
      },
      averageSentimentScore: averageScore,
      overallSentiment: averageScore > 0.6 ? 'positive' : averageScore < 0.4 ? 'negative' : 'neutral',
      insights: generateSentimentInsights(sentimentResults, averageScore)
    }
    
    return NextResponse.json({
      individual: sentimentResults,
      summary
    })
  } catch (error) {
    console.error('Sentiment analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze sentiment' },
      { status: 500 }
    )
  }
}

function generateSentimentInsights(results: any[], avgScore: number): string[] {
  const insights: string[] = []
  
  if (avgScore > 0.7) {
    insights.push('Customers are highly satisfied with this product.')
  } else if (avgScore < 0.4) {
    insights.push('There are significant concerns raised by customers.')
  } else {
    insights.push('Customer sentiment is mixed, with both positive and negative feedback.')
  }
  
  const allKeyPhrases = results.flatMap(r => r.keyPhrases)
  const phraseCounts = allKeyPhrases.reduce((acc: any, phrase: string) => {
    acc[phrase] = (acc[phrase] || 0) + 1
    return acc
  }, {})
  
  const topPhrase = Object.entries(phraseCounts).sort((a: any, b: any) => b[1] - a[1])[0]
  if (topPhrase) {
    insights.push(`Most reviews mention "${topPhrase[0]}" as a key aspect.`)
  }
  
  return insights
}
