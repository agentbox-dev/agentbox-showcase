import { NextRequest, NextResponse } from 'next/server'
import { apiUrlHelpers } from '@/lib/api-url'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { keyId: string } }
) {
  try {
    const { keyId } = params
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

    if (!keyId) {
      return NextResponse.json(
        { error: 'API Key ID is required' },
        { status: 400 }
      )
    }

    const targetUrl = apiUrlHelpers.apiKey(keyId)

    console.log('🔄 Proxying delete API Key request to:', targetUrl)
    console.log('🔑 Token:', authToken.substring(0, 20) + '...')
    console.log('🏢 Team:', teamId)
    console.log('🗑️ Key ID:', keyId)

    const response = await fetch(targetUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Supabase-Token': authToken,
        'X-Supabase-Team': teamId,
      },
    })

    console.log('📡 Target API response status:', response.status)

    if (response.ok) {
      try {
        const responseData = await response.json()
        console.log('📡 Target API response data:', responseData)
        return NextResponse.json(responseData)
      } catch (parseError) {
        console.log('📡 Target API response is empty or unparseable, returning default success message')
        return NextResponse.json({ message: 'API Key deleted successfully' })
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ Target API error:', errorData)
      return NextResponse.json(
        { error: errorData.message || 'Failed to delete API key' },
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { keyId: string } }
) {
  try {
    const { keyId } = params
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

    if (!keyId) {
      return NextResponse.json(
        { error: 'API Key ID is required' },
        { status: 400 }
      )
    }

    const targetUrl = apiUrlHelpers.apiKey(keyId)

    console.log('🔄 Proxying update API Key request to:', targetUrl)
    console.log('🔑 Token:', authToken.substring(0, 20) + '...')
    console.log('🏢 Team:', teamId)
    console.log('📝 Body:', body)

    const response = await fetch(targetUrl, {
      method: 'PATCH',
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
        { error: errorData.message || 'Failed to update API key' },
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
