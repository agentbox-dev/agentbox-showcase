import { NextRequest, NextResponse } from 'next/server'
import { apiUrlHelpers } from '@/lib/api-url'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string; teamId: string } }
) {
  try {
    const { userId, teamId } = params

    if (!userId || !teamId) {
      return NextResponse.json(
        { error: 'userId and teamId are required' },
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
    const targetUrl = apiUrlHelpers.removeTeamMember(userId, teamId)

    console.log('🔄 Proxying user-team DELETE request to:', targetUrl)
    console.log('🔑 Token:', authToken ? `${authToken.substring(0, 20)}...` : 'None')
    console.log('🏢 Team:', teamHeader || 'None')
    console.log('👤 User ID:', userId)
    console.log('🏢 Team ID:', teamId)

    // 转发请求到后端API
    const response = await fetch(targetUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Supabase-Token': authToken,
        ...(teamHeader && { 'X-Supabase-Team': teamHeader }),
      },
    })

    console.log('📡 Target API response status:', response.status)

    // 处理删除操作的成功响应
    if (response.ok) {
      // 尝试解析响应体，如果失败则返回默认成功消息
      try {
        const responseData = await response.json()
        console.log('📡 Target API response data:', responseData)
        return NextResponse.json(responseData)
      } catch (parseError) {
        // 如果响应体为空或无法解析（如 204 No Content），返回默认成功消息
        console.log('📡 Target API response is empty or unparseable, returning default success message')
        return NextResponse.json({ message: 'User removed from team successfully' })
      }
    }

    // 处理错误响应
    try {
      const errorData = await response.json()
      console.log('📡 Target API error response:', errorData)
      return NextResponse.json(
        { error: errorData.message || 'Failed to remove user from team' },
        { status: response.status }
      )
    } catch (parseError) {
      // 如果错误响应也无法解析
      console.log('📡 Target API error response is unparseable')
      return NextResponse.json(
        { error: 'Failed to remove user from team' },
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
