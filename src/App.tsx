import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/calendar" element={<Calendar />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/weather" element={<Weather />} /> */}
      </Routes>
    </Layout>
  );
}

export default App;