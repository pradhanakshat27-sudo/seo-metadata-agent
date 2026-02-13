import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/webhook': {
          target: env.N8N_URL || 'http://localhost:5678',
          changeOrigin: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('[proxy error]', err.message);
            });
            proxy.on('proxyReq', (_proxyReq, req, _res) => {
              console.log('[proxy]', req.method, req.url, '→', env.N8N_URL || 'http://localhost:5678');
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('[proxy response]', proxyRes.statusCode, req.url);
            });
          },
        },
      },
    },
  };
});
