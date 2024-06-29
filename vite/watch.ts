import chokidar from 'chokidar';
// @ts-ignore
import fs, { createReadStream } from 'fs';
// @ts-ignore
import path from 'path';
import rreadline, { createInterface } from 'readline';
import { resolve as pathResolve } from 'path';
import _ from "lodash";

async function readFirstLine(path: string) {
  const inputStream = createReadStream(path);
  try {
    for await (const line of createInterface(inputStream)) return line;
    return ''; // If the file is empty.
  }
  finally {
    inputStream.destroy(); // Destroy file stream.
  }
}
async function getPageTitle(path: string) {
  const content = await readFirstLine(path);
  const title = content.match(/^\/\/\s*title:\s*(\S.+)/)?.[1];
  return title || path.replace('.tsx', '').split('/').pop() as string;
}

interface MenuItem {
  key: string;
  label: string;
  is_file?: boolean;
  children?: MenuItem[];
}
export const generatePagePath = _.debounce(async () => {
  const root = "./src/pages";
  let pagePathTitleList: { path: string, title: string; }[] = [];
  // const menuItems = [] as MenuItem[];

  async function genMenuItemFromRoot(dir: string, menuItems: MenuItem[] = []) {
    for (const file of fs.readdirSync(dir)) {
      const absolutePath = path.join(dir, file);
      if (fs.statSync(absolutePath).isDirectory()) {
        const menuItem: MenuItem = {
          key: file,
          label: file,
          children: [],
        };
        menuItems.push(menuItem);
        await genMenuItemFromRoot(absolutePath, menuItem.children!);
        if (!menuItem.children?.length) {
          menuItems.pop();
        }
      } else {
        if (absolutePath.match(/\.tsx$/)) {
          const title = await getPageTitle(absolutePath);
          const shortPagePath = absolutePath.replace('src/', '').replace('.tsx', '');
          menuItems.push({ key: file, label: title });
          // pagePathTitleList.push({ path: shortPagePath, title: await getPageTitle(absolutePath) });
        }
      }
    };
    return menuItems;
  }
  const menuItems = await genMenuItemFromRoot(root, []);
  const menuItemsjs = JSON.stringify(menuItems, null, 2);
  const pagePathsContent = `import { PageRoute } from './page-routes.d';
export const pagePaths:PageRoute[] = ${menuItemsjs} as const; `;
  fs.writeFileSync('./src/conf/page-routes.ts', pagePathsContent);
  return pagePathTitleList;
}, 500);