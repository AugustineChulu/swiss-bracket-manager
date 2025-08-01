import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./layouts/App.tsx";
import Overview from "./layouts/views/Overview.tsx";
import Create from "./layouts/views/Tournament/Create.tsx";
import Manage from "./layouts/views/Tournament/Manage.tsx";
import { AppProvider } from "./AppContext.tsx";
import Tournament from "./components/Tournament/Tournament.tsx";
import Settings from "./layouts/views/Settings.tsx";
import Home from "./layouts/views/Home.tsx";
import Statistics from "./layouts/views/Statistics.tsx";

const router = createBrowserRouter([
  {
    path: "/swiss-bracket-manager/",
    element: <Home />,
  },
  {
    path: "/swiss-bracket-manager/",
    element: <App />,

    children: [
      { path: "/swiss-bracket-manager/", element: <Home /> },
      { path: "/swiss-bracket-manager/overview", element: <Overview /> },
      { path: "/swiss-bracket-manager/tournament/create", element: <Create /> },
      {
        path: "/swiss-bracket-manager/tournament/manage/:tournamentID",
        element: <Manage />,
      },
      { path: "/swiss-bracket-manager/statistics", element: <Statistics /> },
      { path: "/swiss-bracket-manager/settings", element: <Settings /> },
    ],
  },
  { path: "/swiss-bracket-manager/run/:tournamentID", element: <Tournament /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>
);
