const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production'
    ? '/wv_demo/'  // 替換成你的 GitHub 倉庫名
    : '/'
})