import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import PhotoBooth from "@/pages/photoBooth";
import PhotoBoothGallery from "@/pages/photoBoothGallery";

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
      </Routes>
    </Layout>
  );
}

export default App;