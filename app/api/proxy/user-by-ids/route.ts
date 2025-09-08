import { NextRequest, NextResponse } from 'next/server'
import { apiUrlHelpers } from '@/lib/api-url'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userIds = searchParams.get('user_ids')

    if (!userIds) {
      return NextResponse.json(
        { error: 'user_ids parameter is required' },
        { status: 400 }
      )
    }

    // 从请求头中获取认证信息
    const authToken = request.headers.get('X-Supabase-Token')
    const teamHeader = request.headers.get('X-Supabase-Team')

    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      )
    }

    // 构建目标API URL
    const targetUrl = apiUrlHelpers.usersByIds(userIds)

    console.log('🔄 Proxying user-by-ids request to:', targetUrl)
    console.log('🔑 Token:', authToken ? `${authToken.substring(0, 20)}...` : 'None')
    console.log('🏢 Team:', teamHeader || 'None')
    console.log('👥 User IDs:', userIds)

    // 转发请求到后端API
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Supabase-Token': authToken,
        ...(teamHeader && { 'X-Supabase-Team': teamHeader }),
      },
    })

    console.log('📡 Target API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Target API error:', errorText)
      return NextResponse.json(
        { error: `Target API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('✅ Successfully proxied user-by-ids request, got', Array.isArray(data) ? data.length : 'unknown', 'users')

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
