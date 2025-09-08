import { NextRequest, NextResponse } from 'next/server'
import { apiUrlHelpers } from '@/lib/api-url'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teamID = searchParams.get('teamID')
    
    // 从请求头获取认证信息
    const supabaseToken = request.headers.get('x-supabase-token')
    const supabaseTeam = request.headers.get('x-supabase-team')
    
    if (!supabaseToken) {
      return NextResponse.json(
        { error: 'X-Supabase-Token header is required' },
        { status: 401 }
      )
    }

    // 构建目标API URL
    const targetUrl = teamID 
      ? apiUrlHelpers.templates(teamID)
      : apiUrlHelpers.defaultTemplates()
    
    console.log('🔄 Proxying templates request to:', targetUrl)
    console.log('🔑 Token:', supabaseToken.substring(0, 20) + '...')
    console.log('🏢 Team:', supabaseTeam || 'None')

    // 转发请求到目标API
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Supabase-Token': supabaseToken,
        ...(supabaseTeam && { 'X-Supabase-Team': supabaseTeam }),
      },
    })

    console.log('📡 Target API response status:', response.status)

    // 获取响应数据
    const data = await response.json()
    
    // 返回响应，保持原始状态码
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Supabase-Token, X-Supabase-Team',
      }
    })
  } catch (error) {
    console.error('❌ Templates proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Supabase-Token, X-Supabase-Team',
    },
  })
}
