import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {createHtmlPlugin} from "vite-plugin-html";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    createHtmlPlugin({
      inject: {
        data: {
          version: Date.now(),
        },
      },
    }),
  ],
  base: '/',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1500,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js', // Cache-busting with hashed filenames
        chunkFileNames: 'assets/[name].[hash].js', // Cache-busting for chunk files
        assetFileNames: 'assets/[name].[hash].[ext]', // Cache-busting for other assets
        manualChunks(id) {
          // Separate large dependencies like react, lodash, etc.
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@modules': path.resolve(__dirname, 'src/modules'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@redux': path.resolve(__dirname, 'src/redux'),
      '@css': path.resolve(__dirname, 'src/assets/css'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@helpers': path.resolve(__dirname, 'src/helpers'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),

    },

  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  assetsInclude: ['**/*.xlsx'],
  server: {
    host: '0.0.0.0',  // Expose the server to all network interfaces
    port: 5173,        // Use the default port or change if necessary
    headers: {
      'Cache-Control': 'no-store',
    },
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
      // only if your Django serves media at /media (optional)
      "/media": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
    },
    },
}));
