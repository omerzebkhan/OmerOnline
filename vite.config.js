import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   esbuild: {
    legalComments: "none",
  },
  define: {
    "process.env": {},
  },
  server: {
    port: 3000, // Set your desired port here
  },
})
