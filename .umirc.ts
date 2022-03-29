import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  antd: {
    dark: true,
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
});
