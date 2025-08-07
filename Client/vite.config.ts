import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    hmr: {
      overlay: false // Disable HMR overlay for errors
    },
    port: 5174, // Change to your desired port
    open: true, // Automatically open the browser
  },
  assetsInclude: ['**/*.jfif', '**/*.jpg', '**/*.jpeg', '**/*.png'], // Explicitly include image formats
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.jfif', '.jpg', '.jpeg', '.png'], // Ensure Vite recognizes these extensions
    alias: {
      '~/': '/src/' // Optional: Simplify imports if needed
    }
  }
});