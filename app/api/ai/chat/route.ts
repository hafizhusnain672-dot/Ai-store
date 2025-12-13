import { NextRequest, NextResponse } from 'next/server'
import { getAIResponse } from '@/lib/aiService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, context } = body
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }
    
    const response = await getAIResponse(message, context)
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    )
  }
}

