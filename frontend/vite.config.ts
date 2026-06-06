import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'  // ← أضف دي

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // ← وأضف دي
  ],
})