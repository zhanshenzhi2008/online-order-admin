# 在线点餐系统管理后台

基于 Vue 3 + TypeScript + Element Plus + Pinia 的在线点餐系统管理后台。

## 技术栈

- Vue 3
- TypeScript
- Element Plus
- Pinia
- Vue Router
- Axios
- Mock.js
- ECharts
- Sass

## 项目结构

```
src/
├── api/                # API接口
├── assets/             # 静态资源
├── components/         # 公共组件
├── composables/        # 组合式函数
├── layouts/            # 布局组件
├── mock/               # Mock数据
├── router/             # 路由配置
├── stores/             # Pinia状态管理
├── styles/             # 全局样式
├── types/              # TypeScript类型定义
├── utils/              # 工具函数
└── views/              # 页面组件
    ├── dashboard/      # 仪表盘
    ├── shop/           # 商铺管理
    ├── food/           # 商品管理
    ├── order/          # 订单管理
    ├── user/           # 用户管理
    └── system/         # 系统管理
```

## 功能模块

1. 仪表盘
   - 销售统计
   - 订单统计
   - 用户统计
   - 商品统计

2. 商铺管理
   - 商铺列表
   - 商铺审核
   - 商铺分类
   - 商铺评价

3. 商品管理
   - 商品列表
   - 商品分类
   - 商品规格
   - 商品评价

4. 订单管理
   - 订单列表
   - 订单详情
   - 订单统计
   - 退款管理

5. 用户管理
   - 用户列表
   - 用户详情
   - 用户权限
   - 用户反馈

6. 系统管理
   - 角色管理
   - 权限管理
   - 菜单管理
   - 系统设置

## 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 代码规范

- 使用ESLint进行代码检查
- 使用Prettier进行代码格式化
- 遵循Vue 3官方风格指南
- 使用TypeScript类型检查

## 浏览器支持

- Chrome
- Firefox
- Safari
- Edge
