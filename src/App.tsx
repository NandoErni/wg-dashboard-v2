import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import PhotoBooth from "@/pages/photoBooth";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/photobooth" element={<PhotoBooth />} />
        {/* <Route path="/calendar" element={<Calendar />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/weather" element={<Weather />} /> */}
      </Routes>
    </Layout>
  );
}

export default App;