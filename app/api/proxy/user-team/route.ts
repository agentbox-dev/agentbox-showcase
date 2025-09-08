import { NextRequest, NextResponse } from 'next/server'
import { apiUrlHelpers } from '@/lib/api-url'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证必需字段
    if (!body.email || !body.teamID) {
      return NextResponse.json(
        { error: 'email and teamID are required' },
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
    const targetUrl = apiUrlHelpers.inviteTeamMember()

    console.log('🔄 Proxying user-team request to:', targetUrl)
    console.log('🔑 Token:', authToken ? `${authToken.substring(0, 20)}...` : 'None')
    console.log('🏢 Team:', teamHeader || 'None')
    console.log('📝 Request body:', body)

    // 转发请求到后端API
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Supabase-Token': authToken,
        ...(teamHeader && { 'X-Supabase-Team': teamHeader }),
      },
      body: JSON.stringify(body),
    })

    const responseData = await response.json()

    console.log('📡 Target API response status:', response.status)
    console.log('📡 Target API response data:', responseData)

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.message || 'Failed to invite user to team' },
        { status: response.status }
      )
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('❌ Proxy API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
