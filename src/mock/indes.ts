import type { MockMethod } from 'vite-plugin-mock'
import orderMock from './order'
import marketingMock from './marketing'
import statisticsMock from './statistics'

export default [
  ...orderMock,
  ...marketingMock,
  ...statisticsMock
] as MockMethod[]