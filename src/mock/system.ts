import type { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'
import type { 
  Admin, 
  Role, 
  Permission,
  LoginParams,
  LoginResult,
  ChangePasswordParams,
  SystemConfig
} from '@/types/system'

// 生成管理员数据
const generateAdmins = (count: number): Admin[] => {
  return Array.from({ length: count }, () => ({
    id: Mock.Random.id(),
    username: Mock.Random.word(5, 10),
    nickname: Mock.Random.cname(),
    avatar: Mock.Random.image('100x100'),
    email: Mock.Random.email(),
    phone: Mock.Random.string('number', 11),
    roleIds: [Mock.Random.id()],
    status: Mock.Random.pick(['active', 'inactive']),
    lastLoginTime: Mock.Random.datetime(),
    createTime: Mock.Random.datetime(),
    updateTime: Mock.Random.datetime()
  }))
}

// 生成角色数据
const generateRoles = (count: number): Role[] => {
  return Array.from({ length: count }, () => ({
    id: Mock.Random.id(),
    name: Mock.Random.word(4, 8),
    description: Mock.Random.sentence(10, 20),
    permissionIds: [Mock.Random.id(), Mock.Random.id()],
    createTime: Mock.Random.datetime(),
    updateTime: Mock.Random.datetime()
  }))
}

// 生成权限数据
const generatePermissions = (): Permission[] => {
  const modules = ['system', 'user', 'order', 'product', 'marketing']
  const actions = ['view', 'add', 'edit', 'delete']
  
  return modules.flatMap(module => 
    actions.map(action => ({
      id: Mock.Random.id(),
      module,
      name: `${module}_${action}`,
      description: `Permission to ${action} ${module}`,
      createTime: Mock.Random.datetime(),
      updateTime: Mock.Random.datetime()
    }))
  )
}

// 生成系统配置数据
const generateSystemConfigs = (count: number): SystemConfig[] => {
  return Array.from({ length: count }, () => ({
    id: Mock.Random.id(),
    key: Mock.Random.word(5, 10),
    value: Mock.Random.word(5, 20),
    description: Mock.Random.sentence(10, 20),
    createTime: Mock.Random.datetime(),
    updateTime: Mock.Random.datetime()
  }))
}

// Mock 接口
export default [
  // 登录相关
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }: { body: LoginParams }) => {
      const { username, password } = body
      // 这里可以添加用户名密码验证逻辑
      return {
        code: 0,
        message: 'success',
        data: {
          token: Mock.Random.string(32),
          user: generateAdmins(1)[0]
        }
      }
    }
  },
  {
    url: '/api/auth/logout',
    method: 'post',
    response: () => {
      return {
        code: 0,
        message: 'success'
      }
    }
  },
  {
    url: '/api/auth/change-password',
    method: 'post',
    response: ({ body }: { body: ChangePasswordParams }) => {
      return {
        code: 0,
        message: 'success'
      }
    }
  },

  // 管理员相关
  {
    url: '/api/admin/list',
    method: 'get',
    response: ({ query }: { query: { page: number; pageSize: number } }) => {
      const { page = 1, pageSize = 10 } = query
      const admins = generateAdmins(100)
      const start = (page - 1) * pageSize
      const end = start + pageSize
      
      return {
        code: 0,
        message: 'success',
        data: {
          list: admins.slice(start, end),
          total: admins.length
        }
      }
    }
  },
  {
    url: '/api/admin/create',
    method: 'post',
    response: ({ body }: { body: Partial<Admin> }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: Mock.Random.id(),
          ...body,
          createTime: Mock.Random.datetime(),
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },
  {
    url: '/api/admin/:id',
    method: 'put',
    response: ({ params, body }: { params: { id: string }; body: Partial<Admin> }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: params.id,
          ...body,
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },
  {
    url: '/api/admin/:id',
    method: 'delete',
    response: ({ params }: { params: { id: string } }) => {
      return {
        code: 0,
        message: 'success'
      }
    }
  },

  // 角色相关
  {
    url: '/api/role/list',
    method: 'get',
    response: ({ query }: { query: { page: number; pageSize: number } }) => {
      const { page = 1, pageSize = 10 } = query
      const roles = generateRoles(50)
      const start = (page - 1) * pageSize
      const end = start + pageSize
      
      return {
        code: 0,
        message: 'success',
        data: {
          list: roles.slice(start, end),
          total: roles.length
        }
      }
    }
  },
  {
    url: '/api/role/create',
    method: 'post',
    response: ({ body }: { body: Partial<Role> }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: Mock.Random.id(),
          ...body,
          createTime: Mock.Random.datetime(),
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },
  {
    url: '/api/role/:id',
    method: 'put',
    response: ({ params, body }: { params: { id: string }; body: Partial<Role> }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: params.id,
          ...body,
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },
  {
    url: '/api/role/:id',
    method: 'delete',
    response: ({ params }: { params: { id: string } }) => {
      return {
        code: 0,
        message: 'success'
      }
    }
  },

  // 权限相关
  {
    url: '/api/permission/list',
    method: 'get',
    response: () => {
      return {
        code: 0,
        message: 'success',
        data: generatePermissions()
      }
    }
  },
  {
    url: '/api/permission/create',
    method: 'post',
    response: ({ body }: { body: Partial<Permission> }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: Mock.Random.id(),
          ...body,
          createTime: Mock.Random.datetime(),
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },
  {
    url: '/api/permission/:id',
    method: 'put',
    response: ({ params, body }: { params: { id: string }; body: Partial<Permission> }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: params.id,
          ...body,
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },
  {
    url: '/api/permission/:id',
    method: 'delete',
    response: ({ params }: { params: { id: string } }) => {
      return {
        code: 0,
        message: 'success'
      }
    }
  },

  // 系统配置相关
  {
    url: '/api/system-config/list',
    method: 'get',
    response: ({ query }: { query: { page: number; pageSize: number } }) => {
      const { page = 1, pageSize = 10 } = query
      const configs = generateSystemConfigs(30)
      const start = (page - 1) * pageSize
      const end = start + pageSize
      
      return {
        code: 0,
        message: 'success',
        data: {
          list: configs.slice(start, end),
          total: configs.length
        }
      }
    }
  },
  {
    url: '/api/system-config/create',
    method: 'post',
    response: ({ body }: { body: Partial<SystemConfig> }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: Mock.Random.id(),
          ...body,
          createTime: Mock.Random.datetime(),
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },
  {
    url: '/api/system-config/:id',
    method: 'put',
    response: ({ params, body }: { params: { id: string }; body: Partial<SystemConfig> }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: params.id,
          ...body,
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },
  {
    url: '/api/system-config/:id',
    method: 'delete',
    response: ({ params }: { params: { id: string } }) => {
      return {
        code: 0,
        message: 'success'
      }
    }
  }
] as MockMethod[] 