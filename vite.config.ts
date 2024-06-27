import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import chokidar from 'chokidar';
import { generatePagePath } from './vite/watch';
// @ts-ignore
import { resolve as pathResolve } from 'path';
import _ from "lodash";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': pathResolve(__dirname, 'src'),
      '#root': pathResolve(__dirname)
    }
  },
  test: {
    environment: 'jsdom',
  },
  plugins: [
    react(),
    {
      name: 'watcher-plugin',
      configureServer(server) {
        const watcher = chokidar.watch('src/pages', {
          ignoreInitial: true,
        });
        watcher.on('all', (event: any, path: string) => {
          console.log('abc:', event, path);
          if (!['add', 'unlink', 'change'].includes(event)) {
            return;
          }
          if (path.match(/\.tsx/)) {
            console.log(`File ${path} has been ${event}`);
            generatePagePath();
          }
        });
      },
    },
  ],
});
