import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import PhotoBooth from "@/pages/photoBooth";
import PhotoBoothGallery from "@/pages/photoBoothGallery";
import Settings from "./pages/settings";
import People from "./pages/people";
import { appConfig } from "@/config/app-config";

const routes = [
  {
    page: "dashboard",
    path: "/",
    element: <Dashboard />,
  },
  {
    page: "photoBooth",
    path: "/photobooth",
    element: <PhotoBooth />,
  },
  {
    page: "photoBoothGallery",
    path: "/images",
    element: <PhotoBoothGallery />,
  },
  {
    page: "people",
    path: "/people",
    element: <People />,
  },
  {
    page: "settings",
    path: "/settings",
    element: <Settings />,
  },
] as const;

function App() {
  return (
    <Layout>
      <Routes>
        {routes
          .filter(({ page }) => appConfig.pages[page])
          .map(({ page, path, element }) => (
            <Route key={page} path={path} element={element} />
          ))}
      </Routes>
    </Layout>
  );
}

export default App;