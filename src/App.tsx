import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import PhotoBooth from "@/pages/photoBooth";
import PhotoBoothGallery from "@/pages/photoBoothGallery";
import Settings from "./pages/settings";
import People from "./pages/people";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/photobooth" element={<PhotoBooth />} />
        <Route path="/images" element={<PhotoBoothGallery />} />
        {/* <Route path="/calendar" element={<Calendar />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/weather" element={<Weather />} /> */}
        <Route path="/people" element={<People />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

export default App;
