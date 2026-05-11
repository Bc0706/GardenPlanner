import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// For GitHub Pages project sites, change this to your repository name.
// Example: base: '/garden-layout-planner/'
export default defineConfig({
  plugins: [react()],
  base: './'
});
