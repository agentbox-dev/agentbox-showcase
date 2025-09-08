import { NextRequest, NextResponse } from 'next/server'
import { apiUrlHelpers } from '@/lib/api-url'

export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const body = await request.json()
    
    // 验证请求体
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: 'Team name is required' },
        { status: 400 }
      )
    }

    // 获取认证头部
    const authToken = request.headers.get('X-Supabase-Token')
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      )
    }

    // 构建目标URL
    const targetUrl = apiUrlHelpers.createTeam()
    
    // 转发请求到后端
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Supabase-Token': authToken,
      },
      body: JSON.stringify(body),
    })

    // 获取响应数据
    const data = await response.json()

    // 返回响应
    return NextResponse.json(data, { status: response.status })

  } catch (error) {
    console.error('❌ Error proxying team creation request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
