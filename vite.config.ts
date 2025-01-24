import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_API_BASE_URL, VITE_USE_PROXY, VITE_PROXY_PATH, VITE_USE_MOCK } = env
  const isDev = mode === 'development'

  return {
    plugins: [
      vue(),
      viteMockServe({
        mockPath: 'src/mock',
        enable: VITE_USE_MOCK === 'true',
        watchFiles: true,
        logger: true
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables.scss" as *;`,
        },
      },
    },
    server: {
      host: 'localhost',
      port: 3100,
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: VITE_USE_MOCK === 'true' ? 'http://localhost:3100' : VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    },
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      cssCodeSplit: true,
      sourcemap: true,
      minify: isDev ? false : 'terser',
      terserOptions: {
        compress: {
          drop_console: env.VITE_DROP_CONSOLE === 'true',
          drop_debugger: !isDev,
        },
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },
  }
})
