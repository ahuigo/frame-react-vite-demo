import * as React from "react";
import { Routes, Route, Outlet, Link, useNavigate } from "react-router-dom";
import { Button, Menu } from 'antd';
import { MenuInfo, ItemType } from 'rc-menu/lib/interface';
import { pagePaths } from "./conf/page-routes";
import {
  AppstoreOutlined,
  LeftCircleOutlined,
  MailOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { PageRoute } from './conf/page-routes.d';
import menuIcons from './conf/menu-icons';
type MenuItem = Required<MenuProps>['items'][number];

function genRouteComponents(dir: string, pageRoutes: PageRoute[]) {
  return pageRoutes.map((pageRoute) => {
    const filePath = `${dir}/${pageRoute.key}`;
    // const uriPath = `${uriDir}/${pageRoute.key}`;
    const uriPath = pageRoute.key.replace('.tsx', '');
    const isFile = pageRoute.key.match(/\.tsx$/);
    // console.log({ uriPath, filePath });
    const Page: React.LazyExoticComponent<React.ComponentType<any>> = React.lazy(() => import(/* @vite-ignore */filePath));
    // console.log(pageRoute.key, filePath, pageRoute);
    return <Route
      path={uriPath}
      key={pageRoute.key}
      element={isFile &&
        <React.Suspense fallback={<>...</>}>
          <Page />
        </React.Suspense>
      }
    >
      {pageRoute.children?.length && genRouteComponents(filePath, pageRoute.children)}
    </Route>;
  });
}

const routeComponents = ['pages/dom/drag'].map((pagePath) => {
  const filePath = "./" + pagePath;
  const uriPath = pagePath.replace("pages/", "");
  const Page = React.lazy(() => import(/* @vite-ignore */filePath));
  return <Route
    // path = "dashboard/*"
    path={uriPath}
    key={pagePath}
    element={
      <React.Suspense fallback={<>...</>}>
        <Page />
      </React.Suspense>
    }
  />;
});
export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* {routeComponents} */}
          {genRouteComponents("./pages", pagePaths)}
          <Route path="/foo">
            <Route path="/foo-one" element={<div>f one 无效</div>} />
            <Route path="foo-two" element={<div>f two</div>} />
          </Route>
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}

let menuItems: MenuItem[] = [
  { key: '1', icon: <PieChartOutlined />, label: 'Option 1' },
  {
    key: 'sub1',
    label: 'Navigation One',
    icon: <MailOutlined />,
    children: [
      {
        key: '5', label: 'Option 5',
        children: [
          { key: '6', label: 'Option 6' },
        ],
      },
    ] as MenuItem[],
  },
];
function getPageMenuItems(pagePaths: PageRoute[], level = 0): MenuItem[] {
  return pagePaths.map((pageRoute) => {
    const children = pageRoute.children ? getPageMenuItems(pageRoute.children) : undefined;
    const is_file = pageRoute.key.endsWith('.tsx');
    const key = pageRoute.key.replace('.tsx', '');
    const data = {
      key: key,
      label: pageRoute.label,
      children: children,
    } as MenuItem;
    if (level === 1) {
      // @ts-ignore
      data.icon = menuIcons[key] || menuIcons.default;
    }
    return data;
  });
}
menuItems = getPageMenuItems(pagePaths, 1);
const LeftMenu = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };


  const handleMenuClick = (item: MenuInfo) => {
    const path = item.keyPath.reverse().join('/');
    console.log(path);
    navigate(path);
  };
  const defaultSelectedKeys = React.useState(() => {
    const paths = window.location.pathname.replace(/^\/+|\/+$/g, '').split('/');
    return paths;
  })[0]
  return (
    <div className="w-[256px] relative overflow-y-auto">
      <LeftCircleOutlined onClick={toggleCollapsed} className="absolute right-0 hidden" />
      <Menu
        defaultSelectedKeys={defaultSelectedKeys}
        defaultOpenKeys={defaultSelectedKeys}
        mode="inline"
        // theme="dark"
        onClick={handleMenuClick}
        inlineCollapsed={collapsed}
        items={menuItems}
      />
    </div>
  );
};

function Layout() {
  return (
    <div className="flex flex-row">
      <div className="sticky h-screen flex">
        <LeftMenu />
      </div>
      <div className="flex flex-1">
        <Outlet />
      </div>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h2 className="text-red-500">Home</h2>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>404</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
