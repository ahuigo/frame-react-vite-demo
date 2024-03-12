import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import chokidar from 'chokidar';
// @ts-ignore
import fs from 'fs';
// @ts-ignore
import path from 'path';
import _ from "lodash";

const generatePagePath = _.debounce(() => {
  const root = "./src/pages";
  let result: string[] = [];

  function getFiles(dir: string) {
    fs.readdirSync(dir).forEach((file: string) => {
      const absolutePath = path.join(dir, file);
      if (fs.statSync(absolutePath).isDirectory()) {
        getFiles(absolutePath);
      } else {

        const shortPagePath = absolutePath.replace('src/', '').replace('.tsx', '');
        result.push(shortPagePath);
      }
    });
  }
  getFiles(root);
  const pagePathStr = result.map(v => `\t'${v}',\n`).join('');
  const pagePathsContent = `export const pagePaths = [\n${pagePathStr}] as const; `;
  fs.writeFileSync('./src/page-paths.ts', pagePathsContent);
  return result;
}, 500)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'watcher-plugin',
      configureServer(server) {
        const watcher = chokidar.watch('src/pages', {
          ignoreInitial: true,
        });

        // add,unlink,change
        watcher.on('all', (event: any, path: string) => {
          if (path.match(/\.tsx/)) {
            console.log(`File ${path} has been ${event}`);
            generatePagePath();
          }
        });
      },
    },
  ],
});