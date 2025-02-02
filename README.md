# 在线点餐系统后台管理

## 项目介绍

这是一个基于 Vue 3 + TypeScript + Vite + Element Plus 开发的在线点餐系统后台管理项目。本项目采用最新的前端技术栈，提供完整的餐饮业务管理功能，包括商品管理、订单管理、会员管理、营销管理等模块。

## 技术栈

- Vue 3 - 渐进式JavaScript框架
- TypeScript - JavaScript的超集，提供类型支持
- Vite - 下一代前端构建工具
- Element Plus - 基于Vue 3的组件库
- Vue Router - Vue.js官方路由管理器
- Pinia - Vue.js的状态管理库
- Axios - 基于Promise的HTTP客户端
- SCSS - CSS预处理器

## 功能特性

### 系统管理
- 管理员管理：账号管理、权限分配、角色分配
- 角色管理：角色创建、权限分配、角色分配
- 权限管理：权限配置、权限分配、权限控制
- 系统配置：基础配置、业务配置、系统参数

### 商品管理
- 商品分类：分类管理、分类排序、分类状态
- 商品列表：商品信息、商品图片、商品规格、商品状态
- 库存管理：库存查询、库存预警、库存日志
- 价格管理：价格设置、折扣管理、批量调价

### 营销管理
- 满减活动：满减规则、活动时间、活动状态
- 优惠券管理：优惠券创建、使用规则、发放记录
- 促销活动：活动创建、活动规则、活动效果

### 订单管理
- 订单列表：订单查询、订单详情、订单状态
- 订单处理：接单处理、退单处理、订单备注
- 配送管理：配送分配、配送跟踪、配送统计

### 会员管理
- 会员列表：会员信息、消费记录、积分管理
- 会员等级：等级设置、权益管理、升级规则
- 会员营销：专属优惠、会员活动、积分商城

### 数据统计
- 销售统计：销售额、订单量、客单价
- 商品分析：热销商品、库存周转、毛利分析
- 会员分析：新增会员、活跃度、消费能力
- 营销分析：活动效果、优惠券使用、促销转化

## 开发环境

- Node.js >= 16
- npm >= 8
- Git

## 项目结构

```
src/
  ├── api/          # API 接口
  ├── assets/       # 静态资源
  ├── components/   # 公共组件
  ├── composables/  # 组合式函数
  ├── constants/    # 常量定义
  ├── directives/   # 自定义指令
  ├── layouts/      # 布局组件
  ├── mock/         # 模拟数据
  ├── router/       # 路由配置
  ├── stores/       # 状态管理
  ├── styles/       # 样式文件
  ├── types/        # 类型定义
  ├── utils/        # 工具函数
  └── views/        # 页面组件
```

## 开发指南

### 环境准备
1. 安装Node.js和npm
2. 克隆项目代码
3. 安装开发工具（推荐使用VSCode）

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 环境变量

- `.env`: 默认环境变量
- `.env.development`: 开发环境变量
- `.env.production`: 生产环境变量

### 环境变量说明
```
# API基础路径
VITE_API_BASE_URL=http://api.example.com

# 上传文件路径
VITE_UPLOAD_URL=http://upload.example.com

# 静态资源路径
VITE_PUBLIC_PATH=/

# 是否启用Mock
VITE_USE_MOCK=true
```

## 代码规范

### TypeScript规范
- 使用TypeScript编写代码
- 定义完整的类型声明
- 避免使用any类型
- 使用接口定义数据结构

### Vue组件规范
- 使用组合式API
- 组件名使用PascalCase
- props定义类型和默认值
- 使用defineProps和defineEmits

### 样式规范
- 使用SCSS预处理器
- BEM命名规范
- 避免深层嵌套
- 使用变量管理主题

## 权限控制

### RBAC权限模型
- 用户-角色-权限三层结构
- 动态路由控制
- 按钮级别权限控制
- 数据权限控制

### 权限指令
```typescript
// 使用示例
<button v-permission="['admin:user:add']">添加用户</button>
```

## 开发规范

### 命名规范
- 文件夹名：小写字母，多个单词用连字符（-）连接
- 组件名：大驼峰命名（PascalCase）
- 变量名：小驼峰命名（camelCase）
- 常量名：大写字母，多个单词用下划线（_）连接
- CSS类名：小写字母，多个单词用连字符（-）连接

### 注释规范
```typescript
/**
 * 组件描述
 * @author 作者
 * @date 2024-01-15
 */

/**
 * 函数描述
 * @param {string} param1 - 参数1描述
 * @param {number} param2 - 参数2描述
 * @returns {boolean} 返回值描述
 */
```

## 部署指南

### 构建部署
1. 修改生产环境配置
2. 执行构建命令
3. 上传dist目录
4. 配置Nginx

### Nginx配置示例
```nginx
server {
    listen 80;
    server_name admin.example.com;

    location / {
        root /path/to/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://api.example.com;
    }
}
```

## 待改进功能

### 功能完善
- [ ] 订单管理模块优化
- [ ] 会员管理功能增强
- [ ] 数据导出功能
- [ ] 报表打印功能
- [ ] 系统监控功能
- [ ] 消息通知功能

### 技术改进
- [ ] 添加单元测试
- [ ] 集成E2E测试
- [ ] 引入CI/CD流程
- [ ] 性能优化
- [ ] 首屏加载优化
- [ ] 错误监控系统

### 文档完善
- [ ] API文档
- [ ] 组件文档
- [ ] 开发文档
- [ ] 部署文档
- [ ] 变更日志

## 常见问题

### 跨域问题
开发环境下，通过Vite的代理功能解决跨域问题：
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://api.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### 权限问题
1. 登录成功后获取用户权限列表
2. 根据权限列表动态生成路由
3. 使用权限指令控制按钮权限

### 性能优化
1. 路由懒加载
2. 组件按需加载
3. 图片懒加载
4. 虚拟滚动
5. 数据缓存
6. 打包优化

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 创建Pull Request

## 版权信息

Copyright (c) 2024 Your Company Name
