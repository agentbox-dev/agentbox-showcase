/**
 * 登录API验证工具
 * 用于验证登录接口返回的内容是否符合预期结构
 */

import { AccessTokenResponse } from './api/auth'

export interface LoginValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  responseData?: AccessTokenResponse
}

/**
 * 验证登录API响应结构
 */
export function validateLoginResponse(data: any): LoginValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  
  // 检查必需字段
  const requiredFields = [
    'access_token',
    'expires_at', 
    'expires_in',
    'provider_refresh_token',
    'provider_token',
    'refresh_token',
    'token_type',
    'user',
    'weak_password'
  ]
  
  for (const field of requiredFields) {
    if (!(field in data)) {
      errors.push(`缺少必需字段: ${field}`)
    }
  }
  
  // 验证字段类型
  if (data.access_token && typeof data.access_token !== 'string') {
    errors.push('access_token 应该是字符串类型')
  }
  
  if (data.expires_at && typeof data.expires_at !== 'number') {
    errors.push('expires_at 应该是数字类型')
  }
  
  if (data.expires_in && typeof data.expires_in !== 'number') {
    errors.push('expires_in 应该是数字类型')
  }
  
  if (data.refresh_token && typeof data.refresh_token !== 'string') {
    errors.push('refresh_token 应该是字符串类型')
  }
  
  // 检查 refresh_token 是否为 "None" 字符串
  if (data.refresh_token === "None") {
    warnings.push('refresh_token 为 "None"，可能表示不支持刷新token')
  }
  
  if (data.token_type && typeof data.token_type !== 'string') {
    errors.push('token_type 应该是字符串类型')
  }
  
  if (data.user && typeof data.user !== 'object') {
    errors.push('user 应该是对象类型')
  }
  
  if (data.weak_password && typeof data.weak_password !== 'object') {
    errors.push('weak_password 应该是对象类型')
  }
  
  // 验证token格式
  if (data.access_token && data.access_token.length < 10) {
    warnings.push('access_token 长度似乎过短')
  }
  
  if (data.refresh_token && data.refresh_token.length < 10) {
    warnings.push('refresh_token 长度似乎过短')
  }
  
  // 验证过期时间
  if (data.expires_at) {
    const now = Date.now() / 1000
    const expires = data.expires_at
    
    if (expires <= now) {
      errors.push('token 已过期')
    } else {
      const timeLeft = expires - now
    }
  }
  
  // 验证用户数据
  if (data.user) {
    
    if (!data.user.email) {
      warnings.push('用户数据中缺少 email 字段')
    }
    
    if (!data.user.id) {
      warnings.push('用户数据中缺少 id 字段')
    }
  }
  
  const isValid = errors.length === 0
  
  console.log('✅ 验证结果:')
  console.log(`   - 是否有效: ${isValid ? '✅' : '❌'}`)
  console.log(`   - 错误数量: ${errors.length}`)
  console.log(`   - 警告数量: ${warnings.length}`)
  
  if (errors.length > 0) {
    console.log('❌ 错误详情:', errors)
  }
  
  if (warnings.length > 0) {
    console.log('⚠️ 警告详情:', warnings)
  }
  
  return {
    isValid,
    errors,
    warnings,
    responseData: isValid ? data as AccessTokenResponse : undefined
  }
}

/**
 * 测试登录API
 */
export async function testLoginAPI(email: string, password: string) {
  console.log('🚀 开始测试登录API...')
  console.log(`📧 测试邮箱: ${email}`)
  
  try {
    const response = await fetch('/api/user/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    
    console.log('📡 API响应状态:', response.status)
    console.log('📡 API响应头:', Object.fromEntries(response.headers.entries()))
    
    const data = await response.json()
    console.log('📋 API响应数据:', data)
    
    const validation = validateLoginResponse(data)
    
    return {
      success: response.ok,
      status: response.status,
      validation,
      data
    }
  } catch (error) {
    console.error('❌ API调用失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      validation: {
        isValid: false,
        errors: ['API调用失败'],
        warnings: []
      }
    }
  }
}

/**
 * 在浏览器控制台中可用的测试函数
 */
if (typeof window !== 'undefined') {
  (window as any).testLogin = {
    validate: validateLoginResponse,
    testAPI: testLoginAPI,
    
    // 快速测试函数
    quickTest: async (email = 'test@example.com', password = 'testpassword') => {
      console.log('🔧 快速登录测试...')
      return await testLoginAPI(email, password)
    }
  }
  
  console.log('🔧 登录验证工具已加载到 window.testLogin')
  console.log('使用方法:')
  console.log('  - window.testLogin.quickTest() // 使用默认凭据测试')
  console.log('  - window.testLogin.quickTest("your@email.com", "password") // 使用自定义凭据')
  console.log('  - window.testLogin.validate(data) // 验证响应数据')
}
