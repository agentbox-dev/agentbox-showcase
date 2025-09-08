# API URL 统一管理使用指南

## 概述

`src/lib/api-url.ts` 提供了统一的API URL构建和管理功能，替代了项目中分散的API URL构建代码。

## 主要功能

### 1. 基础URL获取
```typescript
import { getApiBaseUrl } from '@/lib/api-url'

// 自动检测环境（服务端/客户端）
const baseUrl = getApiBaseUrl()
```

### 2. 通用URL构建
```typescript
import { buildApiUrl } from '@/lib/api-url'

// 基础用法
const url1 = buildApiUrl('/user-teams')
// 结果: https://api.agentbox.lingyiwanwu.com/user-teams

// 带参数
const url2 = buildApiUrl('/user-teams', { user_id: '123' })
// 结果: https://api.agentbox.lingyiwanwu.com/user-teams?user_id=123
```

### 3. 预定义端点
```typescript
import { API_ENDPOINTS } from '@/lib/api-url'

// 使用预定义端点
const signInUrl = buildApiUrl(API_ENDPOINTS.AUTH.SIGN_IN)
const teamUrl = buildApiUrl(API_ENDPOINTS.TEAM.CREATE)
```

### 4. 便捷助手函数
```typescript
import { apiUrlHelpers } from '@/lib/api-url'

// 用户团队
const userTeamsUrl = apiUrlHelpers.userTeams('user123')

// 团队成员
const teamMembersUrl = apiUrlHelpers.teamMembers('team456')

// 沙箱列表
const sandboxesUrl = apiUrlHelpers.sandboxes('running')

// 模板列表
const templatesUrl = apiUrlHelpers.templates('team789')

// API密钥
const apiKeysUrl = apiUrlHelpers.apiKeys()
const specificKeyUrl = apiUrlHelpers.apiKey('key123')
```

## 迁移指南

### 旧代码
```typescript
// ❌ 旧方式
const apiUrl = process.env.API_URL || 'https://api.agentbox.lingyiwanwu.com'
const targetUrl = `${apiUrl}/user-teams?user_id=${userId}`

// ❌ 旧方式
const targetUrl = `${clientEnv.API_URL}/access-token`
```

### 新代码
```typescript
// ✅ 新方式
import { apiUrlHelpers } from '@/lib/api-url'
const targetUrl = apiUrlHelpers.userTeams(userId)

// ✅ 新方式
const targetUrl = apiUrlHelpers.accessToken()
```

## 已更新的文件

### API 代理路由
- `app/api/proxy/user-teams/route.ts`
- `app/api/proxy/templates/route.ts`
- `app/api/proxy/sandboxes/route.ts`
- `app/api/access-token/route.ts`
- `app/api/proxy/team/route.ts`
- `app/api/proxy/api-keys/route.ts`
- `app/api/proxy/user-team-by-team/route.ts`
- `app/api/proxy/user-team/route.ts`
- `app/api/proxy/user-team/[userId]/[teamId]/route.ts`
- `app/api/proxy/user-by-ids/route.ts`
- `app/api/proxy/api-keys/[keyId]/route.ts`

### API 客户端类
- `src/lib/api/team.ts`
- `src/lib/api/sandbox.ts`
- `src/lib/api/template.ts`
- `src/lib/api/auth.ts`
- `src/lib/api.ts`

## 整合完成

所有需要统一整合的API URL构建代码已经完成更新！

## 优势

1. **统一管理**: 所有API URL构建逻辑集中在一个地方
2. **类型安全**: 提供TypeScript类型支持
3. **环境适配**: 自动处理服务端/客户端环境差异
4. **易于维护**: 修改API URL只需在一个地方
5. **减少重复**: 消除重复的URL构建代码
6. **参数处理**: 自动处理查询参数编码
