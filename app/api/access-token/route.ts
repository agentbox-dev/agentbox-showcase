import { NextRequest, NextResponse } from 'next/server'
import { apiUrlHelpers } from '@/lib/api-url'

export async function GET(request: NextRequest) {
  try {
    const authToken = request.headers.get('X-Supabase-Token')

    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      )
    }

    const targetUrl = apiUrlHelpers.accessToken()


    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Supabase-Token': authToken,
      },
    })


    if (response.ok) {
      const responseData = await response.json()
      return NextResponse.json(responseData)
    } else {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ Target API error:', errorData)
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch access token' },
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

export async function PATCH(request: NextRequest) {
  try {
    const authToken = request.headers.get('X-Supabase-Token')
    const teamId = request.headers.get('X-Supabase-Team')

    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      )
    }


    const targetUrl = apiUrlHelpers.accessToken()

    const requestBody = { name: 'e2b_dashboard_generated_access_token' }
    

    const response = await fetch(targetUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Supabase-Token': authToken,
        ...(teamId && { 'X-Supabase-Team': teamId }),
      },
      body: JSON.stringify(requestBody),
    })


    if (response.ok) {
      const responseData = await response.json()
      return NextResponse.json(responseData)
    } else {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ Target API error:', errorData)
      console.error('❌ Response status:', response.status)
      console.error('❌ Response statusText:', response.statusText)
      return NextResponse.json(
        { 
          error: errorData.message || 'Failed to update access token',
          details: errorData,
          status: response.status 
        },
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
