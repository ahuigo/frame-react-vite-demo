import * as React from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { pagePaths } from "./page-paths";
const routeComponents = pagePaths.map((pagePath) => {
  const filePath = "./" + pagePath;
  const uriPath = pagePath.replace("pages/", "");
  const Page = React.lazy(() => import(filePath));
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
          {routeComponents}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}

function Layout() {
  return (
    <div className="flex flex-row">
      <div className="border-r-2 border-solid p-2">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/lflow/base">flow</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>
      </div>
      <Outlet />
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
