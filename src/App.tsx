import * as React from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";


const pagePaths = [
  'pages/About',
  'pages/Dashboard',
] as const;


export default function App() {
  return (
    <div>
      <h1>Lazy Route</h1>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {pagePaths.map((pagePath) => {
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
          })}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}

function Layout() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/dashboard/messages">Dashboard</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
