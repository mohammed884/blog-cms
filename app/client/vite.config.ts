import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteCompression(), react()],
  define: {
    'process.env': process.env,
  },
  server: {
    // Set host to '0.0.0.0' to listen on all network interfaces
    // or set to your specific local IP address
    // host: '0.0.0.0'
  },
});