import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  history: {
    type: 'hash',
  },
  antd: {
    dark: true,
  },
  publicPath: './',
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
});
