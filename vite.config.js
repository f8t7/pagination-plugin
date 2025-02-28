import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron/simple';

export default defineConfig({
  plugins: [react(),
    electron({
      main: {
        // 主进程入口文件
        entry: 'electron/main.js',
      },
      preload: {
        // 预加载脚本入口文件
        input: 'electron/preload.js',
      },
      // 可选：启用渲染进程支持 Node.js API
      renderer: {},
    }),
  ],
  build: {
    outDir: 'dist',
    base: './', // 强制相对路径
    rollupOptions: {
      input: './index.html',
      output: {
        // 确保所有输出文件以 assets/ 开头，相对 dist
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    },
    // 禁用 public 目录的根路径影响
    publicDir: false
  },
  css: {
    // 确保 CSS 输出路径与 assets 一致
    outputStyle: 'expanded',
    modules: false
  }
});