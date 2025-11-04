import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/super-duper-octo-couscous",
  plugins: [react()],
});

