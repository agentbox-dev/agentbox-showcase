import { NextRequest, NextResponse } from 'next/server'
import { apiUrlHelpers } from '@/lib/api-url'

export async function GET(request: NextRequest) {
  try {
    const authToken = request.headers.get('X-Supabase-Token')
    const teamId = request.headers.get('X-Supabase-Team')

    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      )
    }

    if (!teamId) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      )
    }

    const targetUrl = apiUrlHelpers.apiKeys()

    console.log('🔄 Proxying API Keys request to:', targetUrl)
    console.log('🔑 Token:', authToken.substring(0, 20) + '...')
    console.log('🏢 Team:', teamId)

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Supabase-Token': authToken,
        'X-Supabase-Team': teamId,
      },
    })

    console.log('📡 Target API response status:', response.status)

    if (response.ok) {
      const responseData = await response.json()
      console.log('📡 Target API response data:', responseData)
      return NextResponse.json(responseData)
    } else {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ Target API error:', errorData)
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch API keys' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('❌ Proxy API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authToken = request.headers.get('X-Supabase-Token')
    const teamId = request.headers.get('X-Supabase-Team')
    const body = await request.json()

    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      )
    }

    if (!teamId) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      )
    }

    const { name } = body

    if (!name) {
      return NextResponse.json(
        { error: 'API Key name is required' },
        { status: 400 }
      )
    }

    const targetUrl = apiUrlHelpers.apiKeys()

    console.log('🔄 Proxying create API Key request to:', targetUrl)
    console.log('🔑 Token:', authToken.substring(0, 20) + '...')
    console.log('🏢 Team:', teamId)
    console.log('📝 Body:', body)

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Supabase-Token': authToken,
        'X-Supabase-Team': teamId,
      },
      body: JSON.stringify(body),
    })

    console.log('📡 Target API response status:', response.status)

    if (response.ok) {
      const responseData = await response.json()
      console.log('📡 Target API response data:', responseData)
      return NextResponse.json(responseData)
    } else {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ Target API error:', errorData)
      return NextResponse.json(
        { error: errorData.message || 'Failed to create API key' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('❌ Proxy API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
