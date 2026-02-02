import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public', // Explicitly set public directory
  server: {
    port: 5175,   // 👈 set frontend port here
    strictPort: true, // fail if port is already in use
  },
});
